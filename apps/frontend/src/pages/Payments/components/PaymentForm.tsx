import { CalendarFormField } from "@/components/ui/calendar-form-field";
import { InputFormField } from "@/components/ui/input-form-field";
import { SelectFormField } from "@/components/ui/select-form-field";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface Props {
  cashFlowId: string;
}

export default function PaymentFieldValues({ cashFlowId }: Props) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => console.log(errors), [errors]);

  const paymentTypeOptions = [
    { label: "Ingreso", value: "income" },
    { label: "Egreso", value: "expense" },
  ];

  useEffect(() => {
    console.log(cashFlowId);
    setValue("cashFlow", cashFlowId);
  }, [cashFlowId, setValue]);

  return (
    <div className="flex flex-col gap-4">
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
      <SelectFormField
        name="paymentType"
        label="Tipo de Pago"
        control={control}
        options={paymentTypeOptions}
        placeholder="Seleccione el tipo de pago"
      />
    </div>
  );
}
