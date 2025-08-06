import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { UsersService } from "./users.service";
import { Prisma, User } from "@prisma/client";
import { AuthGuard } from "src/auth/auth.guard";
import sendResponse from "src/shared/sendResponse";
import { Roles } from "src/roles/roles.decorator";
import { ENUM_USER_ROLE } from "src/enums/user";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: User, @Res() res: Response): Promise<void> {
    const result = await this.usersService.create(user);

    sendResponse<User>(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: "User created successfully!",
      data: result,
    });
  }

  @UseGuards(AuthGuard)
  @Roles(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN)
  @Get("/")
  async findAll(@Res() res: Response): Promise<void> {
    const result = await this.usersService.findAll();

    sendResponse<User[]>(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Users retrieved successfully!",
      data: result,
    });
  }

  @UseGuards(AuthGuard)
  @Get("/:id")
  async findOne(@Param("id") id: string, @Res() res: Response): Promise<void> {
    const result = await this.usersService.findOne(id);

    sendResponse<User | null>(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "User retrieved successfully!",
      data: result,
    });
  }

  @UseGuards(AuthGuard)
  @Patch("/:id")
  async update(
    @Param("id") id: string,
    @Body() user: Prisma.UserUpdateInput,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.usersService.update(id, user);

    sendResponse<User | null>(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "User updated successfully!",
      data: result,
    });
  }

  @UseGuards(AuthGuard)
  @Delete("/:id")
  async remove(@Param("id") id: string, @Res() res: Response): Promise<void> {
    const result = await this.usersService.remove(id);

    sendResponse<User | null>(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "User removed successfully!",
      data: result,
    });
  }
}
