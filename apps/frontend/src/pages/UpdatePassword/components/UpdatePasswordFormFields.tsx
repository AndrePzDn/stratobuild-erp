import { useFormContext } from "react-hook-form";
import type { UpdatePasswordSchemaType } from "../schemas/updatePassword.schema";
import { InputFormField } from "@/components/ui/input-form-field";

export default function UpdatePasswordFormFields() {
  const { control } = useFormContext<UpdatePasswordSchemaType>();

  return (
    <div className="flex flex-col">
      <InputFormField
        control={control}
        name="password"
        label="Nueva Contraseña"
        type="password"
        placeholder="Ingrese su nueva contraseña"
      />
      <InputFormField
        control={control}
        name="passwordCheck"
        label="Confirmar Contraseña"
        type="password"
        placeholder="Confirme su nueva contraseña"
      />
    </div>
  );
}
