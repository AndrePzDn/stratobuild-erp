import { z } from 'zod'

export const ClientSchema = z.object({
  name: z.string({ message: 'El nombre es requerido' }).min(1, { message: 'El nombre tiene que tener mas de un caracter' }),
  phone: z.string({ message: 'El telefono es requerido' }).min(6, { message: 'El telefono tiene que tener minimo 6 numeros' }),
  country: z.string({ message: 'El pais es requerido' }).min(1, { message: 'El pais es requerido' }),
  address: z.string({ message: 'La direccion es requerida' }).min(1, { message: 'La direccion es requerida' }),
  email: z.string({ message: 'El email debe ser válido' }).email({ message: 'El email debe ser válido' }),
  createdBy: z.string()
})

export type ClientSchemaType = z.infer<typeof ClientSchema>
