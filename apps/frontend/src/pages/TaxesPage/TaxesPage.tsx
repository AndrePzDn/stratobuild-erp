import TableTemplate from "@/components/template/TableTemplate";
import { TaxSchema } from "./schemas/tax.schema";
import TaxFormFields from "./components/TaxForm";

export default function TaxesPage() {
  const config = {
    tableHead: [
      { label: "Nombre", name: "taxName" },
      { label: "Porcentaje", name: "taxValue", type: "percentage" },
      { label: "Predefinido", name: "isDefault", type: "boolean" },
    ],
    labelName: "Impuestos",
  };

  return (
    <TableTemplate
      config={config}
      entity="taxes"
      canBeCreated={true}
      deletable={false}
      schema={TaxSchema}
      form={<TaxFormFields />}
      editable
    />
  );
}
