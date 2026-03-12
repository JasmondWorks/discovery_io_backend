import { Response } from "express";
import { ToolService } from "./tool.service";
import { catchAsync } from "../../utils/catch-async.util";
import { sendSuccess } from "../../utils/api-response.util";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export class ToolController {
  private toolService: ToolService;

  constructor() {
    this.toolService = new ToolService();
  }

  public getTools = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const result = await this.toolService.getAllTools(req.query);
      return sendSuccess(res, result, "Tools retrieved successfully");
    },
  );

  public getTool = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const tool = await this.toolService.getToolById(id as string);
      return sendSuccess(res, tool, "Tool retrieved successfully");
    },
  );

  /**
   * PRD Feature 3 — Personalized Tools Catalog.
   * Returns tools grouped by skill category and filtered to the authenticated
   * user's core role and industry (from their professional profile).
   * Users can browse this catalog after completing onboarding as an alternative
   * to the AI-powered search flow.
   */
  public getToolsForUser = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const user = req.user as any;
      const result = await this.toolService.getToolsForUser(user);
      return sendSuccess(
        res,
        result,
        "Personalized tools catalog retrieved successfully",
      );
    },
  );
}
