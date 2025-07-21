import { useState, type ReactNode } from "react";

export interface SelectableForm {
  forms: ReactNode;
  formsLabels: string;
}

interface Props {
  selectableForms: SelectableForm[];
}

export default function SelectableFormTemplate({ selectableForms }: Props) {
  const [selectedForm, setSelectedForm] = useState<number>(1);

  return (
    <div className="flex flex-col gap-4 w-full items-center justify-center">
      <section className={`flex w-full`}>
        {selectableForms.map((form, index) => (
          <button
            type="button"
            className={`w-full text-sm text-center py-1 hover:bg-secondary hover:text-secondary-foreground first:rounded-l-md last:rounded-r-md transition-colors not-first:border-l not-first:border-secondary cursor-pointer ${
              selectedForm === index + 1
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
            onClick={() => setSelectedForm(index + 1)}
            key={index}
            aria-label={form.formsLabels}
            title={form.formsLabels}
          >
            {form.formsLabels}
          </button>
        ))}
      </section>
      {selectableForms[selectedForm - 1].forms}
    </div>
  );
}
