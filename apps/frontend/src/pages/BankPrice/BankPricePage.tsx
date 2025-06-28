import TableTemplate from "@/components/template/TableTemplate";
import { BankPriceSchema } from "./schemas/bankPrice.schema";
import BankPriceFieldValues from "./components/BankPriceForm";

export default function BankPricePage() {
  const config = {
    tableHead: [
      { label: "Recurso", name: "resource.name" },
      { label: "Divisa", name: "currency.symbol" },
      { label: "Precio Unitario", name: "unitPrice" },
      { label: "Proveedor", name: "provider.name" },
      { label: "U. Medida", name: "unitOfMeasurement.symbol" },
      { label: "Fecha Cotizacion", name: "quoteDate", type: "date" },
    ],
    labelName: "Banco de Precios",
  };

  return (
    <TableTemplate
      config={config}
      entity="priceBank"
      canBeCreated
      deletable={false}
      schema={BankPriceSchema}
      form={<BankPriceFieldValues />}
    />
  );
}
