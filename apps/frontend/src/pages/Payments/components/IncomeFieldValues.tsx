import { CalendarFormField } from "@/components/ui/calendar-form-field";
import { InputFormField } from "@/components/ui/input-form-field";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface Props {
  cashFlowId: string;
}

export default function IncomeFieldValues({ cashFlowId }: Props) {
  const { control, setValue } = useFormContext();

  useEffect(() => {
    setValue("cashFlow", cashFlowId);
    setValue("paymentType", "income");
  }, [cashFlowId, setValue]);

  return (
    <div className="flex flex-col">
      <InputFormField
        name="description"
        label="Descripción"
        control={control}
        placeholder="Ingrese una descripción del pago"
      />
      <InputFormField
        name="amount"
        label="Monto"
        type="number"
        control={control}
        placeholder="Ingrese el monto del pago"
      />
      <CalendarFormField name="date" label="Fecha" control={control} />
    </div>
  );
}
