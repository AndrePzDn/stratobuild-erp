import { z } from 'zod'

const TaskEnum = ['not_started', 'in_progress', 'completed', 'on_hold', 'delayed'] as const

export const PlanningSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  category: z.string().min(1, 'La categoría es requerida'),
  progress: z.number().min(0, 'El progreso debe ser al menos 0').max(100, 'El progreso no puede ser mayor a 100').default(0),
  startDate: z.string({ message: 'La fecha inicial es requerida' })
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error('La fecha no es válida');
      }
      return date;
    }),

  endDate: z.string({ message: 'La fecha final es requerida' })
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error('La fecha no es válida');
      }
      return date;
    }),

  status: z.enum(TaskEnum).default('not_started'),
  project: z.string()
})

export type PlanningSchemaType = z.infer<typeof PlanningSchema>
