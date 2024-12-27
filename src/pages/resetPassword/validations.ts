import { z } from "zod";

import { passwordValidation } from "~@common";

export const resetPasswordValidationSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: passwordValidation,
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords does not match",
  });

export type TResetPasswordForm = z.infer<typeof resetPasswordValidationSchema>;
