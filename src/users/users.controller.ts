import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Prisma, User } from "generated/prisma";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() user: User) {
    return this.usersService.create(user);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get("/:id")
  findOne(@Param("id") id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @Patch("/:id")
  update(@Param("id") id: string, @Body() user: Prisma.UserUpdateInput): Promise<User | null> {
    return this.usersService.update(id, user);
  }

  @Delete("/:id")
  remove(@Param("id") id: string): Promise<User | null> {
    return this.usersService.remove(id);
  }
}
