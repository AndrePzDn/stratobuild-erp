import { useFormContext, useWatch } from "react-hook-form";
import type { PaymentResourceType } from "../schemas/payment.schema";
import useFetchData from "@/hooks/useFetchEntityData";
import type { PriceBank, Resource } from "@/types";
import { SelectFormField } from "@/components/ui/select-form-field";
import { InputFormField } from "@/components/ui/input-form-field";
import { useCallback, useEffect, useState } from "react";
import { CalendarFormField } from "@/components/ui/calendar-form-field";

interface Props {
  cashFlowId: string;
}

export default function ResourceExpenseFormValues({ cashFlowId }: Props) {
  const { control, setValue } = useFormContext<PaymentResourceType>();
  const { data: resources } = useFetchData<Resource>("resource");
  const { data: priceBank } = useFetchData<PriceBank>("priceBank");
  const [providers, setProviders] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );

  const resource = useWatch({ control, name: "resource" });

  const filterProviders = useCallback(
    (resourceId: string) => {
      return priceBank
        .filter((price) => price.resource._id === resourceId)
        .map((price) => ({
          label: price.provider.name,
          value: price._id,
        }));
    },
    [priceBank]
  );

  useEffect(() => {
    if (!resource) return;
    setProviders(filterProviders(resource));
    setSelectedResource(resources.find((res) => res._id === resource) || null);
  }, [filterProviders, resource, resources]);

  useEffect(() => {
    setValue("cashFlow", cashFlowId);
  }, [cashFlowId, setValue]);

  return (
    <div className="flex flex-col">
      <InputFormField
        control={control}
        label="Descripción"
        name="description"
        placeholder="Ingrese una descripción"
      />
      <CalendarFormField control={control} label="Fecha" name="date" />
      <SelectFormField
        control={control}
        label="Recurso"
        name="resource"
        options={resources.map((resource) => ({
          value: resource._id,
          label: resource.name,
        }))}
        placeholder="Selecciona un recurso"
      />
      <SelectFormField
        control={control}
        label="Proveedor"
        name="priceBank"
        options={providers.map((provider) => ({
          value: provider.value,
          label: provider.label,
        }))}
        disabled={!resource || providers.length === 0}
        placeholder="Selecciona un proveedor"
      />
      <InputFormField
        control={control}
        label={`Cantidad ${selectedResource?.unitOfMeasurement.name || ""}`}
        name="quantity"
        type="number"
        placeholder="Ingrese la cantidad"
      />
    </div>
  );
}
