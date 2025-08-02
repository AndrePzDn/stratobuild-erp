export interface DashboardConfig {
  grafanaBase: string;
  dashboardUid: string;
  dashboardPath: string;
  folderUid: string;
  orgId: string;
  panels: PanelConfig[];
  variables: VariableConfig[];
}

export interface PanelConfig {
  id: number;
  title?: string;
  height?: number;
}

export interface VariableConfig {
  key: string;
  displayName: string;
  query: string;
  datasourceId: number;
}

export type DateRange = {
  from: Date;
  to: Date;
};

export interface DashboardFilters {
  [key: string]: string[];
}
