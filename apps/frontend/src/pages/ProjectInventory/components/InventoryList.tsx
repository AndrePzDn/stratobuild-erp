import useListEntity from "@/hooks/useListEntity";
import type { InventoryItem } from "@/types";
import { LoaderCircleIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import InventoryCard from "./InventoryCard";

export default function InventoryList() {
  const { id } = useParams<{ id: string }>();

  const [data, isLoading, isSuccess] = useListEntity<InventoryItem>(
    "ProjectInventory",
    1,
    { projectId: id || "" }
  );

  if (isLoading) {
    return (
      <section className="flex items-center justify-center h-screen text-primary">
        <LoaderCircleIcon size={50} className="animate-spin" />
      </section>
    );
  }

  if (!isSuccess && !isLoading) {
    return (
      <section className="flex items-center justify-center h-screen">
        <p className="text-red-500">
          Error al cargar el inventario. Por favor, inténtalo de nuevo más
          tarde.
        </p>
      </section>
    );
  }

  if (data.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-xl font-semibold mb-2">
          Este proyecto no tiene Artículos en Inventario
        </h2>
        <p className="text-gray-500">
          Por favor, añade un artículo para comenzar desde el flujo de caja del proyecto
        </p>
      </section>
    );
  }

  return (
    <ul className="flex flex-col">
      {data.map((item, index) => (
        <InventoryCard key={index} item={item} />
      ))}
    </ul>
  );
}
