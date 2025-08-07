import { JwtPayload } from "jsonwebtoken";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { User } from "src/app/modules/users/users.decorator";
import sendResponse from "src/shared/sendResponse";
import { Request, Response } from "express";
import config from "src/config";

@Controller("/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("/login")
  async signIn(
    @Req() req: Request,
    @Res() res: Response,
    @Body() { email, password }: { email: string; password: string },
  ) {
    const result = await this.authService.signIn(email, password);

    const cookieOptions = {
      secret: config.env === "production",
      httpOnly: true,
    };

    res.cookie("refreshToken", result.refresh_token, cookieOptions);

    sendResponse<{ access_token: string; refresh_token: string }>(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "User logged in successfully!",
      data: result,
    });
  }

  @UseGuards(AuthGuard)
  @Get("/profile")
  getProfile(@User() user: JwtPayload) {
    return user;
  }

  @UseGuards(AuthGuard)
  @Get("/refresh-token")
  async refreshToken(@Req() req: Request, @Res() res: Response): Promise<void> {
    const cookies = req.cookies as { [key: string]: string };
    const refreshToken: string = cookies["refreshToken"];
    const result = await this.authService.refreshToken(refreshToken);

    sendResponse<{ access_token: string }>(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "User token refreshed successfully!",
      data: result.data,
    });
  }
}
