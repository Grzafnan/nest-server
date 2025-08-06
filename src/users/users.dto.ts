import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export const UserValidation = {
  create: createUserSchema,
  update: updateUserSchema,
};
