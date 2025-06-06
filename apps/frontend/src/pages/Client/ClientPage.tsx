import TableTemplate from "@/components/template/TableTemplate";
import { ClientSchema } from "./schemas/client.schema";
import ClientFormFields from "./components/ClientForm";

export default function ClientPage() {
  const config = {
    tableHead: [
      { label: "Nombre", name: "name" },
      { label: "Telefono", name: "phone" },
      { label: "Pais", name: "country" },
      { label: "Direccion", name: "address" },
      { label: "Email", name: "email" },
    ],
    labelName: "Clientes",
  };

  return (
    <TableTemplate
      entity="client"
      config={config}
      schema={ClientSchema}
      form={<ClientFormFields />}
      editable
    />
  );
}
