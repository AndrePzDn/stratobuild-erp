import { Button } from "@/components/ui/button";
import { CalendarFormField } from "@/components/ui/calendar-form-field";
import { Input } from "@/components/ui/input";
import { InputFormField } from "@/components/ui/input-form-field";
import { SelectFormField } from "@/components/ui/select-form-field";
import useFetchData from "@/hooks/useFetchEntityData";
import type { Client, ProjectType, ServiceType } from "@/types";
import { useFieldArray, useFormContext } from "react-hook-form";
import BudgetItems from "./BudgetItemsForm";
import { useEffect, useState } from "react";

export default function BudgetFieldValues() {
  const { data: clients } = useFetchData<Client>("client");
  const { data: projectTypes } = useFetchData<ProjectType>("projectType");
  const { data: serviceTypes } = useFetchData<ServiceType>("serviceType");
  const [total, setTotal] = useState<number>(0);

  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const { append, remove, fields } = useFieldArray({
    control,
    name: "items",
  });
  const watchedItems = useFormContext().watch("items");
  useEffect(() => console.log(getValues(), errors), [errors, getValues]);

  useEffect(() => {
    const newTotal =
      watchedItems?.reduce((acc, item) => {
        const price = parseFloat(item?.total ?? 0);
        return acc + (isNaN(price) ? 0 : price);
      }, 0) ?? 0;
    setTotal(newTotal);
  }, [watchedItems]);

  useEffect(() => {
    if (fields.length === 0) {
      append({ priceBank: "", quantity: "", total: "" });
    }
  }, [append, fields]);

  useEffect(() => {
    setValue("total", total);
    setValue("subTotal", total);
  }, [setValue, total]);

  const options = [
    { label: "Borrador", value: "draft" },
    { label: "Pendiente", value: "pending" },
    { label: "Aprobado", value: "approved" },
    { label: "Rechazado", value: "rejected" },
    { label: "En Progreso", value: "in_progress" },
    { label: "Finalizado", value: "done" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <section className="grid grid-cols-2 gap-4">
        <InputFormField
          control={control}
          label="Nombre"
          name="name"
          placeholder="Nombre del presupuesto"
        />
        <InputFormField
          control={control}
          label="Nota"
          name="note"
          placeholder=""
        />
      </section>
      <section className="grid grid-cols-3 gap-4">
        <SelectFormField
          control={control}
          label="Cliente"
          name="client"
          placeholder="Selecciona un cliente"
          options={clients.map((client) => ({
            label: client.name,
            value: client._id,
          }))}
        />
        <SelectFormField
          control={control}
          label="Estado"
          name="status"
          placeholder="Selecciona un estado"
          options={options}
        />
        <CalendarFormField control={control} label="Fecha" name="date" />
      </section>
      <section className="grid grid-cols-2 gap-4">
        <SelectFormField
          control={control}
          label="Tipo de Proyecto"
          name="projectType"
          placeholder="Selecciona un tipo de proyecto"
          options={projectTypes.map((type) => ({
            label: type.name,
            value: type._id,
          }))}
        />
        <SelectFormField
          control={control}
          label="Tipo de Servicio"
          name="serviceType"
          placeholder="Selecciona un tipo de servicio"
          options={serviceTypes.map((type) => ({
            label: type.name,
            value: type._id,
          }))}
        />
      </section>
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-medium">Items</h3>
        <div className="grid grid-cols-24 text-sm gap-4">
          <div className="col-span-6">Nombre del Item</div>
          <div className="col-span-5">Proveedor</div>
          <div className="col-span-4">Precio U.</div>
          <div className="col-span-4">Cantidad</div>
          <div className="col-span-4">Total</div>
        </div>
      </section>
      <section className="grid grid-cols-24 gap-4 items-start">
        {fields.map((_, index) => (
          <BudgetItems index={index} control={control} remove={remove} />
        ))}
      </section>
      <Button
        type="button"
        variant="outline"
        className="border-dotted border-2 p-4 border-gray-300 hover:bg-gray-100 bg-none"
        onClick={() => append({ priceBank: "", quantity: "", total: "" })}
      >
        Agregar Item
      </Button>
      <section className="flex justify-end items-center">
        <span className="text-sm font-medium mr-2">Total:</span>
        <Input
          name="taxRate"
          readOnly
          type="number"
          value={total}
          disabled
          className="w-32 text-right"
        />
      </section>
    </div>
  );
}
