import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Correo Electronico Invalido' }),
  password: z.string().min(6, { message: 'La contraseña tiene que tener por lo menos 6 caracteres' }),
})

export type LoginFormValues = z.infer<typeof LoginSchema>;
