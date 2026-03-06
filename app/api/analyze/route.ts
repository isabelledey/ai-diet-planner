import { NextRequest, NextResponse } from "next/server";
import { analyzeFoodImageBase64 } from "@/lib/gemini-food";
import type { MealAnalysis } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const image = body?.image as string | undefined;

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image is required" },
        { status: 400 },
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error(
        "[API Error] GEMINI_API_KEY is missing from environment variables.",
      );
      return NextResponse.json(
        { success: false, message: "API key missing" },
        { status: 500 },
      );
    }

    console.log("[API Route] Sending image to Gemini...");
    const parsed = await analyzeFoodImageBase64(image);

    const analysis: MealAnalysis = {
      name: parsed.dish_name || "Analyzed Meal",
      calories: Math.max(0, Math.round(parsed.total_calories)),
      protein: Math.max(0, Math.round(parsed.total_protein)),
      carbs: Math.max(0, Math.round(parsed.total_carbs)),
      fat: Math.max(0, Math.round(parsed.total_fat)),
      fiber: Math.max(0, Math.round(parsed.total_fiber)),
      items: (parsed.items || []).map((item) => ({
        name: item.name,
        portion: `${Math.max(0, Math.round(item.weight_g))}g`,
        calories: Math.max(0, Math.round(item.calories)),
        protein: Math.max(0, Math.round(item.protein)),
        carbs: Math.max(0, Math.round(item.carbs)),
        fat: Math.max(0, Math.round(item.fat)),
      })),
    };

    console.log("[API Route] Success! Returning real analysis.");
    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    // THIS IS THE CRUCIAL CHANGE: We actually log the error now!
    console.error("[API Route] Gemini Analysis Failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to analyze meal",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
