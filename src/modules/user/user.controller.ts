import { Request, Response } from "express";
import { UserService } from "../../modules/user/user.service";
import { sendSuccess } from "../../utils/api-response.util";
import { catchAsync } from "../../utils/catch-async.util";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await this.userService.getAllUsers(req.query);
    return sendSuccess(res, result, "Users retrieved successfully");
  });

  public getUserById = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.id as string);
    return sendSuccess(res, user, "User retrieved successfully");
  });

  public createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.createUser(req.body);
    return sendSuccess(res, user, "User created successfully", 201);
  });

  public updateUser = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.updateUser(
      req.params.id as string,
      req.body,
    );
    return sendSuccess(res, user, "User updated successfully");
  });

  public deleteUser = catchAsync(async (req: Request, res: Response) => {
    await this.userService.deleteUser(req.params.id as string);
    return sendSuccess(res, null, "User deleted successfully", 204);
  });

  public getMe = catchAsync(async (req: any, res: Response) => {
    return sendSuccess(res, req.user, "User profile retrieved successfully");
  });
}
