import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface Props {
  children: ReactNode;
  id?: string;
  buttonLabel?: string;
  title: string;
  buttonIcon?: ReactNode;
  open: boolean;
  handleOpen: () => void;
  size?: "default" | "sm" | "lg" | "xl";
  trigger?: boolean;
}

export default function DialogTemplate({
  children,
  buttonLabel: label,
  title,
  buttonIcon,
  open = false,
  handleOpen = () => {},
  size = "default",
  trigger = true,
}: Props) {
  const sm = "";
  const lg = "min-w-2/3 max-w-2/3 max-h-5/6 overflow-auto";
  const xl = "";

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      {trigger && (
        <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 cursor-pointer">
          {buttonIcon && buttonIcon}
          {label}
        </DialogTrigger>
      )}
      <DialogContent
        className={`${size === "sm" ? sm : size === "lg" ? lg : size === "xl" ? xl : ""}`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
