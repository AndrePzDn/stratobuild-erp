import TableTemplate from "@/components/template/TableTemplate";
import { CurrencySchema } from "./schemas/currency.schema";
import CurrencyFieldValues from "./components/CurrencyForm";

export default function CurrencyPage() {
  const config = {
    tableHead: [
      { label: "Nombre", name: "name" },
      { label: "Simbolo", name: "symbol" },
      { label: "Precio / Dolar", name: "dollarValue" },
      { label: "Fecha Cotizacion", name: "quoteDate" },
    ],
    labelName: "Divisas",
  };

  return (
    <TableTemplate
      config={config}
      entity="currency"
      schema={CurrencySchema}
      form={<CurrencyFieldValues />}
      canBeCreated
      deletable={false}
    />
  );
}
