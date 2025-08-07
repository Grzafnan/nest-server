import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/app/modules/users/users.module";
import { PrismaService } from "src/app/modules/prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import config from "src/config";
import { APP_GUARD } from "@nestjs/core/constants";
import { AuthGuard } from "./auth.guard";
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: config.jwt.secret as string,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
