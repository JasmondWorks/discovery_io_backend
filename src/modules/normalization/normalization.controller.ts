import { Response } from "express";
import { NormalizationService } from "./normalization.service";
import { sendSuccess } from "../../utils/api-response.util";
import { catchAsync } from "../../utils/catch-async.util";
import { UserService } from "../../modules/user/user.service";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export class NormalizationController {
  private service: NormalizationService;
  private userService: UserService;

  constructor() {
    this.service = new NormalizationService();
    this.userService = new UserService();
  }

  public normalize = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const result = await this.service.normalizeInput(req.body);
      return sendSuccess(res, result, "Input normalized successfully");
    },
  );

  public normalizeProfession = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const result = await this.service.normalizeInput({
        ...req.body,
        schemaType: "professional_profile",
      });

      // Save to user if authenticated
      if (req.user) {
        await this.userService.updateUser((req.user as any)._id, {
          professionalProfile: result,
        });
      }

      return sendSuccess(
        res,
        result,
        "Professional profile normalized and saved successfully",
      );
    },
  );
}
