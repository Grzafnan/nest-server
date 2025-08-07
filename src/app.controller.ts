import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";

@Controller()
export class AppController {
  @Get("/")
  getHello(@Res() res: Response): void {
    res.render("home");
  }

  // @Get("*path")
  // notFound(@Res() res: Response): void {
  //   res.render("not-found");
  // }
}
