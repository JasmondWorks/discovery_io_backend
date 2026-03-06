import Workflow from "./models/workflow.model";
import { MongooseRepository } from "../../utils/crud.util";

export class WorkflowService {
  private repository: MongooseRepository<any>;

  constructor() {
    this.repository = new MongooseRepository(Workflow);
  }

  async getAllWorkflows(queryParams: any) {
    return await this.repository.findAll(
      queryParams,
      {},
      ["title", "description", "use_cases"], // Searchable fields
    );
  }

  async getWorkflowById(id: string) {
    return await this.repository.findById(id);
  }
}
