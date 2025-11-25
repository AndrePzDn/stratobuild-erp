import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { Card, CardContent } from "@/components/ui/card";

interface ProjectGanttProps {
  projectName?: string;
}

export default function ProjectGantt({ projectName = "" }: ProjectGanttProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fig, setFig] = useState<any | null>(null);

  useEffect(() => {
    if (!projectName) {
      setFig(null);
      return;
    }

    const hosts = [
      "http://host.docker.internal:8000",
      "http://172.17.0.1:8000",
      "http://localhost:8000",
    ];

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      for (const host of hosts) {
        try {
          // find project id by name
          const searchUrl = `${host}/api/dashboard/project-search?name=${encodeURIComponent(
            projectName
          )}`;
          const sres = await fetch(searchUrl, { mode: "cors" });
          if (!sres.ok) continue;
          const projects = await sres.json();
          if (!projects || projects.length === 0) {
            setError("Proyecto no encontrado");
            setLoading(false);
            return;
          }
          const pid = projects[0].project_id;
          const url = `${host}/api/dashboard/gantt/${encodeURIComponent(pid)}`;
          const res = await fetch(url, { mode: "cors" });
          if (!res.ok) continue;
          const data = await res.json();
          if (cancelled) return;
          setFig(data);
          setLoading(false);
          return;
        } catch (e) {
          // try next host
        }
      }
      if (!cancelled) {
        setError("No se pudo cargar el Gantt");
        setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [projectName]);

  if (!projectName) return null;

  return (
    <section className="mt-6">
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">Cronograma del Proyecto</h2>
          {loading ? (
            <div>Cargando Gantt...</div>
          ) : error ? (
            <div className="text-sm text-muted-foreground">{error}</div>
          ) : fig ? (
            // fig is expected to have { data, layout }
            <Plot
              data={fig.data}
              layout={{ ...fig.layout, autosize: true }}
              style={{ width: "100%", height: 480 }}
              useResizeHandler={true}
            />
          ) : (
            <div>No hay datos de Gantt</div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
