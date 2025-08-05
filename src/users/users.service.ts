import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma, User } from "generated/prisma";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const { password, ...rest } = data;

    if (!password || typeof password !== "string") {
      throw new BadRequestException("Password is required and must be a string!");
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found!`);
    }
    return user;
  }

  async update(id: string, user: Prisma.UserUpdateInput): Promise<User | null> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found to update!`);
    }

    return this.prisma.user.update({
      where: { id },
      data: user,
    });
  }

  async remove(id: string): Promise<User | null> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found to delete!`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
