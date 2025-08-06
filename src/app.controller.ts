import { Controller, Get, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { Response } from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  getHello(@Res() res: Response): void {
    res.render("home");
  }

  @Get("*path")
  notFound(@Res() res: Response): void {
    res.render("not-found");
  }
}
