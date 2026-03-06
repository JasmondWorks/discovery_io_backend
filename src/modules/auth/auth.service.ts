import jwt from "jsonwebtoken";
import config from "../../config/app.config";
import { UserService } from "../../modules/user/user.service";
import { AppError } from "../../utils/app-error.util";
import { IUser } from "../../modules/user/models/user.model";

export class AuthService {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public signToken(id: string, secret: string, expiresIn: string) {
    return jwt.sign({ id }, secret, { expiresIn: expiresIn as any });
  }

  public async createSendToken(user: IUser, statusCode: number, res: any) {
    const accessToken = this.signToken(
      (user._id as any).toString(),
      config.jwt.accessSecret,
      config.jwt.accessTokenExpiresIn,
    );
    const refreshToken = this.signToken(
      (user._id as any).toString(),
      config.jwt.refreshSecret,
      config.jwt.refreshTokenExpiresIn,
    );

    const cookieOptions = {
      expires: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days fallback or use 'ms'
      ),
      httpOnly: true,
      secure: config.env === "production",
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Remove password from output
    user.password = undefined;

    await this.userService.updateUser((user._id as any).toString(), {
      refreshToken: refreshToken,
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async login(data: any) {
    const { email, password } = data;

    if (!email || !password) {
      throw new AppError("Please provide email and password!", 400);
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // @ts-ignore
    if (!(await user.correctPassword(password, user.password))) {
      throw new AppError("Incorrect email or password", 401);
    }

    return user;
  }

  async register(data: any) {
    const { name, email, password, role } = data;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new AppError("User with this email already exists", 400);
    }

    const user = await this.userService.createUser({
      name,
      email,
      password,
      role,
    });
    return user;
  }

  async refresh(token: string) {
    if (!token) throw new AppError("Refresh token is required", 401);

    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret) as any;
      const user = await this.userService.getUserById(
        decoded.id,
        "+refreshToken",
      );
      if (!user) throw new AppError("User not found", 401);

      if (user.refreshToken !== token) {
        throw new AppError("Invalid refresh token", 401);
      }

      return user;
    } catch (err) {
      throw new AppError("Invalid or expired refresh token", 401);
    }
  }
  async logout(token: string) {
    if (!token) return;
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret) as any;
      await this.userService.updateUser(decoded.id, { refreshToken: "" });
    } catch (err) {
      // Ignored: token already expired or invalid means nothing to invalidate
    }
  }
}
