import { useEffect, useState, useMemo } from "react";
import { DateRangePicker } from "@/components/ui/date-picker-range";
import DashboardFilters from "./DashboardFilters";
import DashboardPanel from "./DashboardPanel";
import { buildGrafanaUrl, fetchDashboardVariables } from "./utils";
import type {
  DashboardConfig,
  DateRange,
  DashboardFilters as Filters,
  PanelConfig,
} from "./types";

interface PanelWithUrl {
  panel: PanelConfig;
  url: string;
}

interface GrafanaDashboardProps {
  config: DashboardConfig;
  title?: string;
  showDatePicker?: boolean;
  customLayout?: (panels: PanelWithUrl[]) => React.ReactNode;
  className?: string;
  showFilters?: boolean;
  defaultFilters?: Filters;
  externalFilters?: Filters;
  onFiltersChange?: (filters: Filters) => void;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
}

export default function GrafanaDashboard({
  config,
  title = "Dashboard",
  showDatePicker = true,
  showFilters = true,
  customLayout,
  className = "",
  defaultFilters = {},
  externalFilters,
  onFiltersChange,
  dateRange: externalDateRange,
  onDateRangeChange,
}: GrafanaDashboardProps) {
  const [availableFilters, setAvailableFilters] = useState<
    Record<string, string[]>
  >({});
  const [selectedFilters, setSelectedFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(true);
  const [internalDateRange, setInternalDateRange] = useState<DateRange>({
    from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    to: new Date(),
  });

  const currentDateRange = externalDateRange ?? internalDateRange;

  const handleDateRangeChange = (range: DateRange) => {
    if (onDateRangeChange) onDateRangeChange(range);
    setInternalDateRange(range);
  };

  const handleFilterChange = (key: string, values: string[]) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev, [key]: values };
      if (onFiltersChange) onFiltersChange(updated);
      return updated;
    });
  };

  useEffect(() => {
    const loadVariables = async () => {
      if (config.variables.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const filters = await fetchDashboardVariables(config);
        setAvailableFilters(filters);

        const initialSelected: Filters = {};
        config.variables.forEach((variable) => {
          initialSelected[variable.key] = defaultFilters[variable.key] || [];
        });
        setSelectedFilters(initialSelected);
        if (onFiltersChange) onFiltersChange(initialSelected);
      } catch (error) {
        console.error("Error fetching variables:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVariables();
  }, [config, defaultFilters]);

  const panelUrls = useMemo(() => {
    const from = currentDateRange.from.getTime();
    const to = currentDateRange.to.getTime();
    const activeFilters = externalFilters ?? selectedFilters;

    return config.panels.map((panel) => ({
      panel,
      url: buildGrafanaUrl(config, panel.id, activeFilters, from, to),
    }));
  }, [selectedFilters, externalFilters, currentDateRange, config]);

  const renderDefaultLayout = () => (
    <section className="space-y-6">
      {panelUrls.map(({ panel, url }) => (
        <DashboardPanel key={`panel-${panel.id}`} panel={{ ...panel, url }} />
      ))}
    </section>
  );

  return (
    <div className={`space-y-8 ${className}`}>
      <nav className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{title}</h1>
        {showDatePicker && (
          <DateRangePicker date={currentDateRange} setDate={handleDateRangeChange} />
        )}
      </nav>

      {config.variables.length > 0 && showFilters && (
        <DashboardFilters
          variables={config.variables}
          availableFilters={availableFilters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          loading={loading}
        />
      )}

      {loading && config.variables.length > 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando variables...</div>
        </div>
      ) : customLayout ? (
        customLayout(panelUrls)
      ) : (
        renderDefaultLayout()
      )}
    </div>
  );
}
