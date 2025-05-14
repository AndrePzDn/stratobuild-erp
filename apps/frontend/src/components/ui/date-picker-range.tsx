import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

type DateRange = {
  from: Date;
  to: Date;
};

type Props = {
  date: DateRange;
  setDate: (range: DateRange) => void;
};

export function DateRangePicker({ date, setDate }: Props) {
  const [calendarRange, setCalendarRange] = useState<DateRange | undefined>(
    date,
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className={cn(
            "w-[300px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                {format(date.to, "LLL dd, y", { locale: es })}
              </>
            ) : (
              format(date.from, "LLL dd, y", { locale: es })
            )
          ) : (
            <span className="text-muted-foreground">Selecciona un rango</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={calendarRange?.from}
          selected={calendarRange}
          onSelect={(range: any) => setCalendarRange(range)}
          numberOfMonths={2}
          locale={es}
        />
        <Button
          className="mt-2 w-full"
          onClick={() => {
            if (calendarRange?.from && calendarRange?.to) {
              setDate(calendarRange);
            }
          }}
        >
          OK
        </Button>
      </PopoverContent>
    </Popover>
  );
}
