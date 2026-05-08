import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const API_BASE_URL = "http://localhost:8000/api/dashboard";

interface KPIs {
  income: number;
  expense: number;
  margin_percent: number;
  active_projects: number;
  avg_progress: number;
}

export default function BIDashboard() {
  const [granularity, setGranularity] = useState<string>("month");
  
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [cashFlowFig, setCashFlowFig] = useState<any>(null);
  const [budgetFig, setBudgetFig] = useState<any>(null);
  const [statusFig, setStatusFig] = useState<any>(null);
  const [resourceFig, setResourceFig] = useState<any>(null);
  const [quotesStatesFig, setQuotesStatesFig] = useState<any>(null);
  const [rentabilityFig, setRentabilityFig] = useState<any>(null);
  const [utilityProjectFig, setUtilityProjectFig] = useState<any>(null);
  const [incomesTimelineFig, setIncomesTimelineFig] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [granularity]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        kpiRes, cashRes, budgetRes, statusRes, resRes,
        quotesRes, rentabilityRes, utilityRes, incomesRes
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/kpis`),
        axios.get(`${API_BASE_URL}/cash-flow?granularity=${granularity}`),
        axios.get(`${API_BASE_URL}/budget-deviation`),
        axios.get(`${API_BASE_URL}/task-progress-donut`),
        axios.get(`${API_BASE_URL}/portfolio-treemap`),
        axios.get(`${API_BASE_URL}/quotes-states`),
        axios.get(`${API_BASE_URL}/rentability-timeline?granularity=${granularity}`),
        axios.get(`${API_BASE_URL}/utility-per-project`),
        axios.get(`${API_BASE_URL}/incomes-timeline?granularity=${granularity}`)
      ]);

      setKpis(kpiRes.data);
      setCashFlowFig(typeof cashRes.data === 'string' ? JSON.parse(cashRes.data) : cashRes.data);
      setBudgetFig(typeof budgetRes.data === 'string' ? JSON.parse(budgetRes.data) : budgetRes.data);
      setStatusFig(typeof statusRes.data === 'string' ? JSON.parse(statusRes.data) : statusRes.data);
      setResourceFig(typeof resRes.data === 'string' ? JSON.parse(resRes.data) : resRes.data);
      
      setQuotesStatesFig(typeof quotesRes.data === 'string' ? JSON.parse(quotesRes.data) : quotesRes.data);
      setRentabilityFig(typeof rentabilityRes.data === 'string' ? JSON.parse(rentabilityRes.data) : rentabilityRes.data);
      setUtilityProjectFig(typeof utilityRes.data === 'string' ? JSON.parse(utilityRes.data) : utilityRes.data);
      setIncomesTimelineFig(typeof incomesRes.data === 'string' ? JSON.parse(incomesRes.data) : incomesRes.data);
    } catch (error) {
      console.error("Error fetching BI data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(val);
  };

  const renderPlot = (fig: any) => {
    if (!fig) return null;
    return (
      <Plot
        data={fig.data}
        layout={{
          ...fig.layout,
          autosize: true,
          margin: { l: 40, r: 20, t: 40, b: 40 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%", minHeight: "350px" }}
        config={{ responsive: true, displayModeBar: false }}
      />
    );
  };

  return (
    <div className="space-y-6 mt-12 pb-12 border-t pt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Descriptive BI</h2>
          <p className="text-muted-foreground">Analítica descriptiva basada en el datawarehouse clickhouse.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Granularidad:</label>
          <Select value={granularity} onValueChange={setGranularity}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mensual</SelectItem>
              <SelectItem value="quarter">Trimestral</SelectItem>
              <SelectItem value="year">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && !kpis ? (
        <div className="flex justify-center items-center py-20 min-h-[400px]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(kpis?.income || 0)}</div>
                <p className="text-xs text-muted-foreground">Recaudado hasta la fecha</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(kpis?.expense || 0)}</div>
                <p className="text-xs text-muted-foreground">Ejecutado hasta la fecha</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Margen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis?.margin_percent.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Rentabilidad general</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis?.active_projects || 0}</div>
                <p className="text-xs text-muted-foreground">En ejecución (Avance medio: {kpis?.avg_progress}% )</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Flujo de Caja ({granularity})</CardTitle>
              </CardHeader>
              <CardContent className="px-2 pt-0 sm:px-6 sm:pt-6">
                <div className="h-[350px] w-full">
                  {renderPlot(cashFlowFig)}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Estado de Tareas</CardTitle>
              </CardHeader>
              <CardContent className="px-2 pt-0 sm:px-6 sm:pt-6">
                 <div className="h-[350px] w-full">
                  {renderPlot(statusFig)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Desviación de Presupuesto (Top Activos)</CardTitle>
              </CardHeader>
              <CardContent className="px-2 pt-0 sm:px-6 sm:pt-6">
                 <div className="h-[400px] w-full">
                  {renderPlot(budgetFig)}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Portafolio Árbol</CardTitle>
              </CardHeader>
              <CardContent className="px-2 pt-0 sm:px-6 sm:pt-6">
                 <div className="h-[400px] w-full">
                  {renderPlot(resourceFig)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Rentabilidad Mensual</CardTitle>
              </CardHeader>
              <CardContent className="px-2 pt-0 sm:px-6 sm:pt-6">
                 <div className="h-[350px] w-full">
                  {renderPlot(rentabilityFig)}
                </div>
              </CardContent>
            </Card>
             <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Estados de Cotizaciones</CardTitle>
              </CardHeader>
              <CardContent className="px-2 pt-0 sm:px-6 sm:pt-6">
                 <div className="h-[350px] w-full">
                  {renderPlot(quotesStatesFig)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Evolución de Ingresos</CardTitle>
              </CardHeader>
              <CardContent className="px-2 pt-0 sm:px-6 sm:pt-6">
                 <div className="h-[350px] w-full">
                  {renderPlot(incomesTimelineFig)}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Utilidad por Proyecto</CardTitle>
              </CardHeader>
              <CardContent className="px-2 pt-0 sm:px-6 sm:pt-6">
                 <div className="h-[350px] w-full">
                  {renderPlot(utilityProjectFig)}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
