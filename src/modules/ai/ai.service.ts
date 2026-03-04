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

    this.defaultProvider = appConfig.ai.defaultProvider || "openai";
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
    const pName = providerName || this.defaultProvider;
    const cacheKey = `${pName}:${input}:${JSON.stringify(structure)}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const provider = this.getProvider(pName);
    const result = await provider.normalize(input, structure);

    this.cache.set(cacheKey, result);
    return result;
  }
}
