import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus } from "@nestjs/common";
import ApiError from "src/errors/apiError";
import { ZodSchema } from "zod";

@Injectable()
export class ValidationRequest<T> implements PipeTransform {
  constructor(private schema: ZodSchema<T>) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, _metadata: ArgumentMetadata): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const formatted = result.error.issues
        .map((issue) =>
          Array.isArray(issue.path) ? issue.path.map((p) => String(p)).join(", ") : "",
        )
        .filter((field) => field)
        .join(", ");
      throw new ApiError(HttpStatus.BAD_REQUEST, `Body Validation failed for fields: ${formatted}`);
    }
    return result.data;
  }
}
