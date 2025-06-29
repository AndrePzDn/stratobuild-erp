import { z } from "zod";

export const ServiceTypeSchema = z.object({
  name: z
    .string({ message: "El nombre es requerido" })
    .min(1, { message: "El nombre es requerido" }),
  description: z
    .string({ message: "La descripción es requerida" })
    .min(1, { message: "La descripción es requerida" }),
});

export type ServiceTypeSchemaType = z.infer<typeof ServiceTypeSchema>;
