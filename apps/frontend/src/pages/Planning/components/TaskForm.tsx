import { Button } from "@/components/ui/button";
import { CalendarFormField } from "@/components/ui/calendar-form-field";
import { InputFormField } from "@/components/ui/input-form-field";
import { SelectFormField } from "@/components/ui/select-form-field";
import useFetchData from "@/hooks/useFetchEntityData";
import type { Resource } from "@/types";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { PlanningSchemaType } from "../schemas/planning.schema";

export default function TaskFormValues() {
  const { data: resources } = useFetchData<Resource>("resource");
  const { control, getValues, setValue } = useFormContext<PlanningSchemaType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "assignedResources",
  });

  useEffect(() => {
    if (getValues('estimatedStartDate')) {
      setValue('estimatedStartDate', new Date(getValues('estimatedStartDate')));
    }
    if (getValues('estimatedEndDate')) {
      setValue('estimatedEndDate', new Date(getValues('estimatedEndDate')));
    }
  }, [getValues, setValue])

  return (
    <section className="flex flex-col">
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
        name="estimatedStartDate"
        label="Fecha de Inicio"
      />
      <CalendarFormField
        control={control}
        name="estimatedEndDate"
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
      <h3 className="text-md font-semibold mb-4">Recursos Asignados</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-4">
          <div className="grid grid-cols-2 gap-4">
            <SelectFormField
              name={`assignedResources.${index}.resource`}
              control={control}
              options={resources.map((resource) => ({
                label: resource.name,
                value: resource._id,
              }))}
              placeholder="Selecciona un recurso"
            />
            <InputFormField
              name={`assignedResources.${index}.quantity`}
              control={control}
              type="number"
              placeholder="Ingrese la cantidad"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            onClick={() => remove(index)}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="border-dotted border-2 p-4 border-gray-300 hover:bg-gray-100 bg-none"
        onClick={() => append({ resource: "", quantity: 0 })}
      >
        Asignar Recurso
      </Button>
    </section>
  );
}
