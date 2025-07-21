import { InputFormField } from "@/components/ui/input-form-field";
import { useFormContext } from "react-hook-form";
import type { PaymentType } from "../schemas/payment.schema";
import { useEffect } from "react";
import { CalendarFormField } from "@/components/ui/calendar-form-field";

interface Props {
  cashFlowId: string;
}

export default function ExpenseFormValues({ cashFlowId }: Props) {
  const { control, setValue } = useFormContext<PaymentType>();

  useEffect(() => {
    setValue("paymentType", "expense");
    setValue("cashFlow", cashFlowId);
  }, [cashFlowId, setValue]);

  return (
    <section className="flex flex-col">
      <InputFormField
        control={control}
        label="Descripción"
        name="description"
        placeholder="Descripción del gasto"
      />
      <InputFormField
        control={control}
        label="Monto"
        name="amount"
        type="number"
        placeholder="Monto del gasto"
      />
      <CalendarFormField control={control} label="Fecha" name="date" />
    </section>
  );
}
