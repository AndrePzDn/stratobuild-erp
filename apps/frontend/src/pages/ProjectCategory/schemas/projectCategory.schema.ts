import { z } from "zod";

export const ProjectCategorySchema = z.object({
  name: z
    .string({ message: "El nombre es requerido" })
    .min(1, "El nombre es requerido"),
  description: z
    .string({ message: "La descripción es requerida" })
    .min(1, { message: "La descripción es requerida" }),
});

export type ProjectCategorySchemaType = z.infer<typeof ProjectCategorySchema>;
