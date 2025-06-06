import { CalendarFormField } from "@/components/ui/calendar-form-field";
import { InputFormField } from "@/components/ui/input-form-field";
import { useFormContext } from "react-hook-form";

export default function CurrencyFieldValues() {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <InputFormField
        control={control}
        label="Nombre"
        name="name"
        placeholder="Ingresa el nombre de la divisa"
      />
      <InputFormField
        control={control}
        label="Simbolo"
        name="symbol"
        placeholder="Ingresa el simbolo de la divisa"
      />
      <InputFormField
        control={control}
        label="Precio / Dolar"
        name="dollarValue"
        type="number"
        placeholder=""
      />
      <CalendarFormField
        control={control}
        label="Fecha de cotizacion"
        name="quoteDate"
      />
    </div>
  );
}
