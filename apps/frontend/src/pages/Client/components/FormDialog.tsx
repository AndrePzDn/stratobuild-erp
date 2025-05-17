import DialogTemplate from "@/components/template/DialogTemplate";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import type z from "zod";
import type { ReactNode } from "react";
import FormTemplate from "@/components/template/FormTemplate";

interface Props<T extends z.ZodTypeAny> {
  schema: T;
  children: ReactNode;
  buttonLabel?: string;
  title: string;
  buttonIcon?: ReactNode;
  initialData?: z.infer<T>;
  onSubmit?: (data: z.infer<T>) => void;
  open: boolean;
  handleOpen: () => void;
  size?: "default" | "sm" | "lg" | "xl";
  trigger?: boolean;
}

export default function FormDialog<T extends z.ZodTypeAny>({
  schema,
  children,
  buttonLabel,
  title,
  buttonIcon,
  onSubmit,
  initialData = undefined,
  open = false,
  handleOpen = () => {},
  size = "default",
  trigger = true,
}: Props<T>) {
  return (
    <DialogTemplate
      buttonLabel={buttonLabel}
      title={title}
      buttonIcon={buttonIcon}
      open={open}
      handleOpen={handleOpen}
      size={size}
      trigger={trigger}
    >
      <FormTemplate schema={schema} data={initialData} onSubmit={onSubmit}>
        {children}
      </FormTemplate>
      <DialogFooter>
        <DialogClose className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 h-9 px-4 py-2 has-[>svg]:px-3 cursor-pointer">
          Cancelar
        </DialogClose>
        <Button type="submit" form={`${schema.toString()}-form`}>
          Guardar
        </Button>
      </DialogFooter>
    </DialogTemplate>
  );
}
