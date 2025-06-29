import TableTemplate from "@/components/template/TableTemplate";
import { ServiceTypeSchema } from "./schemas/serviceType.schema";
import ProjectServiceFormValues from "./components/ProjectServiceForm";

export default function ProjectServicePage() {
  const config = {
    tableHead: [
      { label: "Nombre", name: "name" },
      { label: "Descripción", name: "description" },
    ],
    labelName: "Servicios",
  };

  return (
    <TableTemplate
      config={config}
      entity="serviceType"
      form={<ProjectServiceFormValues />}
      schema={ServiceTypeSchema}
      canBeCreated
      editable
      deletable
    />
  );
}
