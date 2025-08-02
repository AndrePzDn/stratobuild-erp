import { Card, CardContent } from "@/components/ui/card";
import type { PanelConfig } from "./types";

interface DashboardPanelProps {
  panel: PanelConfig & { url: string };
}

export default function DashboardPanel({ panel }: DashboardPanelProps) {
  return (
    <Card>
      <CardContent>
        <iframe
          src={panel.url}
          width="100%"
          height={panel.height || 300}
          style={{ border: "none" }}
          title={panel.title || `Grafana Panel ${panel.id}`}
        />
      </CardContent>
    </Card>
  );
}
