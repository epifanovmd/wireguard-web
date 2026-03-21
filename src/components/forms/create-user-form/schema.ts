import { z } from "zod";

import { ERole } from "~@api/api-gen/data-contracts";

export const createUserSchema = z
  .object({
    email: z
      .string()
      .refine(
        v => v === "" || z.string().email().safeParse(v).success,
        "Неверный email",
      ),
    phone: z.string().optional(),
    password: z.string().min(6, "Минимум 6 символов"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z.nativeEnum(ERole),
  })
  .refine(d => d.email || d.phone, {
    message: "Email или телефон обязателен",
    path: ["email"],
  });

export type CreateUserFormData = z.infer<typeof createUserSchema>;
