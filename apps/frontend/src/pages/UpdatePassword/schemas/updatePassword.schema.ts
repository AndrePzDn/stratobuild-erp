import { z } from "zod";

export const UpdatePasswordSchema = z
  .object({
    password: z
      .string({ message: "La nueva contraseña es obligatoria" })
      .min(8, {
        message: "La nueva contraseña debe tener al menos 8 caracteres",
      }),
    passwordCheck: z
      .string({ message: "La confirmación de la contraseña es obligatoria" })
      .min(8, {
        message:
          "La confirmación de la contraseña debe tener al menos 8 caracteres",
      }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "Las contraseñas no coinciden",
    path: ["passwordCheck"],
  });

export type UpdatePasswordSchemaType = z.infer<typeof UpdatePasswordSchema>;
