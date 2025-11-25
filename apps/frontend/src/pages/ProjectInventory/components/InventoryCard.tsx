import { Button } from "@/components/ui/button";
import type { InventoryItem } from "@/types";

interface Props {
  item: InventoryItem;
}

export default function InventoryCard({ item }: Props) {
  return (
    <li className="p-4 border-b border-gray-200 flex justify-between">
      <article className="flex flex-col">
        <h3 className="text-lg font-semibold">{item.resource.name}</h3>
        <p className="text-sm text-gray-600">{item.resource.description}</p>
      </article>
      <section className="flex flex-col items-end">
        <span className="text-sm text-gray-500">
          Cantidad Disponible: {item.quantityAvailable.toFixed(2)}{" "}
          {item.resource.unitOfMeasurement.symbol}
        </span>
        <span className="text-sm text-gray-500">
          Cantidad Usada: {item.quantityUsed.toFixed(2)}{" "}
          {item.resource.unitOfMeasurement.symbol}
        </span>
        <span className="text-sm text-gray-500">
          Total Recurso: {item.quantity.toFixed(2)}{" "}
          {item.resource.unitOfMeasurement.symbol}
        </span>
      </section>
    </li>
  );
}
