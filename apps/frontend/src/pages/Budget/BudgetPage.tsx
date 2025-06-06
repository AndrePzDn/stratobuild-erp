import TableTemplate from "@/components/template/TableTemplate";
import { BudgetSchema } from "./schemas/budget.schema";
import BudgetFieldValues from "./components/BudgetForm";

export default function BudgetPage() {
  const config = {
    tableHead: [
      { label: "Nombre", name: "name" },
      { label: "Cliente", name: "client.name" },
      { label: "Sub Total", name: "subTotal" },
      { label: "Total", name: "total" },
      { label: "Estado", name: "status" },
    ],
    labelName: "Presupuestos",
  };

  const normalizeFields = [
    "client",
    "items.priceBank",
    "quote",
    "created_by",
    "projectType",
    "serviceType",
  ];

  return (
    <TableTemplate
      config={config}
      entity="budget"
      editable
      canBeCreated={false}
      deletable={false}
      convertible={true}
      dialogSize="lg"
      schema={BudgetSchema}
      form={<BudgetFieldValues />}
      normalizeFields={normalizeFields}
    />
  );
}
