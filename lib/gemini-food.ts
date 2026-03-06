import {
  dataUrlToInlineData,
  generateWithGemini,
  parseJsonResponse,
} from "@/lib/gemini";

export type FoodImageItem = {
  name: string;
  weight_g: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

export type FoodImageAnalysis = {
  dish_name: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;
  items: FoodImageItem[];
};

const FOOD_SYSTEM_PROMPT =
  'You are an expert nutritionist. Analyze this image and identify the visible food items, estimating their weight in grams. Calculate the calories and macros. You MUST return ONLY a valid JSON object with the exact structure: { "dish_name": "string", "total_calories": number, "total_protein": number, "total_carbs": number, "total_fat": number, "total_fiber": number, "items": [ { "name": "string", "weight_g": number, "calories": number, "protein": number, "carbs": number, "fat": number, "fiber": number } ] }. Do not include any markdown formatting.';

function normalizeToInlineData(imageBase64OrDataUrl: string): {
  mimeType: string;
  data: string;
} {
  if (imageBase64OrDataUrl.startsWith("data:")) {
    return dataUrlToInlineData(imageBase64OrDataUrl);
  }

  // Assume plain base64 JPEG if client sends raw base64 without data URL header.
  return {
    mimeType: "image/jpeg",
    data: imageBase64OrDataUrl,
  };
}

export async function analyzeFoodImageBase64(
  imageBase64OrDataUrl: string,
): Promise<FoodImageAnalysis> {
  const inlineData = normalizeToInlineData(imageBase64OrDataUrl);

  // Required debug signal: verify a fresh image payload is being sent.
  console.log(`[Gemini] outgoing base64 length: ${inlineData.data.length}`);

  const raw = await generateWithGemini(
    [
      {
        role: "user",
        parts: [
          {
            text: "Analyze this food image and return the required JSON object.",
          },
          { inlineData: inlineData },
        ],
      },
    ],
    {
      responseMimeType: "application/json",
      systemPrompt: FOOD_SYSTEM_PROMPT,
    },
  );

  const parsed = parseJsonResponse<FoodImageAnalysis>(raw);
  return {
    dish_name: parsed.dish_name,
    total_calories: Number(parsed.total_calories) || 0,
    total_protein: Number(parsed.total_protein) || 0,
    total_carbs: Number(parsed.total_carbs) || 0,
    total_fat: Number(parsed.total_fat) || 0,
    total_fiber: Number(parsed.total_fiber) || 0,
    items: (parsed.items || []).map((item) => ({
      name: item.name,
      weight_g: Number(item.weight_g) || 0,
      calories: Number(item.calories) || 0,
      protein: Number(item.protein) || 0,
      carbs: Number(item.carbs) || 0,
      fat: Number(item.fat) || 0,
      fiber: Number(item.fiber) || 0,
    })),
  };
}
