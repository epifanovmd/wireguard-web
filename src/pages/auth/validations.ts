import { z } from "zod";

import { loginValidation, passwordValidation } from "~@common";

export const recoveryPasswordValidationSchema = z.object({
  login: loginValidation,
});

export const signInFormValidationSchema = z.object({
  login: loginValidation,
  password: passwordValidation,
});

export const signUpFormValidationSchema = z
  .object({
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    email: z.string().email("Invalid email address").optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
  })
  .merge(signInFormValidationSchema)
  .refine(data => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords does not match",
  });

export type TRecoveryPasswordForm = z.infer<
  typeof recoveryPasswordValidationSchema
>;
export type TSignInForm = z.infer<typeof signInFormValidationSchema>;
export type TSignUpForm = z.infer<typeof signUpFormValidationSchema>;
