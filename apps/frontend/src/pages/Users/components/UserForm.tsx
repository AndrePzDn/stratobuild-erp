import { useFormContext } from "react-hook-form";
import type { UserSchemaType } from "../schemas/user.schema";
import { InputFormField } from "@/components/ui/input-form-field";
import { SelectFormField } from "@/components/ui/select-form-field";

export default function UserFormFields() {
  const { control } = useFormContext<UserSchemaType>();
  return (
    <div className="flex flex-col">
      <InputFormField
        control={control}
        label="Correo electrónico"
        name="email"
        placeholder="example@example.com"
        type="email"
      />
      <InputFormField
        control={control}
        label="Nombre"
        name="name"
        placeholder="Ingrese el nombre del usuario"
      />
      <InputFormField
        control={control}
        label="Apellido"
        name="surname"
        placeholder="Ingrese el apellido del usuario"
      />
      <SelectFormField
        control={control}
        label="Rol"
        name="role"
        placeholder="Seleccione un rol"
        options={[
          { value: "Admin", label: "Administrador" },
          { value: "ProjectManager", label: "Gerente de Proyecto" },
          { value: "SiteSupervisor", label: "Supervisor de Sitio" },
          { value: "Accountant", label: "Contador" },
          { value: "InventoryManager", label: "Gerente de Inventario" },
          { value: "GeneralDirector", label: "Director General" },
        ]}
      />
    </div>
  );
}
