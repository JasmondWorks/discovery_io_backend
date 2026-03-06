import Solution from "./models/solution.model";
import { MongooseRepository } from "../../utils/crud.util";

export class SolutionService {
  private repository: MongooseRepository<any>;

  constructor() {
    this.repository = new MongooseRepository(Solution);
  }

  async getAllSolutions(queryParams: any) {
    return await this.repository.findAll(
      queryParams,
      {},
      ["issue_title", "description", "tags"], // Searchable fields
    );
  }

  async getSolutionById(id: string) {
    return await this.repository.findById(id);
  }
}
