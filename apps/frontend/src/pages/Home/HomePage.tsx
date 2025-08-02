import { GrafanaDashboard, type DashboardConfig, type PanelConfig } from "@/components/dashboard";
import { Card, CardContent } from "@/components/ui/card";

const DASHBOARD_CONFIG: DashboardConfig = {
  grafanaBase: "http://localhost",
  dashboardUid: "beop9bu7wjif4f",
  dashboardPath: "new-dashboard",
  folderUid: "", // Vacío para evitar problemas
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

export default function HomePage() {
  const customLayout = (panelUrls: Array<{ panel: PanelConfig; url: string }>) => (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {panelUrls
          .filter((p) => p.panel.id === 12 || p.panel.id === 13)
          .map(({ panel, url }) => (
            <Card key={`panel-${panel.id}`}>
              <CardContent>
                <iframe
                  src={url}
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
        .filter((p) => p.panel.id !== 12 && p.panel.id !== 13)
        .map(({ panel, url }) => (
          <Card key={`panel-${panel.id}`}>
            <CardContent>
              <iframe
                src={url}
                width="100%"
                height={panel.height || 300}
                style={{ border: "none" }}
                title={`Grafana Panel ${panel.id}`}
              />
            </CardContent>
          </Card>
        ))}
    </section>
  );

  return (
    <GrafanaDashboard
      config={DASHBOARD_CONFIG}
      title="Dashboard de Proyectos"
      customLayout={customLayout}
      defaultFilters={{Proyecto: []}}
    />
  );
}
