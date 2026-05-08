import DialogTemplate from "@/components/template/DialogTemplate";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import type { ConstructionReport, Task } from "@/types";
import { deleteEntity } from "@/utils/connections";
import { formatDate } from "date-fns";
import { LoaderCircleIcon, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
  data: Task[];
  isLoading: boolean;
  isSuccess: boolean;
  refreshData: () => void;
}

export default function ReportList({
  data,
  isLoading,
  isSuccess,
  refreshData,
}: Props) {
  const { user } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState<ConstructionReport | null>(
    null
  );

  const tasksWithReports = data.filter(
    (task) => task.reports && task.reports.length > 0
  );

  const formattedData = tasksWithReports.reduce((acc, task) => {
    const category = task.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const handleDelete = async (constructionReportId: string) => {
    if (!user?.token) return;

    await deleteEntity(
      "ConstructionReport",
      constructionReportId,
      user.token
    ).then(() => {
      refreshData();
    });
  };

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
          Error al cargar los reportes. Por favor, inténtalo de nuevo más tarde.
        </p>
      </section>
    );
  }

  if (Object.keys(formattedData).length === 0) {
    return (
      <section className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-xl font-semibold mb-2">
          Este proyecto no tiene Reportes
        </h2>
        <p className="text-gray-500">
          Por favor, añade un reporte para comenzar
        </p>
      </section>
    );
  }

  return (
    <ul>
      {Object.entries(formattedData).map(([category, tasks]) => (
        <li key={category} className="p-4 border-b">
          <h2 className="text-lg font-semibold">{category}</h2>
          <ul>
            {tasks.map((task, index) => (
              <li key={index} className="flex flex-col gap-4 p-4 border-b">
                <h4 className="text-md font-semibold">{task.name}</h4>
                <div className="flex items-center gap-4 max-w-full overflow-x-auto">
                  {task.reports?.map((imgSrc, imgIndex) => (
                    <article key={imgIndex} className="relative">
                      <figure className="w-64 h-64 overflow-hidden rounded-lg shadow-md mb-4">
                        <img
                          src={imgSrc.imageUrl}
                          alt={imgSrc.name}
                          className="object-cover w-full h-full cursor-pointer"
                          onClick={() => setSelectedImage(imgSrc)}
                        />
                      </figure>
                      <Button
                        variant="secondary"
                        className="absolute top-1 right-1"
                        onClick={() => handleDelete(imgSrc._id)}
                      >
                        <Trash2 />
                      </Button>
                    </article>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </li>
      ))}
      <DialogTemplate
        title=""
        open={!!selectedImage}
        handleOpen={() => setSelectedImage(null)}
        trigger={false}
        size="xl"
      >
        {selectedImage && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{selectedImage.name}</h2>
            <span>{formatDate(selectedImage.date, "dd/MM/yyyy")}</span>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.name}
              className="object-cover w-full h-full cursor-pointer"
            />
          </div>
        )}
      </DialogTemplate>
    </ul>
  );
}
