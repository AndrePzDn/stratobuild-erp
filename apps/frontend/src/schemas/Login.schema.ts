import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({ message: "El correo electrónico es obligatorio" })
    .email({ message: "Correo Electronico Invalido" }),
  password: z.string({ message: "La contraseña es obligatoria" }).min(6, {
    message: "La contraseña tiene que tener por lo menos 6 caracteres",
  }),
  remember: z.boolean().default(false).optional(),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
