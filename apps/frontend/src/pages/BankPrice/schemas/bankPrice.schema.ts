import { z } from 'zod';

export const BankPriceSchema = z.object({
  unitPrice: z.number({ invalid_type_error: "El valor tiene que ser un numero valido" }).gt(0, { message: "El precio unitario debe ser mayor a 0" }),
  quoteDate: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => {
      if (!val) return null;
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error("La fecha de cotización no es válida");
      }
      return date;
    }),
  resource: z.string({ required_error: "El recurso es requerido" }),
  currency: z.string({ required_error: "La divisa es requerida" }),
  provider: z.string({ required_error: "El proveedor es requerido" }),
  unitOfMeasurement: z.string({
    required_error: "La unidad de medida es requerida"
  })
});

export type BankPriceSchemaType = z.infer<typeof BankPriceSchema>;
