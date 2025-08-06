import { IGenericErrorMessage } from "src/interfaces/common";
import { IGenericErrorResponse } from "src/interfaces/error";
import { ZodError, ZodIssue } from "zod";

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      path:
        typeof issue?.path[issue.path.length - 1] === "string" ||
        typeof issue?.path[issue.path.length - 1] === "number"
          ? (issue?.path[issue.path.length - 1] as string | number)
          : "",
      message: issue?.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: "Validation Error",
    errorMessages: errors,
  };
};

export default handleZodError;
