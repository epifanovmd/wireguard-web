import { z } from "zod";

import { isEmail, isPhone } from "./helpers";

export const loginValidation = z
  .string({ message: "Введите email или номер телефона." })
  .refine(value => isEmail(value) || isPhone(value), {
    message: "Введите корректный email или номер телефона",
  });

export const passwordValidation = z
  .string({ message: "Введите пароль." })
  .min(6, { message: "Пароль должен быть не менее 6-ти символов." });

// const passwordValidation = z
//   .string()
//   .min(8, "Пароль должен содержать минимум 8 символов")
//   .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
//   .regex(
//     /[!@#$%^&*(),.?":{}|<>]/,
//     "Пароль должен содержать хотя бы один специальный символ",
//   );
