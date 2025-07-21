import type { ReactNode } from "react";
import DialogTemplate from "./DialogTemplate";
import type { SelectableForm } from "./SelectableFormTemplate";
import SelectableFormTemplate from "./SelectableFormTemplate";

interface Props {
  selectableForms: SelectableForm[];
  title: string;
  buttonLabel: string;
  buttonIcon?: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function SelectableFormDialogTemplate({
  selectableForms,
  title,
  buttonLabel,
  buttonIcon,
  open,
  setOpen,
}: Props) {
  return (
    <DialogTemplate
      title={title}
      buttonLabel={buttonLabel}
      buttonIcon={buttonIcon}
      open={open}
      handleOpen={() => setOpen(!open)}
    >
      <SelectableFormTemplate selectableForms={selectableForms} />
    </DialogTemplate>
  );
}
