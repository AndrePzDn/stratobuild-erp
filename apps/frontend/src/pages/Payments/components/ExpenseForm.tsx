import { PaymentSchema, type PaymentType } from "../schemas/payment.schema";
import ExpenseFormValues from "./ExpenseFormValues";
import { useAuthStore } from "@/stores/authStore";
import { postEntity } from "@/utils/connections";
import FormTemplate from "@/components/template/FormTemplate";
import { Button } from "@/components/ui/button";

interface Props {
  cashFlowId: string;
  refreshFunction: () => void;
  setOpen: (open: boolean) => void;
}

export default function ExpenseForm({
  cashFlowId,
  refreshFunction,
  setOpen,
}: Props) {
  const { user } = useAuthStore();

  const handleSubmit = async (data: PaymentType) => {
    if (!user) return;

    const res = await postEntity("payment", data, user.token);
    if (res?.data?.success) {
      setOpen(false);
      refreshFunction();
    }
  };

  return (
    <FormTemplate schema={PaymentSchema} onSubmit={handleSubmit}>
      <ExpenseFormValues cashFlowId={cashFlowId} />
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
