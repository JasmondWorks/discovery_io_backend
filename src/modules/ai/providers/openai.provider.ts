import OpenAI from "openai";
import { IAIProvider } from "../ai.provider";
import appConfig from "../../../config/app.config";
import { AppError } from "../../../utils/app-error.util";

export class OpenAIProvider implements IAIProvider {
  private openai: OpenAI;

  constructor() {
    if (!appConfig.ai.openRouterApiKey) {
      throw new AppError("OpenRouter API key is not configured", 500);
    }
    this.openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: appConfig.ai.openRouterApiKey,
    });
  }

  async normalize(input: string, structure: any): Promise<any> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001", // Cost-effective for normalization via OpenRouter
        messages: [
          {
            role: "system",
            content: `You are a data normalization assistant. Your task is to take an open-ended input and convert it into a structured JSON format that matches the following structure: ${JSON.stringify(
              structure,
            )}. Return only the JSON object.`,
          },
          {
            role: "user",
            content: input,
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = response.choices[0].message.content;
      if (!result) {
        throw new AppError("Failed to get response from OpenAI", 500);
      }

      return JSON.parse(result);
    } catch (error: any) {
      console.error("OpenAI Normalization Error:", error);
      throw new AppError(
        `AI Normalization failed: ${error.message}`,
        error.status || 500,
      );
    }
  }
}
