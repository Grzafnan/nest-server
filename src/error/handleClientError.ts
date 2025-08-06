import { Prisma } from "@prisma/client";
import { HttpStatus } from "@nestjs/common";
import { IGenericErrorMessage } from "src/common/interfaces/common";

const handleClientError = (
  error: Prisma.PrismaClientKnownRequestError,
): {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
} => {
  let errorMessages: IGenericErrorMessage[] = [];
  let message = "An unexpected error occurred";
  let statusCode = 400;
  let targets: string[] = [];

  switch (error.code) {
    case "P2002":
      message = "Unique constraint failed.";
      statusCode = HttpStatus.CONFLICT;
      targets = (error?.meta?.target as string[]) || [];
      errorMessages = targets.map((target) => ({
        path: target,
        message: `Record with duplicate key for ${target}.`,
      }));
      break;
    case "P2003":
      if (error.message.includes("delete()` invocation:")) {
        if (error?.meta?.field_name) {
          const fieldNameMatch = (error?.meta?.field_name as string).match(/([^_]+)_fkey/);
          const affectedField = fieldNameMatch ? fieldNameMatch[1] : "";
          message = `Foreign key constraint failed for ${affectedField}.`;
          errorMessages = [{ path: affectedField, message }];
        }
      } else {
        message = "Foreign key constraint failed.";
        errorMessages = [{ path: "", message }];
      }
      break;
    case "P2004":
      message = "Record not found during delete or update operation.";
      statusCode = HttpStatus.NOT_FOUND;
      errorMessages = [
        {
          path: "recordNotFound",
          message: "Record not found during delete or update operation.",
        },
      ];
      break;
    case "P2005":
      message = "An unexpected error occurred during the execution of a database query.";
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessages = [
        {
          path: "unexpectedError",
          message: "An unexpected error occurred during the execution of a database query.",
        },
      ];
      break;
    case "P2006":
      message = "Invalid null value provided for a required field.";
      errorMessages = [
        {
          path: "invalidNullValue",
          message: "Invalid null value provided for a required field.",
        },
      ];
      break;
    case "P2007":
      message = "Invalid relation detected during the execution of a query.";
      errorMessages = [
        {
          path: "invalidRelation",
          message: "Invalid relation detected during the execution of a query.",
        },
      ];
      break;
    case "P2008":
      message = "Invalid orderBy argument provided.";
      errorMessages = [
        {
          path: "invalidOrderBy",
          message: "Invalid orderBy argument provided.",
        },
      ];
      break;
    case "P2009":
      message = "Query operation failed due to a unique constraint violation.";
      statusCode = HttpStatus.CONFLICT;
      errorMessages = [
        {
          path: "uniqueConstraint",
          message: "Query operation failed due to a unique constraint violation.",
        },
      ];
      break;
    case "P2010":
      message = "Invalid updateMany or deleteMany operation performed.";
      errorMessages = [
        {
          path: "invalidOperation",
          message: "Invalid updateMany or deleteMany operation performed.",
        },
      ];
      break;
    case "P2011":
      message = "Invalid connect or disconnect operation on a relation field.";
      errorMessages = [
        {
          path: "invalidRelationOperation",
          message: "Invalid connect or disconnect operation on a relation field.",
        },
      ];
      break;
    case "P2012":
      message = "Create operation failed due to a unique constraint violation.";
      statusCode = HttpStatus.CONFLICT;
      errorMessages = [
        {
          path: "createUniqueConstraint",
          message: "Create operation failed due to a unique constraint violation.",
        },
      ];
      break;
    case "P2013":
      message = "Invalid set operation on a relation field.";
      errorMessages = [
        {
          path: "invalidSetOperation",
          message: "Invalid set operation on a relation field.",
        },
      ];
      break;
    case "P2014":
      message = "findUnique or findUniqueOrThrow operation failed due to an invalid ID.";
      statusCode = HttpStatus.BAD_REQUEST;
      errorMessages = [
        {
          path: "invalidId",
          message: "findUnique or findUniqueOrThrow operation failed due to an invalid ID.",
        },
      ];
      break;
    case "P2025":
      message = (error.meta?.cause as string) || "Record not found!";
      errorMessages = [{ path: "", message }];
      break;
    default:
      errorMessages = targets.map((target) => ({
        path: target,
        message: `${message} for ${target}.`,
      }));
      break;
  }

  return {
    statusCode,
    message,
    errorMessages,
  };
};

export default handleClientError;
