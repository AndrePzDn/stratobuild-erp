import { useEffect, useState } from "react";
import KPICard from "../ui/kpi";
import {
  Activity,
  BarChart3,
  Briefcase,
  DollarSign,
  TrendingDown,
} from "lucide-react";

interface KPIDashboardProps {
  selectedProjectName?: string;
  selectedProjectsCount?: number;
  selectedProjects?: string[];
}

export default function KPIDashboard({
  selectedProjectName = "",
  selectedProjectsCount = 0,
  selectedProjects = [],
}: KPIDashboardProps) {
  const [kpis, setKpis] = useState({
    income: 0,
    expense: 0,
    margin_percent: 0,
    active_projects: 0,
    avg_progress: 0,
    task_states: {},
    total_delayed_tasks: 0,
  });

  const formatMoney = (amount: number | string) => {
    const num = typeof amount === "number" ? amount : Number(amount) || 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num);
  };

  useEffect(() => {
    const hosts = [
      "http://host.docker.internal:8000",
      "http://172.17.0.1:8000",
      "http://localhost:8000",
    ];

    const load = async () => {
      for (const host of hosts) {
        try {
          let url = `${host}/api/dashboard/kpis`;
          
          // Si hay proyectos seleccionados, agregar query params
          if (selectedProjects.length > 0) {
            const params = new URLSearchParams();
            selectedProjects.forEach(proj => {
              params.append('project_name', proj);
            });
            url += `?${params.toString()}`;
          }
          
          const res = await fetch(url, { mode: "cors", signal: ctrl.signal });
          if (!res.ok) continue;
          const data = await res.json();
          setKpis((prev) => ({ ...prev, ...data }));
          return;
        } catch {
          // try next candidate
        }
      }
    };

    // reset to default while loading new project KPIs
    setKpis({
      income: 0,
      expense: 0,
      margin_percent: 0,
      active_projects: 0,
      avg_progress: 0,
      task_states: {},
      total_delayed_tasks: 0,
    });

    const ctrl = new AbortController();
    load();

    return () => {
      ctrl.abort();
    };
  }, [selectedProjects]);

  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          title="Ingresos Totales"
          value={formatMoney(kpis.income)}
          Icon={DollarSign}
          color="#10b981"
        />

        <KPICard
          title="Gastos Operativos"
          value={formatMoney(kpis.expense)}
          Icon={TrendingDown}
          color="#ef4444"
        />

        <KPICard
          title="Margen Operativo"
          value={`${Number(kpis.margin_percent || 0).toFixed(1)}%`}
          Icon={Activity}
          color="#3b82f6"
        />

        {selectedProjectsCount <= 1 ? (
          <KPICard
            title="Proyectos Activos"
            value={kpis.active_projects}
            Icon={Briefcase}
            color="#f59e0b"
          />
        ) : (
          <KPICard
            title="Tareas Retrasadas"
            value={kpis.total_delayed_tasks || 0}
            Icon={Briefcase}
            color="#f59e0b"
          />
        )}

        <KPICard
          title="Progreso Promedio"
          value={`${Number(kpis.avg_progress || 0).toFixed(1)}%`}
          Icon={BarChart3}
          color="#7c3aed"
        />
      </div>
    </section>
  );
}
