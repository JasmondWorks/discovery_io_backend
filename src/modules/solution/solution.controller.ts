import { Response } from "express";
import { SolutionService } from "./solution.service";
import { catchAsync } from "../../utils/catch-async.util";
import { sendSuccess } from "../../utils/api-response.util";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export class SolutionController {
  private solutionService: SolutionService;

  constructor() {
    this.solutionService = new SolutionService();
  }

  public getSolutions = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const result = await this.solutionService.getAllSolutions(req.query);
      return sendSuccess(res, result, "Solutions retrieved successfully");
    },
  );

  public getSolution = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const solution = await this.solutionService.getSolutionById(id as string);
      return sendSuccess(res, solution, "Solution retrieved successfully");
    },
  );
}
