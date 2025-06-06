import { z } from 'zod'

const PaymentEnum = ['income', 'expense'] as const

export const PaymentSchema = z.object({
  description: z.string().min(1, "La Descripción es obligatoria"),
  amount: z.number().positive(),
  paymentType: z.enum(PaymentEnum, {
    errorMap: () => ({ message: "El tipo de pago es obligatorio" }),
  }),
  date: z.string({ message: 'La fecha es requerida' })
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error('La fecha no es válida');
      }
      return date;
    }),
  currency: z.string().optional().nullable(),
  cashFlow: z.string()
})

export type PaymentType = z.infer<typeof PaymentSchema>
