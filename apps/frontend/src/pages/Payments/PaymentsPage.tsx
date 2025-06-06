import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useFetchData from "@/hooks/useFetchEntityData";
import { useAuthStore } from "@/stores/authStore";
import { postEntity } from "@/utils/connections";
import FormDialog from "../Client/components/FormDialog";
import PaymentFieldValues from "./components/PaymentForm";
import { PaymentSchema, type PaymentType } from "./schemas/payment.schema";
import type { CashFlow, Payment, Project } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function PaymentsPage() {
  const { id } = useParams();
  const { user } = useAuthStore();

  const [cashFlowId, setCashFlowId] = useState<string>("");
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  const { data: allPayments, refetch: refetchPayments } =
    useFetchData<Payment>("payment");
  const { data: cashFlows } = useFetchData<CashFlow>("cashFlow");
  const { data: project } = useFetchData<Project>("project", id);

  const paymentsForProject = useMemo(() => {
    if (!allPayments || !id) return [];
    return allPayments
      .filter((payment) => payment.cashFlow.project._id === id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allPayments, id]);

  const incomePayments = useMemo(
    () => paymentsForProject.filter((p) => p.paymentType === "income"),
    [paymentsForProject],
  );

  const expensePayments = useMemo(
    () => paymentsForProject.filter((p) => p.paymentType === "expense"),
    [paymentsForProject],
  );

  const groupPaymentsByMonthYear = useMemo(() => {
    return (payments: Payment[]) => {
      const grouped: Record<string, Record<string, Payment[]>> = {};

      payments.forEach((payment) => {
        const date = new Date(payment.date);
        const year = date.getFullYear().toString();
        const month = date.getMonth(); // 0-11
        const monthName = MONTHS[month];

        if (!grouped[year]) {
          grouped[year] = {};
        }

        if (!grouped[year][monthName]) {
          grouped[year][monthName] = [];
        }

        grouped[year][monthName].push(payment);
      });

      return grouped;
    };
  }, []);

  const groupedIncomePayments = useMemo(
    () => groupPaymentsByMonthYear(incomePayments),
    [incomePayments, groupPaymentsByMonthYear],
  );

  const groupedExpensePayments = useMemo(
    () => groupPaymentsByMonthYear(expensePayments),
    [expensePayments, groupPaymentsByMonthYear],
  );

  useEffect(() => {
    if (cashFlows && id) {
      const cashFlow = cashFlows.find((cf) => cf.project._id === id);
      if (cashFlow) setCashFlowId(cashFlow._id);
    }
  }, [cashFlows, id]);

  const handleSubmit = async (data: PaymentType) => {
    if (!user) return;
    const res = await postEntity("payment", data, user.token);
    if (res?.data?.success) {
      setDialogOpen(false);
      refetchPayments(); // Refresh the payments list
    }
  };

  const renderPaymentsList = (payments: Payment[]) => (
    <ul className="flex flex-col gap-1">
      {payments.map((payment) => (
        <li
          key={payment._id}
          className="flex justify-between hover:bg-muted/50 p-4 rounded text-xs"
        >
          <span>{payment.description}</span>
          <span className="font-medium">{payment.amount}</span>
        </li>
      ))}
    </ul>
  );

  const renderGroupedPayments = (
    groupedPayments: Record<string, Record<string, Payment[]>>,
  ) => {
    const years = Object.keys(groupedPayments).sort(
      (a, b) => parseInt(b) - parseInt(a),
    );

    if (years.length === 0) {
      return (
        <p className="text-muted-foreground text-sm p-4">
          No hay registros disponibles.
        </p>
      );
    }

    return (
      <Accordion type="multiple" className="w-full">
        {years.map((year) => (
          <AccordionItem key={year} value={year}>
            <AccordionTrigger className="text-sm font-medium">
              {year}
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="multiple" className="w-full">
                {MONTHS.map((month) => {
                  const monthPayments = groupedPayments[year][month];
                  if (!monthPayments || monthPayments.length === 0) return null;

                  const monthTotal = monthPayments.reduce(
                    (sum, p) => sum + p.amount,
                    0,
                  );

                  return (
                    <AccordionItem
                      key={`${year}-${month}`}
                      value={`${year}-${month}`}
                    >
                      <AccordionTrigger className="text-xs hover:bg-muted px-2">
                        <div className="flex justify-between w-full pr-2">
                          <span>{month}</span>
                          <span className="font-medium">{monthTotal}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {renderPaymentsList(monthPayments)}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-bold">
          {`Flujo de Caja de ${project.name || ""}`}
        </h1>
        <FormDialog
          title="Agregar Pago"
          schema={PaymentSchema}
          buttonLabel="Agregar Pago"
          open={isDialogOpen}
          handleOpen={() => setDialogOpen((prev) => !prev)}
          onSubmit={handleSubmit}
        >
          <PaymentFieldValues cashFlowId={cashFlowId} />
        </FormDialog>
      </header>

      <section className="flex gap-4 w-full">
        <Card className="flex-1">
          <CardHeader>
            <h2 className="text-lg font-semibold">Gastos</h2>
            <CardDescription>
              {expensePayments.length
                ? `Total de Gastos: ${expensePayments.reduce(
                    (sum, p) => sum + p.amount,
                    0,
                  )}`
                : "No hay gastos registrados."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <ul className="flex flex-col gap-2">
              <li className="flex justify-between font-semibold">
                <span>Descripción</span>
                <span>Monto</span>
              </li>
              <Separator />
            </ul>
            <ScrollArea className="h-64 pr-2">
              {renderGroupedPayments(groupedExpensePayments)}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <h2 className="text-lg font-semibold">Pagos</h2>
            <CardDescription>
              {incomePayments.length
                ? `Total de Pagos: ${incomePayments.reduce(
                    (sum, p) => sum + p.amount,
                    0,
                  )}`
                : "No hay pagos registrados."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <ul className="flex flex-col gap-2">
              <li className="flex justify-between font-semibold">
                <span>Descripción</span>
                <span>Monto</span>
              </li>
              <Separator />
            </ul>
            <ScrollArea className="h-64 pr-2">
              {renderGroupedPayments(groupedIncomePayments)}
            </ScrollArea>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
