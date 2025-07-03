import useListEntity from "@/hooks/useListEntity";
import type { Certification } from "@/types";
import { LoaderCircleIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import CertificationList from "./components/CertificationList";
import CertificationForm from "./components/CertificationForm";

export default function CertificationPage() {
  const { id } = useParams<{ id: string }>();

  const [data, isLoading, isSuccess, refreshData] =
    useListEntity<Certification>("certification", 1);

  const filteredData = data.filter((certification) => {
    return certification.project._id === id;
  });

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
          Error al cargar las certificaciones. Por favor, inténtalo de nuevo más
          tarde.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Certificaciones del Proyecto</h1>
        <CertificationForm refreshData={refreshData} />
      </header>
      {filteredData.length === 0 && (
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Este proyecto no tiene certificaciones
          </h1>
          <p className="mt-2">
            Por favor, añade una certificación para comenzar.
          </p>
        </div>
      )}
      <CertificationList certifications={filteredData} />
    </section>
  );
}
