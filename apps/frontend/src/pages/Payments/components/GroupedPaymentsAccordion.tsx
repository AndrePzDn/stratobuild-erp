import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Payment } from "@/types";

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

interface Props {
  groupedPayments: Record<string, Record<string, Payment[]>>;
}

export default function GroupedPaymentsAccordion({ groupedPayments }: Props) {
  const renderPaymentsList = (payments: Payment[]) => (
    <ul className="flex flex-col gap-2 bg-muted p-2 rounded">
      {payments.map((payment) => (
        <li
          key={payment._id}
          className="flex justify-between hover:bg-muted/50 text-xs border-b border-secondary last:border-0 pb-2 last:pb-0"
        >
          <span>{payment.description}</span>
          <span>{new Date(payment.date).toLocaleDateString("es-BO")}</span>
          <span className="font-medium">{payment.amount}</span>
        </li>
      ))}
    </ul>
  );

  const years = Object.keys(groupedPayments).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );

  if (years.length === 0) {
    return (
      <p className="text-muted-foreground text-sm p-4">
        No hay registros disponibles.
      </p>
    );
  }

  return (
    <Accordion
      type="multiple"
      className="w-full hover:bg-muted rounded px-4 transition-colors"
    >
      {years.map((year) => (
        <AccordionItem key={year} value={year}>
          <AccordionTrigger className="text-sm font-medium cursor-pointer px-2">
            {year}
          </AccordionTrigger>
          <AccordionContent>
            <Accordion type="multiple" className="w-full">
              {MONTHS.map((month) => {
                const monthPayments = groupedPayments[year][month];
                if (!monthPayments?.length) return null;

                const monthTotal = monthPayments.reduce(
                  (sum, p) => sum + p.amount,
                  0
                );

                return (
                  <AccordionItem
                    key={`${year}-${month}`}
                    value={`${year}-${month}`}
                    className={`hover:bg-secondary rounded transition-colors`}
                  >
                    <AccordionTrigger className="text-xs px-2 cursor-pointer">
                      <div className="flex justify-between w-full">
                        <span>{month}</span>
                        <span className="font-medium">{monthTotal}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-2">
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
}
