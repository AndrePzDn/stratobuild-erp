import TableTemplate from "@/components/template/TableTemplate";
import { ResourceSchema } from "./schemas/resource.schema";
import ResourceFormFields from "./components/ResourceForm";

export default function ResourcePage() {
  const config = {
    tableHead: [
      { label: "Nombre", name: "name" },
      { label: "Descripcion", name: "description" },
      { label: "Tipo de Recurso", name: "resourceType" },
      { label: "Unidad de medida", name: "unitOfMeasurement.symbol" },
    ],
    labelName: "Recursos",
  };

  const normalizeFields = ["unitOfMeasurement"];

  return (
    <TableTemplate
      entity="resource"
      config={config}
      canBeCreated
      schema={ResourceSchema}
      form={<ResourceFormFields />}
      normalizeFields={normalizeFields}
      editable
    />
  );
}
