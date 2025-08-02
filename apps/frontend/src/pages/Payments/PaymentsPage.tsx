import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useFetchData from "@/hooks/useFetchEntityData";
import PaymentsSection from "./components/PaymentsSection";
import type { CashFlow, Payment, Project } from "@/types";
import { useGroupedPayments } from "./hooks/useGroupedPayments";
import IncomeForm from "./components/IncomeForm";
import SelectableFormDialogTemplate from "@/components/template/SelectableFormDialogTemplate";
import type { SelectableForm } from "@/components/template/SelectableFormTemplate";
import { Plus } from "lucide-react";
import ExpenseForm from "./components/ExpenseForm";
import ResourceExpenseForm from "./components/ResourceExpenseForm";
import { GrafanaDashboard, type DashboardConfig } from "@/components/dashboard";

export default function PaymentsPage() {
  const { id } = useParams();
  const [cashFlowId, setCashFlowId] = useState<string>("");

  const { data: allPayments, refetch: refetchPayments } =
    useFetchData<Payment>("payment");
  const { data: cashFlows } = useFetchData<CashFlow>("cashFlow");
  const { data: projects } = useFetchData<Project>("project", id);

  const project = useMemo(() => {
    return Array.isArray(projects) ? projects.find(p => p._id === id) : projects;
  }, [projects, id]);

  const paymentsForProject = useMemo(() => {
    return allPayments?.filter((p) => p.cashFlow.project._id === id) ?? [];
  }, [allPayments, id]);

  const incomePayments = useMemo(
    () => paymentsForProject.filter((p) => p.paymentType === "income"),
    [paymentsForProject]
  );

  const expensePayments = useMemo(
    () => paymentsForProject.filter((p) => p.paymentType === "expense"),
    [paymentsForProject]
  );

  useEffect(() => {
    if (!cashFlows || !id) return;
    const cashFlow = cashFlows.find((cf) => cf.project._id === id);
    if (cashFlow) setCashFlowId(cashFlow._id);
  }, [cashFlows, id]);

  const [open, setOpen] = useState(false);

  const dashboardConfig: DashboardConfig = {
    grafanaBase: "http://localhost",
    dashboardUid: "beop9bu7wjif4f",
    dashboardPath: "new-dashboard",
    folderUid: "",
    orgId: "1",
    panels: [
      { id: 10, title: "Análisis de Pagos", height: 400 },
    ],
    variables: [
      {
        key: "Proyecto",
        displayName: "Proyecto",
        query: "SELECT DISTINCT project_name FROM dim_project ORDER BY project_name",
        datasourceId: 1,
      },
    ],
  };

  const forms: SelectableForm[] = [
    {
      forms: (
        <ExpenseForm
          cashFlowId={cashFlowId}
          refreshFunction={refetchPayments}
          setOpen={setOpen}
        />
      ),
      formsLabels: "Gasto Corriente",
    },
    {
      forms: (
        <ResourceExpenseForm
          cashFlowId={cashFlowId}
          refreshFunction={refetchPayments}
          setOpen={setOpen}
        />
      ),
      formsLabels: "Gasto de Inventario",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Flujo de Caja de {project?.name || ""}
        </h1>
      </header>

      <section className="flex gap-4 w-full">
        <PaymentsSection
          title="Ingresos"
          payments={incomePayments}
          groupedPayments={useGroupedPayments(incomePayments)}
          form={
            <IncomeForm
              cashflowId={cashFlowId}
              refreshFunction={refetchPayments}
            />
          }
        />
        <PaymentsSection
          title="Gastos"
          payments={expensePayments}
          groupedPayments={useGroupedPayments(expensePayments)}
          form={
            <SelectableFormDialogTemplate
              title="Agregar Gasto"
              selectableForms={forms}
              open={open}
              setOpen={setOpen}
              buttonLabel=""
              buttonIcon={<Plus />}
            />
          }
        />
      </section>
      <section>
        <GrafanaDashboard
          config={dashboardConfig}
          title="Análisis de Pagos del Proyecto"
          showDatePicker={true}
          showFilters={false}
          defaultFilters={{
            Proyecto: project?.name ? [project.name] : [],
          }}
        />
      </section>
    </div>
  );
}
