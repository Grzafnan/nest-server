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
  UsePipes,
  Req,
  Query,
} from "@nestjs/common";
import { Response, Request } from "express";
import { UsersService } from "./users.service";
import { Prisma, User } from "@prisma/client";
import { AuthGuard } from "src/app/modules/auth/auth.guard";
import sendResponse from "src/shared/sendResponse";
import { Roles } from "src/common/decorators/roles.decorator";
import { ENUM_USER_ROLE } from "src/enums/user";
import { UserValidation } from "./users.dto";
import { ValidationRequest } from "src/common/pipes/validateRequest.pipe";
import pick from "src/common/utils/pick";
import { IPaginationOptions } from "src/common/interfaces/pagination";
import { paginationFields } from "src/constants/pagination";
import { FilterableFields } from "./user.constant";

/**
 * Controller to handle all user-related operations.
 * Protected routes require authentication and role-based access.
 */
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user.
   * @param user - The user data from request body.
   * @param res - Express response object.
   * @returns A success response with the newly created user.
   *
   * 🔒 Public route
   * ✅ Validates request body using DTO
   */
  @Post()
  @UsePipes(new ValidationRequest(UserValidation.create))
  async create(@Body() user: User, @Res() res: Response): Promise<void> {
    const result = await this.usersService.create(user);

    sendResponse<Partial<User>>(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: "User created successfully!",
      data: result,
    });
  }

  /**
   * Retrieve all users.
   * @param res - Express response object.
   * @returns A list of users.
   *
   * 🔒 Requires authentication
   * 👥 Accessible by SUPER_ADMIN and ADMIN roles
   */
  @UseGuards(AuthGuard)
  @Roles(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN)
  @Get("/")
  async findAll(@Req() req: Request, @Res() res: Response, @Query() query: any): Promise<void> {
    console.log("Request Query:", query);
    const filters = pick(query, FilterableFields);
    const paginationOptions: IPaginationOptions = pick(
      query,
      paginationFields,
    ) as IPaginationOptions;

    const result = await this.usersService.findAll(filters, paginationOptions);

    sendResponse<Partial<User>[]>(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Users retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  }

  /**
   * Retrieve a single user by ID.
   * @param id - The user ID from route parameter.
   * @param res - Express response object.
   * @returns The user object if found.
   *
   * 🔒 Requires authentication
   * 👥 Accessible by SUPER_ADMIN, ADMIN, USER, CLIENT roles
   */
  @UseGuards(AuthGuard)
  @Roles(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.CLIENT,
  )
  @Get("/:id")
  async findOne(@Param("id") id: string, @Res() res: Response): Promise<void> {
    const result = await this.usersService.findOne(id);

    sendResponse<Partial<User> | null>(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "User retrieved successfully!",
      data: result,
    });
  }

  /**
   * Update an existing user by ID.
   * @param id - The user ID from route parameter.
   * @param user - The user data to update.
   * @param res - Express response object.
   * @returns The updated user object.
   *
   * 🔒 Requires authentication
   * 👥 Accessible by SUPER_ADMIN, ADMIN, USER, CLIENT roles
   */
  @UseGuards(AuthGuard)
  @Roles(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.CLIENT,
  )
  @Patch("/:id")
  async update(
    @Param("id") id: string,
    @Body() user: Prisma.UserUpdateInput,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.usersService.update(id, user);

    sendResponse<Partial<User> | null>(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "User updated successfully!",
      data: result,
    });
  }

  /**
   * Delete a user by ID.
   * @param id - The user ID from route parameter.
   * @param res - Express response object.
   * @returns The deleted user object.
   *
   * 🔒 Requires authentication
   * 👥 Accessible by SUPER_ADMIN, ADMIN, USER, CLIENT roles
   */
  @UseGuards(AuthGuard)
  @Roles(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.CLIENT,
  )
  @Delete("/:id")
  async remove(@Param("id") id: string, @Res() res: Response): Promise<void> {
    const result = await this.usersService.remove(id);

    sendResponse<Partial<User> | null>(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "User removed successfully!",
      data: result,
    });
  }
}
