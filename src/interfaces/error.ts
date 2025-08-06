import { HttpStatus } from "@nestjs/common";
import { IGenericErrorMessage } from "./common";

export type IGenericErrorResponse = {
  statusCode: HttpStatus;
  message: string;
  errorMessages: IGenericErrorMessage[];
};
