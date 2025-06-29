import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Control, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  control: Control<T>;
  disabled?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export const CheckboxFormField = <T extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  disabled = false,
  value,
}: Props<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center space-x-2">
          <FormLabel>{label}</FormLabel>
          <FormControl className="w-fit cursor-pointer">
            <Input
              placeholder={placeholder}
              type="checkbox"
              checked={value ?? field.value ?? false}
              onChange={(e) => {
                const isChecked = e.target.checked;
                if (field.onChange) {
                  field.onChange(isChecked);
                }
              }}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
