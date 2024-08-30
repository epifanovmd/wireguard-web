import { z } from "zod";

export const loginFormValidation = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type TLoginForm = z.infer<typeof loginFormValidation>;
