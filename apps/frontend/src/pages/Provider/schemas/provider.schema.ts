import { z } from 'zod'

export const ProviderSchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: 'El nombre es requerido' }),
  phone: z.string({ required_error: "El telefono es requerido" }).min(7, { message: 'El telefono tiene que tener por lo menos 7 caracteres' }),
  email: z.string({ required_error: "El email es requerido" }).email({ message: 'El email debe ser valido' }),
})

export type ProviderSchemaType = z.infer<typeof ProviderSchema>
