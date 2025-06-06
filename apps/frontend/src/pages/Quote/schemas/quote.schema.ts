import { z } from 'zod'
import { QuoteItemSchema } from './items.quote.schema';

const QuoteStatusEnum = ['pending', 'approved', 'rejected', 'expired', 'converted'] as const;

export const QuoteSchema = z.object({
  name: z.string({ message: 'El nombre es requerido' }).min(1, { message: 'El nombre tiene que tener más de un carácter' }),

  date: z.string({ message: 'La fecha es requerida' })
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error('La fecha no es válida');
      }
      return date;
    }),

  expiredDate: z.string({ message: 'La fecha de expiración es requerida' })
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error('La fecha de expiración no es válida');
      }
      return date;
    }),

  status: z.enum(QuoteStatusEnum, { message: 'El estatus es requerido' }),
  client: z.string({ message: 'El cliente es requerido' }),
  created_by: z.string(),
  note: z.string().optional().nullable(),

  taxRate: z.number().gte(0).optional().nullable(),

  items: QuoteItemSchema.array().nonempty({ message: 'Debe haber al menos un item en la cotización' }),
});

export type QuoteSchemaType = z.infer<typeof QuoteSchema>;

