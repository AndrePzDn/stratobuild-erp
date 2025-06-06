import TableTemplate from "@/components/template/TableTemplate";
import { UnitOfMeasurementSchema } from "./schemas/unitOfMeasurement.schema";
import UnitOfMeasurementFieldValues from "./components/UnitOfMeasurementFieldValues";

export default function UnitOfMeasurementPage() {
  const config = {
    tableHead: [
      { label: "Nombre", name: "name" },
      { label: "Descripcion", name: "description" },
      { label: "Simbolo", name: "symbol" },
    ],
    labelName: "Unidades de Medida",
  };

  return (
    <TableTemplate
      entity="unitOfMeasurement"
      config={config}
      schema={UnitOfMeasurementSchema}
      form={<UnitOfMeasurementFieldValues />}
      editable
      canBeCreated
    />
  );
}
