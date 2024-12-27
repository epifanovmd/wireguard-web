import { z } from "zod";

// const passwordSchema = z
//   .string()
//   .min(8, "Пароль должен содержать минимум 8 символов")
//   .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
//   .regex(
//     /[!@#$%^&*(),.?":{}|<>]/,
//     "Пароль должен содержать хотя бы один специальный символ",
//   );

export const signInFormValidation = z.object({
  login: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const signUpFormValidation = z
  .object({
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    email: z.string().email("Invalid email address").optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
  })
  .merge(signInFormValidation)
  .refine(data => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords does not match",
  });

export type TSignInForm = z.infer<typeof signInFormValidation>;
export type TSignUpForm = z.infer<typeof signUpFormValidation>;
