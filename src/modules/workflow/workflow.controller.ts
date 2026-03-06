import { Response } from "express";
import { WorkflowService } from "./workflow.service";
import { catchAsync } from "../../utils/catch-async.util";
import { sendSuccess } from "../../utils/api-response.util";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export class WorkflowController {
  private workflowService: WorkflowService;

  constructor() {
    this.workflowService = new WorkflowService();
  }

  public getWorkflows = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const result = await this.workflowService.getAllWorkflows(req.query);
      return sendSuccess(res, result, "Workflows retrieved successfully");
    },
  );

  public getWorkflow = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const workflow = await this.workflowService.getWorkflowById(id as string);
      return sendSuccess(res, workflow, "Workflow retrieved successfully");
    },
  );
}
