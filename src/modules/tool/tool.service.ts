import Tool from "./models/tool.model";
import { MongooseRepository } from "../../utils/crud.util";

export class ToolService {
  private repository: MongooseRepository<any>;

  constructor() {
    this.repository = new MongooseRepository(Tool);
  }

  async getAllTools(queryParams: any) {
    return await this.repository.findAll(queryParams, {}, [
      "name",
      "description",
      "verified_use_cases",
    ]);
  }

  async getToolById(id: string) {
    return await this.repository.findById(id);
  }
}
