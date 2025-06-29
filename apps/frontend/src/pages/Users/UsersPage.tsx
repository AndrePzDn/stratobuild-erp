import TableTemplate from "@/components/template/TableTemplate";
import { UserSchema } from "./schemas/user.schema";
import UserFormFields from "./components/UserForm";

export default function UsersPage() {
  const config = {
    tableHead: [
      { label: "Nombre", name: "name" },
      { label: "Email", name: "email" },
      { label: "Rol", name: "role" },
    ],
    labelName: "Usuarios",
  };

  return (
    <TableTemplate
      config={config}
      entity="admin"
      form={<UserFormFields />}
      schema={UserSchema}
      canBeCreated
      editable
      deletable
    />
  );
}
