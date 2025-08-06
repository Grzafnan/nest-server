import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { Response } from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  renderHome(@Res() res: Response) {
    return res.status(HttpStatus.OK).render("home", {
      title: "Welcome!",
      message: "Hello from EJS in NestJS 🎉",
    });
  }
}
