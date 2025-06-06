import { z } from 'zod'
import { BudgetItemSchema } from './items.budget.schema';

const BudgetStatusEnum = ['draft', 'pending', 'approved', 'rejected', 'in_progress', 'done'] as const

export const BudgetSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  date: z.string({ message: 'La fecha es requerida' })
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error('La fecha no es válida');
      }
      return date;
    }),
  created_by: z.string(),
  quote: z.string(),
  client: z.string(),
  projectType: z.string(),
  serviceType: z.string(),
  note: z.string().optional().nullable(),
  status: z.enum(BudgetStatusEnum, { message: 'El estatus es requerido' }),
  taxRate: z.number().gte(0).default(0),
  items: BudgetItemSchema.array().nonempty({ message: 'Debe haber al menos un item en el presupuesto' }),
})

export type BudgetSchemaValues = z.infer<typeof BudgetSchema>
