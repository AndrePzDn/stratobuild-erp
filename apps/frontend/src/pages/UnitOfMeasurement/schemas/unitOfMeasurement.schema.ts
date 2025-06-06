import { z } from 'zod';

export const UnitOfMeasurementSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  description: z.string().min(1, { message: 'La descripcion es requerida' }),
  symbol: z.string().min(1, { message: 'El simbolo es requerido' }),
})

export type UnitOfMeasurementSchemaType = z.infer<typeof UnitOfMeasurementSchema>;
