import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { MealSuggestion } from '@/lib/types'

type RegenerateMealBody = {
  customPrompt?: string
  currentMeals?: MealSuggestion[]
}

type RegeneratedMeal = Pick<
  MealSuggestion,
  'name' | 'calories' | 'protein' | 'carbs' | 'fat' | 'description' | 'imageUrl' | 'imageKeyword'
>

const FALLBACK_FOOD_IMAGE_URL = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'

type PexelsPhotoResponse = {
  photos?: Array<{
    src?: {
      medium?: string
      large?: string
    }
  }>
}

const DISALLOWED_BEVERAGE_KEYWORDS = [
  'drink',
  'smoothie',
  'juice',
  'shake',
  'tea',
  'coffee',
  'latte',
  'soda',
  'cocktail',
]

function toRoundedPositiveInt(value: unknown): number {
  const normalized =
    typeof value === 'string' ? Number.parseFloat(value.trim()) : Number(value)

  if (!Number.isFinite(normalized)) {
    return 0
  }

  return Math.max(0, Math.round(normalized))
}

function isSolidFoodSuggestion(name: string, description: string): boolean {
  const haystack = `${name} ${description}`.toLowerCase()
  return !DISALLOWED_BEVERAGE_KEYWORDS.some((keyword) => haystack.includes(keyword))
}

function normalizeRegeneratedMeal(meal: Partial<RegeneratedMeal> & Record<string, unknown>): RegeneratedMeal | null {
  const name = typeof meal.name === 'string' ? meal.name.trim() : ''
  const description = typeof meal.description === 'string' ? meal.description.trim() : ''
  const imageKeyword = typeof meal.imageKeyword === 'string' ? meal.imageKeyword.trim() : ''
  const calories = toRoundedPositiveInt(meal.calories)
  const protein = toRoundedPositiveInt(meal.protein)
  const carbs = toRoundedPositiveInt(meal.carbs)
  const fat = toRoundedPositiveInt(meal.fat ?? meal.fats)

  if (!name || !description || !imageKeyword) {
    return null
  }

  if (!isSolidFoodSuggestion(name, description)) {
    return null
  }

  if (calories <= 0 || protein <= 0 || carbs <= 0 || fat <= 0) {
    return null
  }

  return {
    name,
    description,
    calories,
    protein,
    carbs,
    fat,
    imageKeyword,
  }
}

async function getMealImageUrl(mealName: string, imageKeyword?: string) {
  if (!process.env.PEXELS_API_KEY) {
    return FALLBACK_FOOD_IMAGE_URL
  }

  try {
    const pexelsResponse = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(imageKeyword || mealName)}&per_page=1`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
        cache: 'no-store',
      },
    )

    if (!pexelsResponse.ok) {
      return FALLBACK_FOOD_IMAGE_URL
    }

    const pexelsPayload = (await pexelsResponse.json()) as PexelsPhotoResponse
    const firstPhoto = pexelsPayload.photos?.[0]
    return firstPhoto?.src?.large || firstPhoto?.src?.medium || FALLBACK_FOOD_IMAGE_URL
  } catch {
    return FALLBACK_FOOD_IMAGE_URL
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as RegenerateMealBody | null
  const customPrompt = body?.customPrompt?.trim()
  const currentMeals = Array.isArray(body?.currentMeals) ? body?.currentMeals : null

  if (!customPrompt) {
    return NextResponse.json({ success: false, message: 'customPrompt is required' }, { status: 400 })
  }

  if (!currentMeals) {
    return NextResponse.json({ success: false, message: 'currentMeals is required' }, { status: 400 })
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ success: false, message: 'Missing GEMINI_API_KEY' }, { status: 500 })
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
      systemInstruction: `You are an expert nutritionist AI. The user currently has these meals suggested: ${JSON.stringify(
        currentMeals,
      )}. They deleted a meal and requested a new suggestion with this preference: ${customPrompt}. Respond ONLY with a valid JSON object representing one new meal. It must have these exact keys: name (string), calories (number), protein (number), carbs (number), fat (number), description (string), and imageKeyword (string). The suggestion must be a realistic solid food meal, never a beverage. Do not suggest smoothies, juices, shakes, coffees, teas, cocktails, or drinks of any kind. calories, protein, carbs, and fat must all be accurate non-zero integers. imageKeyword must be a very simple 1-2 word term optimized for stock photo searches, such as "lentil soup", "salad bowl", or "stir fry". Do not use long descriptive names for this field.`,
    })

    const result = await model.generateContent('Generate one replacement meal suggestion.')
    const responseText = result.response.text()
    const parsedMeal = JSON.parse(responseText) as Partial<RegeneratedMeal> & Record<string, unknown>
    const normalizedMeal = normalizeRegeneratedMeal(parsedMeal)

    if (!normalizedMeal) {
      return NextResponse.json({ success: false, message: 'Gemini returned an invalid meal object' }, { status: 502 })
    }

    const imageUrl = await getMealImageUrl(normalizedMeal.name, normalizedMeal.imageKeyword)

    return NextResponse.json({
      success: true,
      meal: {
        name: normalizedMeal.name,
        description: normalizedMeal.description,
        calories: normalizedMeal.calories,
        protein: normalizedMeal.protein,
        carbs: normalizedMeal.carbs,
        fat: normalizedMeal.fat,
        imageUrl,
        imageKeyword: normalizedMeal.imageKeyword,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to regenerate meal',
      },
      { status: 500 },
    )
  }
}
