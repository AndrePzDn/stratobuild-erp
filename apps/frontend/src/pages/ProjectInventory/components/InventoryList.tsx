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

  return (
    <ul className="flex flex-col">
      {data.map((item, index) => (
        <InventoryCard key={index} item={item} />
      ))}
    </ul>
  );
}
