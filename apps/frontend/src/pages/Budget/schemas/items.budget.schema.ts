import { z } from 'zod'

export const BudgetItemSchema = z.object({
  priceBank: z.string(),
  quantity: z.number({ invalid_type_error: "La cantidad es requerida" }).gte(0, { message: 'La cantidad debe ser mayor o igual a 0' }),
})
