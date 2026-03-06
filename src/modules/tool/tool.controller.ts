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
}
