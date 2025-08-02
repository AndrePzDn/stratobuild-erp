import MultiSelect from "@/components/ui/multi-select";
import type { VariableConfig, DashboardFilters } from "./types";

interface DashboardFiltersProps {
  variables: VariableConfig[];
  availableFilters: Record<string, string[]>;
  selectedFilters: DashboardFilters;
  onFilterChange: (key: string, values: string[]) => void;
  loading?: boolean;
}

export default function DashboardFilters({
  variables,
  availableFilters,
  selectedFilters,
  onFilterChange,
  loading = false,
}: DashboardFiltersProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {variables.map((variable) => (
          <div key={variable.key} className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {variables.map((variable) => {
        const items = availableFilters[variable.key] || [];
        return (
          <div key={variable.key}>
            <MultiSelect
              items={items.map((item) => ({ label: item, value: item }))}
              checked={selectedFilters[variable.key] || []}
              onCheckedChange={(values) => onFilterChange(variable.key, values)}
              placeholder={variable.displayName}
              className="w-full"
            />
          </div>
        );
      })}
    </section>
  );
}
