import FormTemplate from "@/components/template/FormTemplate";
import {
  PaymentResourceSchema,
  type PaymentResourceType,
} from "../schemas/payment.schema";
import ResourceExpenseFormValues from "./ResourceExpenseFormValues";
import { Button } from "@/components/ui/button";
import { postEntity } from "@/utils/connections";
import { useAuthStore } from "@/stores/authStore";

interface Props {
  setOpen: (open: boolean) => void;
  refreshFunction: () => void;
  cashFlowId: string;
}

export default function ResourceExpenseForm({
  setOpen,
  refreshFunction,
  cashFlowId,
}: Props) {
  const { user } = useAuthStore();

  const handleSubmit = async (data: PaymentResourceType) => {
    if (!user) return;

    await postEntity("payment", data, user.token);
    refreshFunction();
    setOpen(false);
  };

  return (
    <FormTemplate schema={PaymentResourceSchema} onSubmit={handleSubmit}>
      <ResourceExpenseFormValues cashFlowId={cashFlowId} />
      <footer className="w-full flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpen(false)}
        >
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </footer>
    </FormTemplate>
  );
}
