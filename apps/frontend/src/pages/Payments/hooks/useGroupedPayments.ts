import type { Payment } from "@/types";
import { useMemo } from "react";

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

export function useGroupedPayments(payments: Payment[]) {
  return useMemo(() => {
    const grouped: Record<string, Record<string, Payment[]>> = {};

    payments.forEach((payment) => {
      const date = new Date(payment.date);
      const year = date.getFullYear().toString();
      const monthName = MONTHS[date.getMonth()];

      if (!grouped[year]) grouped[year] = {};
      if (!grouped[year][monthName]) grouped[year][monthName] = [];

      grouped[year][monthName].push(payment);
    });

    return grouped;
  }, [payments]);
}
