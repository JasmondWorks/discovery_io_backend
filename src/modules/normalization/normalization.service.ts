import { AIService } from "../ai/ai.service";
import { NormalizeInputDto } from "./normalization.dto";
import { NormalizationSchemas } from "./normalization.schemas";
import { AppError } from "../../utils/app-error.util";

export class NormalizationService {
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  async normalizeInput(data: NormalizeInputDto): Promise<any> {
    const { input, schemaType, provider } = data;

    const structure = NormalizationSchemas[schemaType];
    if (!structure) {
      throw new AppError(`Schema type '${schemaType}' not found`, 404);
    }

    return await this.aiService.normalize(input, structure, provider);
  }
}
