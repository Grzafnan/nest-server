import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./app/modules/users/users.module";
import { PrismaModule } from "./app/modules/prisma/prisma.module";
import { AuthModule } from "./app/modules/auth/auth.module";
import { AuthController } from "./app/modules/auth/auth.controller";

@Module({
  imports: [UsersModule, PrismaModule, AuthModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
