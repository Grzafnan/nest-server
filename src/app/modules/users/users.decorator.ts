import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

/**
 * Extended Express Request interface to include `user` property,
 * which is typically attached by an authentication middleware/guard (e.g., JWT auth).
 */
interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

/**
 * Custom decorator to extract user information from the request object.
 *
 * @param data - Optional key of the JWT payload to extract a specific field (e.g., 'id', 'email').
 * @param ctx - Execution context providing access to the HTTP request.
 * @returns The entire `JwtPayload` if no key is provided, or the specific value of the key if given.
 *
 * @example
 * // Returns the entire user object from the JWT payload
 * @Get()
 * getProfile(@User() user: JwtPayload) {}
 *
 * // Returns a specific field from the JWT payload (e.g., user ID)
 * @Get()
 * getUserId(@User('id') userId: string) {}
 */
export const User = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): JwtPayload | string | undefined => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      return undefined;
    }

    return user;
  },
);
