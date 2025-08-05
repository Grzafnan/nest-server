import { JwtPayload } from "jsonwebtoken";
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { User } from "src/users/users.decorator";

@Controller("/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("/login")
  signIn(@Body() { email, password }: { email: string; password: string }) {
    return this.authService.signIn(email, password);
  }

  @UseGuards(AuthGuard)
  @Get("/profile")
  getProfile(@User() user: JwtPayload) {
    return user;
  }

  @Get("/id")
  getUserId(@User("id") userId: string) {
    return userId;
  }
}
