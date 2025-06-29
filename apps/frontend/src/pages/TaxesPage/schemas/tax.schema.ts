import {z} from 'zod'

export const TaxSchema = z.object({
  taxName: z.string({message: "El nombre del impuesto es requerido"}).min(1, {message: "El nombre del impuesto es requerido"}),
  taxValue: z.number({message: "El valor del impuesto es requerido"}).min(0, {message: "El valor del impuesto debe ser mayor o igual a 0"}),
  isDefault: z.boolean().optional().default(false),
})

export type TaxSchemaType = z.infer<typeof TaxSchema>