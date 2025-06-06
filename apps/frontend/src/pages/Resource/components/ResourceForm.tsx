import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetchData from "@/hooks/useFetchEntityData";
import type { UnitOfMeasurement } from "@/types";
import { useFormContext } from "react-hook-form";

export default function ResourceFormFields() {
  const { data: uomValues } =
    useFetchData<UnitOfMeasurement>("unitOfMeasurement");

  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="resourceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de recurso</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="unitOfMeasurement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unidad de Medida</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccióna una unidad de medida" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {uomValues.map((uom, i) => (
                  <SelectItem key={i} value={uom._id}>
                    {uom.name} - {uom.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
