import { z } from 'zod'

export const ResourceSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  description: z.string().min(1, { message: "La descripcion es requerida" }),
  resourceType: z.string().min(1, { message: "El tipo de recurso es requerido" }),
  unitOfMeasurement: z.string({ required_error: "La unidad de medida es requerida" })
})

export type ResourceSchemaType = z.infer<typeof ResourceSchema>
