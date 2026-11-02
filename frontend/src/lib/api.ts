import type { NutritionResult } from "@/types/nutrition";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function analyzeMeal(image: File): Promise<NutritionResult> {
  const formData = new FormData();
  formData.append("image", image);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/nutrition/analyze`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error(
      "Could not reach the CalloAI service. Check that the backend is running and try again.",
    );
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : "We could not analyze that image. Please try another photo.";
    throw new Error(message);
  }

  if (!isNutritionResult(payload)) {
    throw new Error("The nutrition service returned an unexpected response.");
  }

  return payload;
}

function isNutritionResult(value: unknown): value is NutritionResult {
  if (typeof value !== "object" || value === null) return false;
  const result = value as Record<string, unknown>;

  return (
    typeof result.food_name === "string" &&
    ["calories", "protein", "carbs", "fat"].every(
      (key) =>
        typeof result[key] === "number" &&
        Number.isFinite(result[key]) &&
        result[key] >= 0,
    )
  );
}
