import { JwtPayload } from "jsonwebtoken";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/app/modules/prisma/prisma.service";
import { User } from "@prisma/client";
import config from "src/config";
import { jwtHelpers } from "src/common/helpers/jwt-helper";
import ApiError from "src/errors/apiError";
import { UserHelperService } from "src/common/helpers/user.helper";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userHelper: UserHelperService,
  ) {}
  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user: User | null = await this.prisma.user.findUnique({
      omit: {
        password: false,
      },
      where: { email },
    });
    if (!user) {
      throw new NotFoundException("User not found!");
    }

    const { password: userPass, ...rest } = user;
    const isPasswordValid: boolean = await bcrypt.compare(password, userPass);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    const payload = { ...rest, sub: user.id };

    const accessToken = await jwtHelpers.createToken(
      { ...payload },
      config.jwt.secret as string,
      config.jwt.expires_in,
    );

    const refreshToken = await jwtHelpers.createToken(
      { userId: user.id, role: user.role },
      config.jwt.refresh_secret as string,
      config.jwt.refresh_expires_in,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ data: { access_token: string } }> {
    interface RefreshTokenPayload {
      id: string;
      [key: string]: any;
    }
    let verifiedToken: RefreshTokenPayload | null = null;
    // invalid token - synchronous

    try {
      verifiedToken = jwtHelpers.verifyToken(
        refreshToken,
        config.jwt.refresh_secret as string,
      ) as JwtPayload & RefreshTokenPayload;
    } catch (err: any) {
      throw new ApiError(HttpStatus.FORBIDDEN, "Invalid Refresh Token!");
    }
    if (!verifiedToken || !verifiedToken.id) {
      throw new ApiError(HttpStatus.FORBIDDEN, "Invalid Refresh Token!");
    }
    const { id } = verifiedToken;
    const isUserExist = await this.userHelper.isUserExist(id);
    if (!isUserExist) {
      throw new ApiError(HttpStatus.NOT_FOUND, "User doesn't exist!");
    }

    // Create new Access Token
    const newAccessToken = await jwtHelpers.createToken(
      {
        ...isUserExist,
        sub: isUserExist.id,
      },
      config.jwt.secret as string,
      config.jwt.expires_in,
    );

    return {
      data: { access_token: newAccessToken },
    };
  }
}
