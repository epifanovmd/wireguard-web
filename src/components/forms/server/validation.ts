import { z } from "zod";

export const serverValidation = z.object({
  name: z
    .string()
    .min(3, { message: "Минимальная длинна названия сервера 3 символа" })
    .refine(name => new RegExp(/wg[\d+]/).test(name), {
      message: "Название сервера должно соттвествовать маске 'wg{0-9}+'",
    }),
});

export type TServerForm = z.infer<typeof serverValidation>;
