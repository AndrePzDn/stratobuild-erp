import { z } from "zod";

export const CurrencySchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(1, { message: "El nombre es requerido" }),
  symbol: z
    .string({ required_error: "El simbolo es requerido" })
    .min(1, { message: "El simbolo es requerido" }),
  dollarValue: z
    .number()
    .gt(0, { message: "El valor del dolar debe ser mayor a 0" }),
  quoteDate: z.union([z.string(), z.null(), z.undefined()]).transform((val) => {
    if (!val) return null;
    const date = new Date(val);
    if (isNaN(date.getTime())) {
      throw new Error("La fecha de cotización no es válida");
    }
    return date;
  }),
});

export type CurrencySchemaType = z.infer<typeof CurrencySchema>;
