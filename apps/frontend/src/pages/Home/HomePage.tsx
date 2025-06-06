import { useEffect, useState, useMemo } from "react";
import MultiSelect from "@/components/ui/multi-select";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-picker-range";

interface DashboardConfig {
  grafanaBase: string;
  dashboardUid: string;
  dashboardPath: string;
  folderUid: string;
  orgId: string;
  panels: PanelConfig[];
  variables: VariableConfig[];
}

interface PanelConfig {
  id: number;
  title?: string;
  height?: number;
}

interface VariableConfig {
  key: string;
  displayName: string;
  query: string;
  datasourceId: number;
}

type DateRange = {
  from: Date;
  to: Date;
};

const DASHBOARD_CONFIG: DashboardConfig = {
  grafanaBase: "http://localhost:5000",
  dashboardUid: "beop9bu7wjif4f",
  dashboardPath: "new-dashboard",
  folderUid: "deop8ql9hgni8e",
  orgId: "1",
  panels: [
    { id: 4, title: "Panel 4", height: 300 },
    { id: 2, title: "Panel 2", height: 300 },
    { id: 10, title: "Panel 10", height: 300 },
    { id: 13, title: "Panel 13", height: 300 },
    { id: 12, title: "Panel 12", height: 300 },
  ],
  variables: [
    {
      key: "Proyecto",
      displayName: "Proyecto",
      query:
        "SELECT DISTINCT project_name FROM dim_project ORDER BY project_name",
      datasourceId: 1,
    },
  ],
};

const buildGrafanaUrl = (
  config: DashboardConfig,
  panelId: number,
  activeFilters: Record<string, string[]>,
  from: number,
  to: number,
) => {
  const params = new URLSearchParams({
    orgId: config.orgId,
    folderUid: config.folderUid,
    from: from.toString(),
    to: to.toString(),
    timezone: "browser",
    theme: "light",
    panelId: panelId.toString(),
    __feature: "dashboardSceneSolo",
  });

  Object.entries(activeFilters).forEach(([key, values]) => {
    if (values && values.length > 0) {
      values.forEach((val) => {
        params.append(`var-${key}`, val);
      });
    }
  });

  const url = `${config.grafanaBase}/d-solo/${config.dashboardUid}/${config.dashboardPath}?${params.toString()}`;
  console.log("Grafana URL:", url);
  return url;
};

export default function HomePage() {
  const [availableFilters, setAvailableFilters] = useState<
    Record<string, string[]>
  >({});
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    to: new Date(),
  });

  const handleFilterChange = (key: string, values: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  const fetchVariables = async () => {
    setLoading(true);
    try {
      const filterPromises = DASHBOARD_CONFIG.variables.map(
        async (variable) => {
          const response = await fetch("/api/ds/query", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              queries: [
                {
                  queryType: "table",
                  rawSql: variable.query,
                  datasourceId: variable.datasourceId,
                  hideFromInspector: false,
                },
              ],
            }),
          });

          const data = await response.json();
          const values = data.results.A.frames[0].data.values.flat();

          return {
            key: variable.key,
            values: values,
          };
        },
      );

      const results = await Promise.all(filterPromises);
      const newFilters: Record<string, string[]> = {};

      results.forEach(({ key, values }) => {
        newFilters[key] = values;
      });

      setAvailableFilters(newFilters);

      const initialSelected: Record<string, string[]> = {};
      DASHBOARD_CONFIG.variables.forEach((variable) => {
        initialSelected[variable.key] = [];
      });
      setSelectedFilters(initialSelected);
    } catch (error) {
      console.error("Error fetching variables:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariables();
  }, []);

  const panelUrls = useMemo(() => {
    const from = dateRange.from.getTime();
    const to = dateRange.to.getTime();

    return DASHBOARD_CONFIG.panels.map((panel) => ({
      ...panel,
      url: buildGrafanaUrl(
        DASHBOARD_CONFIG,
        panel.id,
        selectedFilters,
        from,
        to,
      ),
    }));
  }, [selectedFilters, dateRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando variables...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <nav className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard de Proyectos</h1>
        <DateRangePicker date={dateRange} setDate={setDateRange} />
      </nav>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DASHBOARD_CONFIG.variables.map((variable) => {
          const items = availableFilters[variable.key] || [];
          return (
            <div key={variable.key}>
              <MultiSelect
                items={items.map((item) => ({ label: item, value: item }))}
                checked={selectedFilters[variable.key] || []}
                onCheckedChange={(values) =>
                  handleFilterChange(variable.key, values)
                }
                placeholder={variable.displayName}
                className="w-full"
              />
            </div>
          );
        })}
      </section>

      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {panelUrls
            .filter((p) => p.id === 12 || p.id === 13)
            .map((panel) => (
              <Card key={`panel-${panel.id}`}>
                <CardContent>
                  <iframe
                    src={panel.url}
                    width="100%"
                    height={panel.height || 300}
                    style={{ border: "none" }}
                    title={`Grafana Panel ${panel.id}`}
                  />
                </CardContent>
              </Card>
            ))}
        </div>
        {panelUrls
          .filter((p) => p.id !== 12 && p.id !== 13)
          .map((panel) => (
            <Card key={`panel-${panel.id}`}>
              <CardContent>
                <iframe
                  src={panel.url}
                  width="100%"
                  height={panel.height || 300}
                  style={{ border: "none" }}
                  title={`Grafana Panel ${panel.id}`}
                />
              </CardContent>
            </Card>
          ))}
      </section>
    </div>
  );
}
