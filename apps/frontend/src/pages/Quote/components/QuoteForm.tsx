import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import useFetchData from "@/hooks/useFetchEntityData";
import { useAuthStore } from "@/stores/authStore";
import type { Client } from "@/types";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { InputFormField } from "@/components/ui/input-form-field";
import { SelectFormField } from "@/components/ui/select-form-field";
import { CalendarFormField } from "@/components/ui/calendar-form-field";
import { Input } from "@/components/ui/input";

export default function QuoteFieldValues() {
  const { user } = useAuthStore();
  const [total, setTotal] = useState<number>(0);
  const { data: clients } = useFetchData<Client>("client");

  const statusOptions = [
    { label: "Pendiente", value: "pending" },
    { label: "Aprobada", value: "approved" },
    { label: "Rechazada", value: "rejected" },
    { label: "Expirada", value: "expired" },
    { label: "Convertida", value: "converted" },
  ];

  const { control, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const watchedItems = useWatch({
    control,
    name: "items",
  });

  useEffect(() => {
    setValue("created_by", user?._id);
  }, [setValue, user?._id]);

  useEffect(() => {
    if (fields.length === 0) {
      append({ itemName: "", description: "", price: "" });
    }
  }, [fields, append]);

  useEffect(() => {
    const newTotal =
      watchedItems?.reduce((acc, item) => {
        const price = parseFloat(item?.price ?? 0);
        return acc + (isNaN(price) ? 0 : price);
      }, 0) ?? 0;

    setTotal(newTotal);
  }, [watchedItems]);

  return (
    <div className="flex flex-col gap-4">
      <section className="grid grid-cols-2 gap-4 items-start">
        <InputFormField name="name" label="Nombre" control={control} />
        <InputFormField name="note" label="Nota" control={control} />
      </section>

      <section className="grid grid-cols-4 gap-4 items-start">
        <SelectFormField
          name="client"
          label="Cliente"
          control={control}
          options={clients.map((client) => ({
            label: client.name,
            value: client._id,
          }))}
          placeholder="Selecciona un Cliente"
        />
        <SelectFormField
          name="status"
          label="Estado"
          control={control}
          options={statusOptions}
          placeholder="Selecciona un estado"
        />
        <CalendarFormField
          name="date"
          label="Fecha Cotización"
          control={control}
        />
        <CalendarFormField
          name="expiredDate"
          label="Fecha de Expiración"
          control={control}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-medium">Items</h3>
        <div className="grid grid-cols-12 text-sm gap-4">
          <div className="col-span-3">Nombre del Item</div>
          <div className="col-span-6">Descripción</div>
          <div className="col-span-2">Precio</div>
          <div className="col-span-1" />
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-3">
              <InputFormField
                name={`items.${index}.itemName`}
                label=""
                control={control}
              />
            </div>
            <div className="col-span-6">
              <InputFormField
                name={`items.${index}.description`}
                label=""
                control={control}
              />
            </div>
            <div className="col-span-2">
              <InputFormField
                name={`items.${index}.price`}
                label=""
                control={control}
                type="number"
              />
            </div>
            <div className="col-span-1 flex justify-end self-start">
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="border-dotted border-2 p-4 border-gray-300 hover:bg-gray-100 bg-none"
          onClick={() => append({ itemName: "", description: "", price: "" })}
        >
          Agregar Item
        </Button>
      </section>
      <section className="flex justify-end items-center">
        <span className="text-sm font-medium mr-2">Total:</span>
        <Input
          readOnly
          type="number"
          className="w-32 text-right"
          value={total}
        />
      </section>
    </div>
  );
}
