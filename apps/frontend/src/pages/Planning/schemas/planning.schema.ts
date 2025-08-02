import { z } from "zod";

const TaskEnum = [
  "not_started",
  "in_progress",
  "completed",
  "on_hold",
  "delayed",
] as const;

export const PlanningSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  category: z.string().min(1, "La categoría es requerida"),
  progress: z
    .number()
    .min(0, "El progreso debe ser al menos 0")
    .max(100, "El progreso no puede ser mayor a 100")
    .default(0),
  estimatedStartDate: z
    .string({ message: "La fecha inicial es requerida" })
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error("La fecha no es válida");
      }
      return date;
    }),

  estimatedEndDate: z
    .string({ message: "La fecha final es requerida" })
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error("La fecha no es válida");
      }
      return date;
    }),

  status: z.enum(TaskEnum).default("not_started"),
  assignedResources: z
    .array(
      z.object({
        resource: z.string().min(1, "El recurso es requerido"),
        quantity: z
          .number({ invalid_type_error: "La cantidad es requerida" })
          .gt(0, { message: "La cantidad debe ser mayor a 0" }),
      })
    )
    .optional()
    .nullable(),
  reports: z.array(z.string()).optional().nullable(),
  project: z.string(),
});

export const ReportsSchema = z.object({
  task: z.string(),
  name: z.string().min(1, "El nombre del reporte es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  date: z.string({ message: "La fecha es requerida" }).transform((val) => {
    const date = new Date(val);
    if (isNaN(date.getTime())) {
      throw new Error("La fecha no es válida");
    }
    return date;
  }),
  imageUrl: z.any(),
});

export type PlanningSchemaType = z.infer<typeof PlanningSchema>;
export type ReportsSchemaType = z.infer<typeof ReportsSchema>;
