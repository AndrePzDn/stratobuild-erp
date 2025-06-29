import TableTemplate from "@/components/template/TableTemplate";
import { ProjectCategorySchema } from "./schemas/projectCategory.schema";
import ProjectCategoryFormFields from "./components/ProjectCategoryForm";

export default function ProjectCategoryPage() {
  const config = {
    tableHead: [
      { label: "Nombre", name: "name" },
      { label: "Descripción", name: "description" },
    ],
    labelName: "Categorías",
  };

  return (
    <TableTemplate
      config={config}
      entity="projectType"
      form={<ProjectCategoryFormFields />}
      schema={ProjectCategorySchema}
      canBeCreated
      editable
      deletable
    />
  );
}
