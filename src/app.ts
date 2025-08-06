import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import config from "./config";
import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { GlobalExceptionFilter } from "./common/filters/globalErrorHandler";
import { ExpressAdapter } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";

export async function app(): Promise<NestExpressApplication> {
  const server = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );

  // Set EJS as view engine
  app.setViewEngine("ejs");

  // Set views folder based on environment
  if (config.env === "production") {
    app.setBaseViewsDir(path.join(__dirname, "dist", "views"));
  } else {
    app.setBaseViewsDir(path.join(__dirname, "views"));
  }

  // Middlewares
  app.use(
    cors({
      credentials: true,
      origin: ["http://localhost:3000"],
    }),
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Global configurations
  app.setGlobalPrefix("api/v1");
  app.useGlobalFilters(new GlobalExceptionFilter());

  return app;
}
