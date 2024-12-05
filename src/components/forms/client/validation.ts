import { z } from "zod";

export const clientValidation = z.object({
  name: z
    .string()
    .min(3, { message: "Минимальная длинна имени клиента 3 символа" }),
  enabled: z.boolean().optional(),
});

export type TClientForm = z.infer<typeof clientValidation>;
