import { JwtService } from "@nestjs/jwt";
import jwt, { JwtPayload } from "jsonwebtoken";

const createToken = async (
  payload: Record<string, unknown>,
  secret: string,
  expireTime: string,
): Promise<string> => {
  const jwtService = new JwtService({ secret });
  return await jwtService.signAsync(payload, { expiresIn: expireTime });
};

const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
