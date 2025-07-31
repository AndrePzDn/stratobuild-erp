import { CalendarFormField } from "@/components/ui/calendar-form-field";
import FileFormField from "@/components/ui/file-form-field";
import { InputFormField } from "@/components/ui/input-form-field";
import { SelectFormField } from "@/components/ui/select-form-field";
import useListEntity from "@/hooks/useListEntity";
import type { ReportsSchemaType } from "@/pages/Planning/schemas/planning.schema";
import type { Task } from "@/types";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";

export default function ReportFormValues() {
  const { id } = useParams<{ id: string }>();
  const {
    control,
    formState: { errors },
  } = useFormContext<ReportsSchemaType>();

  const [data] = useListEntity<Task>("Task", 1, {
    project: id || "",
  });

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <div className="flex flex-col">
      <InputFormField
        control={control}
        name="name"
        label="Nombre del reporte"
        placeholder="Ingrese el nombre del reporte"
      />
      <SelectFormField
        control={control}
        name="task"
        label="Tarea"
        placeholder="Seleccione una tarea"
        options={data.map((task) => ({
          value: task._id,
          label: task.name,
        }))}
      />
      <InputFormField
        control={control}
        name="description"
        label="Descripción"
        placeholder="Ingrese una descripción del reporte"
      />
      <CalendarFormField
        control={control}
        label="Fecha del reporte"
        name="date"
      />
      <FileFormField
        control={control}
        name="imageUrl"
        label="Imagen"
        accept="image/*"
      />
    </div>
  );
}
