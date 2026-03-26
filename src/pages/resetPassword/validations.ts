import { passwordValidation } from "@common";
import { z } from "zod";

export const resetPasswordValidationSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: passwordValidation,
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают.",
  });

export type TResetPasswordForm = z.infer<typeof resetPasswordValidationSchema>;
