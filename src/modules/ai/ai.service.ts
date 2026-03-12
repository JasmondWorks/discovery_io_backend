import { IAIProvider } from "./ai.provider";
import { OpenAIProvider } from "./providers/openai.provider";
import { GeminiProvider } from "./providers/gemini.provider";
import { OpenRouterProvider } from "./providers/openrouter.provider";
import appConfig from "../../config/app.config";
import { AppError } from "../../utils/app-error.util";

export class AIService {
  private providers: Map<string, IAIProvider> = new Map();
  private cache: Map<string, any> = new Map();
  private defaultProvider: string;

  constructor() {
    this.providers.set("openai", new OpenAIProvider());
    this.providers.set("gemini", new GeminiProvider());
    this.providers.set("openrouter", new OpenRouterProvider());
    // Add more providers here (e.g., anthropic)

    this.defaultProvider = appConfig.ai.defaultProvider || "openrouter";
  }

  getProvider(name?: string): IAIProvider {
    const providerName = name || this.defaultProvider;
    const provider = this.providers.get(providerName);

    if (!provider) {
      throw new AppError(`AI Provider '${providerName}' not found`, 404);
    }

    return provider;
  }

  async normalize(
    input: string,
    structure: any,
    providerName?: string,
  ): Promise<any> {
    const primaryProviderName = providerName || this.defaultProvider;
    const cacheKey = `${primaryProviderName}:${input}:${JSON.stringify(structure)}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // List of providers to try in order
    const providersToTry = [
      primaryProviderName,
      ...Array.from(this.providers.keys()).filter(
        (name) => name !== primaryProviderName,
      ),
    ];

    let lastError: any;

    for (const pName of providersToTry) {
      try {
        console.log(`AI Normalization: Trying provider '${pName}'...`);
        const provider = this.getProvider(pName);
        const result = await provider.normalize(input, structure);

        this.cache.set(cacheKey, result);
        console.log(`AI Normalization: Success with provider '${pName}'`);
        return result;
      } catch (error: any) {
        lastError = error;
        console.error(
          `AI Normalization: Provider '${pName}' failed:`,
          error.message,
        );

        // If it's a 404 (provider not found) or not a 429, we might want to stop,
        // but for robustness we'll try the next one if it's a quota or transient error.
        const isQuotaError =
          error.message?.includes("quota") || error.statusCode === 429;

        if (!isQuotaError) {
          // If it's not a quota error, we still try next provider for reliability
          continue;
        }
      }
    }

    throw lastError || new AppError("All AI providers failed", 500);
  }
}
