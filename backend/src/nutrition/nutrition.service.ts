import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { Schema } from "@google/generative-ai";
import type { Express } from "express";
import type { NutritionResult } from "./nutrition.types";

const RESPONSE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    food_name: { type: SchemaType.STRING },
    calories: { type: SchemaType.NUMBER },
    protein: { type: SchemaType.NUMBER },
    carbs: { type: SchemaType.NUMBER },
    fat: { type: SchemaType.NUMBER },
  },
  required: ["food_name", "calories", "protein", "carbs", "fat"],
} satisfies Schema;

const SYSTEM_INSTRUCTION = `You are CalloAI, a careful food and nutrition estimation assistant.
Analyze the supplied food photograph and estimate nutrition for the visible serving.
Return only one JSON object matching the supplied schema with exactly these keys:
food_name (a concise descriptive name), calories (kcal), protein (grams),
carbs (grams), and fat (grams). Values must be non-negative numbers.
Use realistic estimates based on visible ingredients and portion sizes. Do not
include markdown, explanations, confidence scores, or additional keys. If the
image does not clearly show food, return food_name "Food not recognised" and set
all nutrition values to 0. These are estimates, not medical advice.`;

@Injectable()
export class NutritionService {
  private readonly logger = new Logger(NutritionService.name);

  constructor(private readonly config: ConfigService) {}

  async analyze(image: Express.Multer.File): Promise<NutritionResult> {
    const apiKey = this.config.get<string>("GEMINI_API_KEY");
    if (!apiKey) {
      throw new ServiceUnavailableException(
        "Food analysis is not configured. Add GEMINI_API_KEY to the backend environment.",
      );
    }

    const client = new GoogleGenerativeAI(apiKey);
    const modelConfig = {
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.2,
      },
    } as const;
    const imagePrompt = [
      {
        inlineData: {
          data: image.buffer.toString("base64"),
          mimeType: image.mimetype,
        },
      },
      { text: "Estimate the nutrition in this food image for the visible serving." },
    ];

    try {
      const model = client.getGenerativeModel({
        ...modelConfig,
        model: this.config.get<string>("GEMINI_MODEL") ?? "gemini-3.6-flash",
      });
      let response: Awaited<ReturnType<typeof model.generateContent>>;
      try {
        response = await model.generateContent(imagePrompt);
      } catch (error) {
        if (!isCapacityError(error)) throw error;

        const fallbackName =
          this.config.get<string>("GEMINI_FALLBACK_MODEL") ??
          "gemini-3.5-flash-lite";
        this.logger.warn(`Gemini is busy; retrying analysis with ${fallbackName}.`);
        const fallbackModel = client.getGenerativeModel({
          ...modelConfig,
          model: fallbackName,
        });
        response = await fallbackModel.generateContent(imagePrompt);
      }

      const text = response.response.text();
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        this.logger.error("Gemini returned invalid JSON for a food analysis.");
        throw new BadGatewayException(
          "The food analysis service returned an invalid response. Please try again.",
        );
      }

      return this.validateResult(parsed);
    } catch (error) {
      if (error instanceof BadGatewayException) throw error;

      this.logger.error(
        "Gemini food analysis request failed.",
        error instanceof Error ? error.stack : undefined,
      );
      throw new BadGatewayException(
        "We could not analyze that image right now. Please try again.",
      );
    }
  }

  private validateResult(value: unknown): NutritionResult {
    if (!isNutritionResult(value)) {
      this.logger.error("Gemini response failed nutrition payload validation.");
      throw new BadGatewayException(
        "The food analysis service returned an invalid response. Please try again.",
      );
    }

    return {
      food_name: value.food_name.trim(),
      calories: value.calories,
      protein: value.protein,
      carbs: value.carbs,
      fat: value.fat,
    };
  }
}

function isCapacityError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes("[503 Service Unavailable]") ||
      error.message.includes("[429 Too Many Requests]"))
  );
}

function isNutritionResult(value: unknown): value is NutritionResult {
  if (typeof value !== "object" || value === null) return false;
  const result = value as Record<string, unknown>;
  const numericFields = ["calories", "protein", "carbs", "fat"] as const;

  return (
    typeof result.food_name === "string" &&
    result.food_name.trim().length > 0 &&
    numericFields.every(
      (field) =>
        typeof result[field] === "number" &&
        Number.isFinite(result[field]) &&
        result[field] >= 0,
    )
  );
}
