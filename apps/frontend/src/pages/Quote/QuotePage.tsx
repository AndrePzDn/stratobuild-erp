import TableTemplate from "@/components/template/TableTemplate";
import { QuoteSchema } from "./schemas/quote.schema";
import QuoteFieldValues from "./components/QuoteForm";

export default function QuotePage() {
  const config = {
    tableHead: [
      { label: "Nombre", name: "name" },
      { label: "Cliente", name: "client.name" },
      { label: "Fecha", name: "date" },
      { label: "Fecha de Expiracion", name: "expiredDate" },
      { label: "Creado Por", name: "created_by.name" },
      { label: "Total", name: "total" },
      { label: "Estado", name: "status" },
    ],
    labelName: "Cotizaciones",
  };

  const normalizeFields = ["client", "created_by"];

  return (
    <TableTemplate
      config={config}
      entity="quote"
      canBeCreated
      editable
      deletable
      convertible
      schema={QuoteSchema}
      form={<QuoteFieldValues />}
      dialogSize="lg"
      normalizeFields={normalizeFields}
    />
  );
}
