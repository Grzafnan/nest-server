import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { UserHelperService } from "src/common/helpers/user.helper";

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UserHelperService],
  exports: [UsersService, UserHelperService], // Export UsersService and UserHelperService to be used in other modules
})
export class UsersModule {}
