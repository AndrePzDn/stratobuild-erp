import { z } from 'zod'

export const QuoteItemSchema = z.object({
  itemName: z.string({ message: 'El nombre del item es requerido' }).min(1, { message: 'El nombre del item tiene que tener mas de un caracter' }),
  description: z.string().min(1, { message: 'La descripcion del item es requerida' }),
  price: z.number().gt(0, { message: 'El precio del item debe ser mayor a 0' }),
})

export type QuoteItemSchemaType = z.infer<typeof QuoteItemSchema>
