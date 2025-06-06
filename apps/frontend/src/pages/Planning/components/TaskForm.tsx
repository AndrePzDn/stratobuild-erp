import { CalendarFormField } from "@/components/ui/calendar-form-field";
import { InputFormField } from "@/components/ui/input-form-field";
import { SelectFormField } from "@/components/ui/select-form-field";
import { useFormContext } from "react-hook-form";

export default function TaskFormValues() {
  const { control } = useFormContext();

  return (
    <section className="flex flex-col gap-4">
      <InputFormField
        control={control}
        name="name"
        label="Nombre"
        placeholder="Ingrese el nombre de la tarea"
      />
      <InputFormField
        control={control}
        name="description"
        label="Descripción"
        placeholder="Ingrese la descripción de la tarea"
      />
      <InputFormField
        control={control}
        name="category"
        label="Categoría"
        placeholder="Ingrese la categoría de la tarea"
      />
      <InputFormField
        control={control}
        name="progress"
        type="number"
        label="Progreso"
        placeholder="Ingrese el progreso de la tarea"
      />
      <CalendarFormField
        control={control}
        name="startDate"
        label="Fecha de Inicio"
      />
      <CalendarFormField
        control={control}
        name="endDate"
        label="Fecha de Fin"
      />
      <SelectFormField
        control={control}
        name="status"
        label="Estado"
        options={[
          { value: "not_started", label: "No iniciado" },
          { value: "in_progress", label: "En progreso" },
          { value: "completed", label: "Completado" },
          { value: "on_hold", label: "En espera" },
          { value: "delayed", label: "Retrasado" },
        ]}
      />
    </section>
  );
}
