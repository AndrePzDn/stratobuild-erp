import {
  useFormContext,
  useWatch,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { useEffect } from "react";
import { Button } from "./button";
import { X } from "lucide-react";

interface FileFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  disabled?: boolean;
  value?: string | number | null;
}

export default function FileFormField<T extends FieldValues>({
  name,
  label,
  control,
  disabled,
  value,
}: FileFormFieldProps<T>) {
  const { setValue } = useFormContext<T>();
  const data = useWatch({ name, control });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      {data ? (
        <>
          <FormLabel>{label}</FormLabel>
          <div className="flex flex-col items-center justify-center mt-2">
            <article className="flex relative items-center justify-between bg-gray-100 p-8 rounded-md w-full">
              <Button
                type="button"
                variant="secondary"
                className="absolute right-0 top-0 mt-2 mr-2"
                onClick={() => {
                  setValue(name, null);
                }}
              >
                <X />
              </Button>
              {data.name.split(".").pop() === "pdf" ? (
                <iframe
                  src={URL.createObjectURL(data)}
                  className="w-full h-96"
                  title="PDF Preview"
                ></iframe>
              ) : (
                <img
                  src={URL.createObjectURL(data)}
                  className="w-full h-96 object-cover"
                  alt="Image Preview"
                />
              )}
            </article>
          </div>
        </>
      ) : (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  disabled={disabled}
                  accept="application/pdf, image/*"
                  defaultValue={value as string}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    field.onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}
