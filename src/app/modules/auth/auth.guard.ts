import { config } from "dotenv";
import { JwtPayload } from "jsonwebtoken";
import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import ApiError from "src/errors/apiError";
import { ROLES_KEY } from "src/common/decorators/roles.decorator";
import { Reflector } from "@nestjs/core";
config();
interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { role?: string };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, "Authorization token is missing or invalid!");
    }
    try {
      const payload: JwtPayload & { role?: string } = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET as string,
      });
      request["user"] = payload;
    } catch {
      throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid authorization token!");
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = request.user?.role;

      if (!userRole || !requiredRoles.includes(userRole)) {
        throw new ApiError(HttpStatus.FORBIDDEN, "Access denied: insufficient role.");
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
