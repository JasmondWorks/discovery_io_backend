import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import appConfig from "../config/app.config";

async function listModels() {
  if (!appConfig.ai.geminiApiKey) {
    console.error("No Gemini API key found in .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(appConfig.ai.geminiApiKey as string);

  try {
    console.log("Fetching available Gemini models...");
    // The SDK doesn't have a direct listModels on the main class in some versions,
    // but we can try to fetch it via the internal client or just check common names.
    // However, the best way is usually just to try the most common ones.

    // Let's try to see if we can get the list
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${appConfig.ai.geminiApiKey}`,
    );
    const data = await response.json();

    if (data.models) {
      console.log("\nAvailable Models:");
      data.models.forEach((m: any) => {
        console.log(
          `- ${m.name} (supports: ${m.supportedGenerationMethods.join(", ")})`,
        );
      });
    } else {
      console.log("No models found or error in response:", data);
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
