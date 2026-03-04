import { GoogleGenAI } from "@google/genai";
import { IAIProvider } from "../ai.provider";
import appConfig from "../../../config/app.config";
import { AppError } from "../../../utils/app-error.util";

export class GeminiProvider implements IAIProvider {
  private ai: GoogleGenAI;

  constructor() {
    // The client can get the API key from the environment variable `GEMINI_API_KEY`
    // or we can pass it in. Since we have it in appConfig, we'll use that or ensure it's in process.env
    if (!appConfig.ai.geminiApiKey && !process.env.GEMINI_API_KEY) {
      console.warn("Gemini API key is missing. GeminiProvider will not work.");
    }

    // If it's in appConfig but not process.env, the SDK might not find it automatically
    // unless we pass it. The constructor seems to take an options object.
    this.ai = new GoogleGenAI({
      apiKey: appConfig.ai.geminiApiKey as string,
    });
  }

  async normalize(input: string, structure: any): Promise<any> {
    const prompt = `Return a JSON object conforming to this schema for the text: "${input}"
Schema: ${JSON.stringify(structure)}`;

    try {
      const response = await this.ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
        },
      });

      if (!response || !response.text) {
        throw new Error("Empty response from Gemini");
      }

      // Clean up text in case it includes markdown bocks
      let text = response.text.trim();
      if (text.startsWith("```json")) {
        text = text
          .replace(/^```json/, "")
          .replace(/```$/, "")
          .trim();
      } else if (text.startsWith("```")) {
        text = text.replace(/^```/, "").replace(/```$/, "").trim();
      }

      return JSON.parse(text);
    } catch (error: any) {
      console.error("Gemini (New SDK) Normalization Error:", error);
      throw new AppError(
        `AI Normalization failed (Gemini New SDK): ${error.message}`,
        500,
      );
    }
  }
}
