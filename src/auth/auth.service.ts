import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "generated/prisma";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(email: string, password: string): Promise<{ access_token: string }> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException("User not found!");
    }
    const { id, password: userPass, ...rest } = user;
    const isPasswordValid: boolean = await bcrypt.compare(password, userPass);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const payload = { ...rest, sub: id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
