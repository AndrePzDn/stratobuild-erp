import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import TooltipButton from "@/components/ui/tooltip-button";
import useListEntity from "@/hooks/useListEntity";
import type { Project } from "@/types";
import {
  ArrowDownUp,
  ChartGantt,
  Files,
  LoaderCircleIcon,
  PackageOpen,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProjectPage() {
  const { page } = useParams();
  const pageNumber = page ? parseInt(page) : 1;
  const navigate = useNavigate();

  const [listData, isLoading, isSuccess] = useListEntity<Project>(
    "project",
    pageNumber
  );

  const projectServiceGrouped = () => {
    return listData.reduce((acc, project) => {
      const service = project.serviceType.name;
      if (!acc[service]) {
        acc[service] = [];
      }
      acc[service].push(project);
      return acc;
    }, {} as Record<string, Project[]>);
  };

  const statusTranslate = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "inactive":
        return "Inactivo";
      case "completed":
        return "Completado";
      case "in_progress":
        return "En Progreso";
      case "on_hold":
        return "En Espera";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <section className="flex items-center justify-center h-screen">
        <LoaderCircleIcon size={50} className="animate-spin" />
      </section>
    );
  }

  if (!isSuccess && !isLoading) {
    return (
      <section className="flex items-center justify-center h-screen">
        <p className="text-red-500">
          Error loading projects. Please try again.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Proyectos</h1>
      {Object.entries(projectServiceGrouped()).map(([service, projects]) => (
        <article key={service} className="flex flex-col gap-4 mb-8">
          <h2 className="text-lg font-semibold">{service}</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project._id} className="w-full flex flex-col h-full">
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>
                      {project.location || "Sin ubicación"}
                    </CardDescription>
                  </div>
                  <Badge variant={"outline"}>
                    {statusTranslate(project.status)}
                  </Badge>
                </CardHeader>

                <CardContent className="flex-grow">
                  <h3 className="text-sm font-medium mb-2">
                    Información del Cliente
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Cliente: {project.client.name || "No Cliente"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Teléfono: {project.client.phone || "No disponible"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Correo: {project.client.email || "No disponible"}
                  </p>
                  <Separator className="my-4" />
                  <h3 className="text-sm font-medium mb-2">
                    Información del Proyecto
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Obra en: {project.projectType.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Fecha de inicio:{" "}
                    {new Date(project.startDate).toLocaleDateString()}
                  </p>
                  {project.endDate && (
                    <p className="text-sm text-muted-foreground">
                      Fecha de finalización:{" "}
                      {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>

                <CardFooter className="flex justify-end flex-wrap gap-4 mt-auto">
                  <TooltipButton icon={<PackageOpen />}>
                    Inventario
                  </TooltipButton>
                  <TooltipButton
                    icon={<ChartGantt />}
                    onClick={() => navigate(`/project/planning/${project._id}`)}
                  >
                    Planeación
                  </TooltipButton>
                  <TooltipButton
                    icon={<Files />}
                    onClick={() =>
                      navigate(`/project/certifications/${project._id}`)
                    }
                  >
                    Certificaciones
                  </TooltipButton>
                  <TooltipButton
                    icon={<ArrowDownUp />}
                    onClick={() => navigate(`/project/payments/${project._id}`)}
                  >
                    Flujo de Caja
                  </TooltipButton>
                </CardFooter>
              </Card>
            ))}
          </div>
          <Separator />
        </article>
      ))}
      <></>
    </section>
  );
}
