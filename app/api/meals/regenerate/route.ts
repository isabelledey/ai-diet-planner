import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { MealSuggestion } from '@/lib/types'

type RegenerateMealBody = {
  customPrompt?: string
  currentMeals?: MealSuggestion[]
}

type RegeneratedMeal = Pick<MealSuggestion, 'name' | 'calories' | 'protein' | 'carbs' | 'fat' | 'description'>

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
      )}. They deleted a meal and requested a new suggestion with this preference: ${customPrompt}. Respond ONLY with a valid JSON object representing one new meal. It must have these exact keys: name (string), calories (number), protein (number), carbs (number), fat (number), and description (string).`,
    })

    const result = await model.generateContent('Generate one replacement meal suggestion.')
    const responseText = result.response.text()
    const parsedMeal = JSON.parse(responseText) as Partial<RegeneratedMeal>

    if (
      typeof parsedMeal.name !== 'string'
      || typeof parsedMeal.description !== 'string'
      || typeof parsedMeal.calories !== 'number'
      || typeof parsedMeal.protein !== 'number'
      || typeof parsedMeal.carbs !== 'number'
      || typeof parsedMeal.fat !== 'number'
    ) {
      return NextResponse.json({ success: false, message: 'Gemini returned an invalid meal object' }, { status: 502 })
    }

    return NextResponse.json({
      success: true,
      meal: {
        name: parsedMeal.name,
        description: parsedMeal.description,
        calories: parsedMeal.calories,
        protein: parsedMeal.protein,
        carbs: parsedMeal.carbs,
        fat: parsedMeal.fat,
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
