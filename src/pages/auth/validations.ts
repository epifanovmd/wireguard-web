import { z } from "zod";

export const signInFormValidation = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
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
