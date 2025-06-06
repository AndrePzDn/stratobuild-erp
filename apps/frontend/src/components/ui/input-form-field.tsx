import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Control, FieldValues, Path } from "react-hook-form";

interface InputFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  control: Control<T>;
  disabled?: boolean;
  value?: string | number | null;
  onChange?: (value: string | number | null) => void;
}

export const InputFormField = <T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  control,
  disabled = false,
  value,
}: InputFormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              value={value ?? field.value ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                if (field.onChange) {
                  field.onChange(value);
                }
                field.onChange(
                  type === "number"
                    ? value === ""
                      ? null
                      : parseFloat(value)
                    : value,
                );
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
