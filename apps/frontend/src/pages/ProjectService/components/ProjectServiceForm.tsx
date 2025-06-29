import { InputFormField } from "@/components/ui/input-form-field";
import { useFormContext } from "react-hook-form";
import type { ServiceTypeSchemaType } from "../schemas/serviceType.schema";

export default function ProjectServiceFormValues() {
  const { control } = useFormContext<ServiceTypeSchemaType>();

  return (
    <div className="flex flex-col">
      <InputFormField
        control={control}
        label="Nombre"
        name="name"
        placeholder="Nombre del servicio"
      />
      <InputFormField
        control={control}
        label="Descripción"
        name="description"
        placeholder="Descripción del servicio"
      />
    </div>
  );
}
