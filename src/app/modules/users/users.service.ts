import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/app/modules/prisma/prisma.service";
import { Prisma, Role, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import ApiError from "src/errors/apiError";
import { paginationHelpers } from "src/common/helpers/pagination.helper";
import { IPaginationOptions } from "src/common/interfaces/pagination";
import { RelationalFieldsMapper } from "./user.constant";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<Partial<User>> {
    const { password, ...rest } = data;

    if (!password) {
      throw new ApiError(HttpStatus.BAD_REQUEST, "Password is required and must be a string!");
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll(
    filters: { searchTerm?: string; [key: string]: unknown },
    paginationOptions: IPaginationOptions,
  ): Promise<{
    meta: { total: number; page: number; limit: number };
    data: Partial<User>[] | null;
  }> {
    const { page, limit, skip } = paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm, ...filterData } = filters;

    const stringSearchableFields: (keyof Prisma.UserWhereInput)[] = ["name", "email"];

    // Optional: validate role enums
    const isValidRole = (value: string): value is Role =>
      Object.values(Role).includes(value.toUpperCase() as Role);

    // Initialize the AND conditions
    const andConditions: Prisma.UserWhereInput[] = [];

    if (typeof searchTerm === "string" && searchTerm.length > 0) {
      const orConditions: Prisma.UserWhereInput[] = [];

      // Add string fields with `contains`
      stringSearchableFields.forEach((field) => {
        orConditions.push({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        });
      });

      // Add role match if valid
      if (isValidRole(searchTerm)) {
        orConditions.push({
          role: searchTerm.toUpperCase() as Role,
        });
      }

      andConditions.push({
        OR: orConditions,
      });
    }

    if (Object.keys(filterData).length > 0) {
      andConditions.push({
        AND: Object.keys(filterData).map((key) => {
          if (Object.keys(RelationalFieldsMapper).includes(key)) {
            return {
              [RelationalFieldsMapper[key]]: {
                id: filterData[key],
              },
            };
          } else {
            return {
              [key]: {
                equals: filterData[key],
              },
            };
          }
        }),
      });
    }

    const whereConditions: Prisma.UserWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};

    const result: {
      meta: { total: number; page: number; limit: number };
      data: Partial<User>[];
    } = await this.prisma.$transaction(async (tx: PrismaService) => {
      const data: Partial<User>[] = await tx.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
          paginationOptions.sortBy && paginationOptions.sortOrder
            ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
            : {
                createdAt: "desc",
              },
      });

      const total: number = await tx.user.count({
        where: whereConditions,
      });

      return {
        meta: { total, page, limit },
        data,
      };
    });

    return result;
  }

  async findOne(id: string): Promise<Partial<User> | null> {
    const user = await this.prisma.user.findUnique({
      omit: {
        password: true,
      },
      where: { id },
    });
    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, `User with id ${id} not found!`);
    }
    return user;
  }

  async update(id: string, user: Prisma.UserUpdateInput): Promise<Partial<User> | null> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new ApiError(HttpStatus.NOT_FOUND, `User with id ${id} not found to update!`);
    }

    return this.prisma.user.update({
      where: { id },
      data: user,
    });
  }

  async remove(id: string): Promise<Partial<User> | null> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new ApiError(HttpStatus.NOT_FOUND, `User with id ${id} not found to delete!`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
