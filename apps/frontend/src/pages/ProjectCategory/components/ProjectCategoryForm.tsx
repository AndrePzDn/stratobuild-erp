import { useFormContext } from "react-hook-form";
import type { ProjectCategorySchemaType } from "../schemas/projectCategory.schema";
import { InputFormField } from "@/components/ui/input-form-field";

export default function ProjectCategoryFormFields() {
  const { control } = useFormContext<ProjectCategorySchemaType>();

  return (
    <div className="flex flex-col">
      <InputFormField
        control={control}
        label="Nombre"
        name="name"
        placeholder="Nombre de la categoría"
      />
      <InputFormField
        control={control}
        label="Descripción"
        name="description"
        placeholder="Descripción de la categoría"
      />
    </div>
  );
}
