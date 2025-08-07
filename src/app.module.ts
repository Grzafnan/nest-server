import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { UsersModule } from "./app/modules/users/users.module";
import { PrismaModule } from "./app/modules/prisma/prisma.module";
import { AuthModule } from "./app/modules/auth/auth.module";
import { AuthController } from "./app/modules/auth/auth.controller";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AuthModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 1 minute
          limit: 35, // 35 requests per minute
        },
      ],
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
