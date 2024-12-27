import { z } from "zod";

const EMAIL_REGEX = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const PHONE_REGEX = new RegExp(/^\d{10,15}$/);

export const loginValidation = z.string().refine(
  value => {
    // Проверяем, является ли значение email
    const isEmail = EMAIL_REGEX.test(value);
    // Проверяем, является ли значение телефонным номером (например, только цифры)
    const isPhone = PHONE_REGEX.test(value);

    // Возвращаем true, если это либо email, либо телефонный номер
    return isEmail || isPhone;
  },
  {
    message: "Введите корректный email или номер телефона",
  },
);

export const passwordValidation = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" });

// const passwordValidation = z
//   .string()
//   .min(8, "Пароль должен содержать минимум 8 символов")
//   .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
//   .regex(
//     /[!@#$%^&*(),.?":{}|<>]/,
//     "Пароль должен содержать хотя бы один специальный символ",
//   );
