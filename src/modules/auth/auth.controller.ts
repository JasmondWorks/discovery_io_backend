import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { UserService } from "../../modules/user/user.service";
import { catchAsync } from "../../utils/catch-async.util";
import { sendSuccess } from "../../utils/api-response.util";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export class AuthController {
  private authService: AuthService;

  constructor() {
    const userService = new UserService();
    this.authService = new AuthService(userService);
  }

  public register = catchAsync(async (req: Request, res: Response) => {
    const user = await this.authService.register(req.body);
    const result = await this.authService.createSendToken(user, 201, res);
    return sendSuccess(res, result, "User registered successfully", 201);
  });

  public login = catchAsync(async (req: Request, res: Response) => {
    const user = await this.authService.login(req.body);
    const result = await this.authService.createSendToken(user, 200, res);
    return sendSuccess(res, result, "Logged in successfully");
  });

  public refreshToken = catchAsync(async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    const user = await this.authService.refresh(token);
    const result = await this.authService.createSendToken(user, 200, res);
    return sendSuccess(res, result, "Token refreshed successfully");
  });

  public logout = catchAsync(async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (token) {
      await this.authService.logout(token);
    }
    res.cookie("accessToken", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.cookie("refreshToken", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    return sendSuccess(res, null, "Logged out successfully");
  });

  /**
   * GET /auth/me
   * Returns the currently authenticated user. Requires `protect` middleware.
   * The frontend calls this to determine whether a valid access token cookie exists.
   */
  public getMe = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      return sendSuccess(res, { user: req.user }, "Authenticated");
    },
  );
}
