import {
  GrafanaDashboard,
  type DashboardConfig,
  type PanelConfig,
} from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-picker-range";
import type { DateRange } from "@/components/dashboard/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/dashboard";

const BI_DASHBOARD_CONFIG: DashboardConfig = {
  grafanaBase: "http://localhost:5000",
  dashboardUid: "master-bi-dashboard",
  dashboardPath: "master-f-layout-analytics",
  folderUid: "",
  orgId: "1",
  panels: [
    { id: 5, title: "Estado de Cotizaciones", height: 350 },
    { id: 6, title: "Estado de Tareas", height: 350 },
    { id: 1, title: "Rentabilidad por Proyecto", height: 350 },
    { id: 2, title: "Margen de Ganancia por Tipos de Servicios u Obras", height: 350 },
    { id: 3, title: "Desvíos de Presupuesto y Cronograma", height: 400 },
    { id: 4, title: "Eficiencia y Utilización de Recursos", height: 400 },
    { id: 7, title: "Timeline de Ingresos, Gastos y Saldo", height: 450 },
  ],
  variables: [],
};

interface KPIs {
  presupuesto_total: number;
  pagos_realizados: number;
  saldo_disponible: number;
  proyectos_activos: number;
}

export default function HomePage() {
  const [proyectoFilter, setProyectoFilter] = useState<string>("all");
  const [options, setOptions] = useState<{ proyectos: string[] }>({ proyectos: [] });
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    to: new Date(),
  });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/filters/options`).then(res => {
      setOptions(res.data);
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (proyectoFilter !== "all") params.append("proyectos", proyectoFilter);
    params.append("date_from", dateRange.from.toISOString());
    params.append("date_to", dateRange.to.toISOString());

    axios.get(`${API_BASE_URL}/master-kpis?${params.toString()}`).then(res => {
      setKpis(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [proyectoFilter, dateRange]);

  const externalFilters = useMemo(() => ({
    Proyecto: proyectoFilter !== "all" ? [proyectoFilter] : [],
  }), [proyectoFilter]);

  const customLayoutBI = (panelUrls: Array<{ panel: PanelConfig; url: string }>) => (
    <section className="space-y-6">
      <div className={`grid grid-cols-1 ${proyectoFilter === "all" ? "md:grid-cols-2" : ""} gap-6`}>
        {panelUrls.filter(p => (p.panel.id === 5 && proyectoFilter === "all") || p.panel.id === 6).map(({ panel, url }) => (
          <Card key={`panel-${panel.id}`}>
            <CardContent className="p-2">
              <iframe src={url} width="100%" height={panel.height} style={{ border: "none" }} title={panel.title} />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {panelUrls.filter(p => p.panel.id === 1 || p.panel.id === 2).map(({ panel, url }) => (
          <Card key={`panel-${panel.id}`}>
            <CardContent className="p-2">
              <iframe src={url} width="100%" height={panel.height} style={{ border: "none" }} title={panel.title} />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {panelUrls.filter(p => p.panel.id === 3 || p.panel.id === 4).map(({ panel, url }) => (
          <Card key={`panel-${panel.id}`}>
            <CardContent className="p-2">
              <iframe src={url} width="100%" height={panel.height} style={{ border: "none" }} title={panel.title} />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6">
        {panelUrls.filter(p => p.panel.id === 7).map(({ panel, url }) => (
          <Card key={`panel-${panel.id}`}>
            <CardContent className="p-2">
              <iframe src={url} width="100%" height={panel.height} style={{ border: "none" }} title={panel.title} />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(val);

  const getKPIStyle = (key: keyof KPIs, val: number) => {
    if (key === "saldo_disponible") return val >= 0 ? "bg-emerald-500 text-white" : "bg-red-500 text-white";
    if (key === "presupuesto_total") return "bg-gray-800 text-white";
    if (key === "pagos_realizados") return "bg-blue-600 text-white";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6 text-foreground p-4">

      {loading || !kpis ? (
        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className={getKPIStyle("presupuesto_total", kpis.presupuesto_total)}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{formatCurrency(kpis.presupuesto_total)}</div></CardContent>
          </Card>
          <Card className={getKPIStyle("pagos_realizados", kpis.pagos_realizados)}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Pagos Realizados</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{formatCurrency(kpis.pagos_realizados)}</div></CardContent>
          </Card>
          <Card className={getKPIStyle("saldo_disponible", kpis.saldo_disponible)}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Saldo Disponible en Caja</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{formatCurrency(kpis.saldo_disponible)}</div></CardContent>
          </Card>
          <Card className={getKPIStyle("proyectos_activos", kpis.proyectos_activos)}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{kpis.proyectos_activos}</div></CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-muted/50 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium flex-shrink-0">Proyecto:</label>
          <Select value={proyectoFilter} onValueChange={setProyectoFilter}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Todos los Proyectos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Proyectos</SelectItem>
              {options.proyectos.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
           <label className="text-sm font-medium flex-shrink-0">Periodo:</label>
           <DateRangePicker date={dateRange} setDate={setDateRange} />
        </div>

        {proyectoFilter !== "all" && (
          <span className="text-xs text-muted-foreground px-2 py-1 bg-blue-50 border border-blue-200 rounded-full">
            Filtrando: <strong>{proyectoFilter}</strong>
          </span>
        )}
      </div>

      <GrafanaDashboard
        config={BI_DASHBOARD_CONFIG}
        title="Análisis Operacional"
        customLayout={customLayoutBI}
        externalFilters={externalFilters}
        showFilters={false}
        showDatePicker={false}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

    </div>
  );
}
