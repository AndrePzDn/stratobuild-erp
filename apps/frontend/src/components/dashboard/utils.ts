import type { DashboardConfig, DashboardFilters } from "./types";

export const buildGrafanaUrl = (
  config: DashboardConfig,
  panelId: number,
  activeFilters: DashboardFilters,
  from: number,
  to: number,
): string => {
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

export const fetchDashboardVariables = async (
  config: DashboardConfig,
): Promise<Record<string, string[]>> => {
  const filterPromises = config.variables.map(async (variable) => {
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
  });

  const results = await Promise.all(filterPromises);
  const filters: Record<string, string[]> = {};

  results.forEach(({ key, values }) => {
    filters[key] = values;
  });

  return filters;
};
