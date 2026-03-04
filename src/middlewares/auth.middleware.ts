import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/app.config";
import { AppError } from "../utils/app-error.util";
import User, { IUser } from "../modules/user/models/user.model";
import { UserRole } from "../modules/user/user.entity";
import { catchAsync } from "../utils/catch-async.util";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// Verify Bearer token, load user from DB, attach to req.user
export const protect = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(
        new AppError(
          "You are not logged in! Please log in to get access.",
          401,
        ),
      );
    }

    // 1) Verification token
    const decoded = jwt.verify(token, config.jwt.accessSecret) as any;

    // 2) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401,
        ),
      );
    }

    // 3) Check if user changed password after the token was issued
    // @ts-ignore
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401,
        ),
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  },
);

// Only allow specified roles
export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }
    next();
  };
};
