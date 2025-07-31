import useListEntity from "@/hooks/useListEntity";
import ReportList from "./components/ReportList";
import type { Task } from "@/types";
import { useParams } from "react-router-dom";
import ReportForm from "./components/ReportForm";

export default function ProjectReportsPage() {
  const { id } = useParams<{ id: string }>();
  const [data, isLoading, isSuccess, refreshData] = useListEntity<Task>(
    "Task",
    1,
    {
      project: id || "",
    }
  );

  return (
    <div>
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Reportes de Proyecto</h1>
        <ReportForm refreshData={refreshData} />
      </header>
      <ReportList
        data={data}
        isLoading={isLoading}
        isSuccess={isSuccess}
        refreshData={refreshData}
      />
    </div>
  );
}
