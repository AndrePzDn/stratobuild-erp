import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import GroupedPaymentsAccordion from "./GroupedPaymentsAccordion";
import type { Payment } from "@/types";
import type { ReactNode } from "react";

interface Props {
  title: string;
  payments: Payment[];
  groupedPayments: Record<string, Record<string, Payment[]>>;
  form: ReactNode;
}

export default function PaymentsSection({
  title,
  payments,
  groupedPayments,
  form,
}: Props) {
  const total = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Card className="flex-1">
      <CardHeader>
        <header className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          {form}
        </header>
        <CardDescription>
          {payments.length
            ? `Total de ${title}: ${total}`
            : `No hay ${title.toLowerCase()} registrados.`}
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
          <GroupedPaymentsAccordion groupedPayments={groupedPayments} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
