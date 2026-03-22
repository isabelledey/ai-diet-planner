import { NextRequest, NextResponse } from 'next/server'
import { getMockSuggestions } from '@/lib/nutrition'
import { generateWithGemini, parseJsonResponse } from '@/lib/gemini'
import type { UserProfile, MealSuggestion } from '@/lib/types'

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

function normalizeMealSuggestion(
  suggestion: Partial<MealSuggestion> & Record<string, unknown>,
  remainingCalories: number,
): MealSuggestion | null {
  const mealType =
    typeof suggestion.mealType === 'string' ? suggestion.mealType.toLowerCase() : ''
  const allowedMealTypes = new Set(['breakfast', 'lunch', 'dinner', 'snack'])
  const name = typeof suggestion.name === 'string' ? suggestion.name.trim() : ''
  const description =
    typeof suggestion.description === 'string' && suggestion.description.trim()
      ? suggestion.description.trim()
      : 'Balanced solid meal'
  const calories = toRoundedPositiveInt(suggestion.calories)
  const protein = toRoundedPositiveInt(suggestion.protein)
  const carbs = toRoundedPositiveInt(suggestion.carbs)
  const fat = toRoundedPositiveInt(suggestion.fat ?? suggestion.fats)

  if (!name || !allowedMealTypes.has(mealType)) {
    return null
  }

  if (!isSolidFoodSuggestion(name, description)) {
    return null
  }

  if (calories <= 0 || protein <= 0 || carbs <= 0 || fat <= 0 || calories > remainingCalories) {
    return null
  }

  return {
    name,
    description,
    calories,
    protein,
    carbs,
    fat,
    imageKeyword:
      typeof suggestion.imageKeyword === 'string' && suggestion.imageKeyword.trim()
        ? suggestion.imageKeyword.trim()
        : name,
    mealType: mealType as MealSuggestion['mealType'],
  }
}

async function getMealImageUrl(mealName: string, imageKeyword?: string) {
  if (!process.env.PEXELS_API_KEY) {
    return FALLBACK_FOOD_IMAGE_URL
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(imageKeyword || mealName)}&per_page=1`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      return FALLBACK_FOOD_IMAGE_URL
    }

    const payload = (await response.json()) as PexelsPhotoResponse
    const firstPhoto = payload.photos?.[0]
    return firstPhoto?.src?.large || firstPhoto?.src?.medium || FALLBACK_FOOD_IMAGE_URL
  } catch {
    return FALLBACK_FOOD_IMAGE_URL
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { remainingCalories, preferences, mealType, profile, consumedToday } = body as {
    remainingCalories: number
    preferences?: string[]
    mealType?: MealSuggestion['mealType']
    profile?: UserProfile
    consumedToday?: { calories: number; protein: number; carbs: number; fat: number; fiber?: number }
  }

  if (remainingCalories === undefined) {
    return NextResponse.json(
      { success: false, message: 'remainingCalories is required' },
      { status: 400 },
    )
  }

  if (!process.env.GEMINI_API_KEY) {
    const suggestions = getMockSuggestions(remainingCalories, preferences || [], mealType)
    const suggestionsWithImages = await Promise.all(
      suggestions.map(async (suggestion) => ({
        ...suggestion,
        imageUrl: await getMealImageUrl(suggestion.name, suggestion.imageKeyword),
      })),
    )
    return NextResponse.json({
      success: true,
      suggestions: suggestionsWithImages,
    })
  }

  try {
    const profileSummary = profile
      ? {
          goal: profile.goal,
          activityLevel: profile.activityLevel,
          foodPreferences: profile.foodPreferences,
          dailyCalorieTarget: profile.dailyCalorieTarget,
          age: profile.age,
          gender: profile.gender,
          height: profile.height,
          heightUnit: profile.heightUnit,
          weight: profile.weight,
          weightUnit: profile.weightUnit,
        }
      : null

    const prompt = `
Create exactly 3 meal suggestions in strict JSON array format.
Return only a JSON array, with no markdown and no extra text.
Each item schema:
{
  "name": string,
  "description": string,
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "imageKeyword": string,
  "mealType": "breakfast" | "lunch" | "dinner" | "snack"
}

Constraints:
- remainingCalories: ${remainingCalories}
- mealType (optional): ${mealType || 'any'}
- explicit preferences: ${JSON.stringify(preferences || [])}
- profile: ${JSON.stringify(profileSummary)}
- consumedToday: ${JSON.stringify(consumedToday || null)}
- Must align with user's goal and diet preferences.
- Every suggestion must be a practical solid food meal or snack, never a beverage.
- Do not suggest smoothies, juices, shakes, coffees, teas, cocktails, or drinks of any kind.
- Prefer diverse plated foods such as bowls, wraps, salads, egg dishes, stir-fries, grain bowls, yogurt bowls, soups, sandwiches, pasta, rice dishes, or roasted protein with vegetables.
- Every suggestion calories <= remainingCalories.
- calories, protein, carbs, and fat must all be accurate non-zero integers.
- Avoid returning 0 for any macro field.
- Practical, realistic dishes with a normal serving size.
- imageKeyword must be a very simple 1-2 word term optimized for stock photo searches, such as "lentil soup", "salad bowl", or "stir fry". Do not use long descriptive names for this field.
`.trim()

    const raw = await generateWithGemini(
      [{ role: 'user', parts: [{ text: prompt }] }],
      { responseMimeType: 'application/json' },
    )
    const parsed = parseJsonResponse<MealSuggestion[]>(raw)

    const suggestions = (parsed || [])
      .map((s) => normalizeMealSuggestion((s || {}) as Partial<MealSuggestion> & Record<string, unknown>, remainingCalories))
      .filter((s): s is MealSuggestion => Boolean(s))
      .slice(0, 3)

    if (suggestions.length > 0) {
      const suggestionsWithImages = await Promise.all(
        suggestions.map(async (suggestion) => ({
          ...suggestion,
          imageUrl: await getMealImageUrl(suggestion.name, suggestion.imageKeyword),
        })),
      )

      return NextResponse.json({
        success: true,
        suggestions: suggestionsWithImages,
      })
    }
  } catch {
    // Fallback below
  }

  const suggestions = getMockSuggestions(remainingCalories, preferences || [], mealType)
  const suggestionsWithImages = await Promise.all(
    suggestions.map(async (suggestion) => ({
      ...suggestion,
      imageUrl: await getMealImageUrl(suggestion.name, suggestion.imageKeyword),
    })),
  )

  return NextResponse.json({
    success: true,
    suggestions: suggestionsWithImages,
  })
}
