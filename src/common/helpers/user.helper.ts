import * as bcrypt from "bcrypt";
import { PrismaService } from "src/app/modules/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

@Injectable()
export class UserHelperService {
  constructor(private readonly prisma: PrismaService) {}

  async isUserExist(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async isPasswordMatched(givenPassword: string, savedPassword: string): Promise<boolean> {
    return await bcrypt.compare(givenPassword, savedPassword);
  }
}
