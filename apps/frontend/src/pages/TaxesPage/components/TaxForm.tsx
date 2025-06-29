import { CheckboxFormField } from "@/components/ui/checkbox-form-field";
import { InputFormField } from "@/components/ui/input-form-field";
import { useFormContext } from "react-hook-form";

export default function TaxFormFields() {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col">
      <InputFormField
        control={control}
        name="taxName"
        label="Nombre del impuesto"
        placeholder="Ingrese el nombre del impuesto"
      />
      <InputFormField
        control={control}
        name="taxValue"
        label="Valor del impuesto"
        placeholder="Ingrese el valor del impuesto"
        type="number"
      />
      <CheckboxFormField
        control={control}
        name="isDefault"
        label="¿Es el impuesto por defecto?"
      />
    </div>
  );
}
