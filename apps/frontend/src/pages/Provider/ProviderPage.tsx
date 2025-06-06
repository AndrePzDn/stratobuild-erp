import TableTemplate from "@/components/template/TableTemplate";
import { ProviderSchema } from "./schemas/provider.schema";
import ProviderFieldValues from "./components/ProviderForm";

export default function ProviderPage() {
  const config = {
    tableHead: [
      { label: "Nombre", name: "name" },
      { label: "Telefono", name: "phone" },
      { label: "Email", name: "email" },
    ],
    labelName: "Proveedores",
  };

  return (
    <TableTemplate
      config={config}
      entity="provider"
      canBeCreated
      editable
      schema={ProviderSchema}
      form={<ProviderFieldValues />}
    />
  );
}
