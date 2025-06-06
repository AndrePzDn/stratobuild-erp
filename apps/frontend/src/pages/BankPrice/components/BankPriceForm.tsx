import { InputFormField } from "@/components/ui/input-form-field";
import { SelectFormField } from "@/components/ui/select-form-field";
import { CalendarFormField } from "@/components/ui/calendar-form-field";
import useFetchData from "@/hooks/useFetchEntityData";
import type { Currency, Provider, Resource, UnitOfMeasurement } from "@/types";
import { useFormContext } from "react-hook-form";

export default function BankPriceFieldValues() {
  const { data: resources } = useFetchData<Resource>("resource");
  const { data: currencies } = useFetchData<Currency>("currency");
  const { data: providers } = useFetchData<Provider>("provider");
  const { data: uoms } = useFetchData<UnitOfMeasurement>("unitOfMeasurement");

  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <SelectFormField
        name="resource"
        label="Recurso"
        control={control}
        placeholder="Seleccióna un recurso"
        options={resources.map((resource) => {
          return { label: resource.name, value: resource._id };
        })}
      />
      <SelectFormField
        name="currency"
        label="Divisa"
        control={control}
        placeholder="Seleccióna una divisa"
        options={currencies.map((currency) => {
          return { label: currency.name, value: currency._id };
        })}
      />
      <InputFormField
        name="unitPrice"
        label="Precio Unitario"
        type="number"
        control={control}
        placeholder="Ingresa el precio unitario"
      />
      <SelectFormField
        name="provider"
        label="Proveedor"
        control={control}
        placeholder="Seleccióna un provedor"
        options={providers.map((provider) => {
          return { label: provider.name, value: provider._id };
        })}
      />
      <SelectFormField
        name="unitOfMeasurement"
        label="Unidad de Medida"
        control={control}
        placeholder="Seleccióna una unidad de medida"
        options={uoms.map((uom) => {
          return { label: uom.name, value: uom._id };
        })}
      />
      <CalendarFormField
        name="quoteDate"
        label="Fecha de Cotización"
        control={control}
      />
    </div>
  );
}
