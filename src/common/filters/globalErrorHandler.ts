import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import handleClientError from "src/errors/handleClientError";
import { IGenericErrorMessage } from "src/interfaces/common";
import ApiError from "src/errors/apiError";
import handleZodError from "src/errors/handleZodError";
import { ZodError } from "zod";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Something went wrong!";
    let errorMessages: IGenericErrorMessage[] = [];

    if (exception instanceof ZodError) {
      const simplifiedError = handleZodError(exception);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorMessages = simplifiedError.errorMessages;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const simplified = handleClientError(exception);
      statusCode = simplified.statusCode;
      message = simplified.message;
      errorMessages = simplified.errorMessages;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === "string") {
        message = response;
        errorMessages = [{ path: "", message }];
      } else if (typeof response === "object") {
        const resObj = response as Record<string, unknown>;
        if (resObj && typeof resObj === "object" && "message" in resObj) {
          const msg = resObj.message;
          message = typeof msg === "string" ? msg : message;
          errorMessages = Array.isArray(msg)
            ? msg.map((m: string) => ({ path: "", message: m }))
            : [{ path: "", message }];
        } else {
          errorMessages = [{ path: "", message }];
        }
      }
    } else if (exception instanceof ApiError) {
      statusCode = exception.statusCode;
      message = exception.message;
      errorMessages = exception.message ? [{ path: "", message: exception.message }] : [];
    } else if (exception instanceof Error) {
      message = exception.message;
      errorMessages = [{ path: "", message }];
    }

    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      error: errorMessages,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
