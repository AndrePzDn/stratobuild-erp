import FormDialog from "@/pages/Client/components/FormDialog";
import { useState } from "react";
import { PaymentSchema, type PaymentType } from "../schemas/payment.schema";
import IncomeFieldValues from "./IncomeFieldValues";
import { useAuthStore } from "@/stores/authStore";
import { postEntity } from "@/utils/connections";
import { Plus } from "lucide-react";

interface Props {
  cashflowId: string;
  refreshFunction: () => void;
}

export default function PaymentForm({ cashflowId, refreshFunction }: Props) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (data: PaymentType) => {
    if (!user) return;
    const res = await postEntity("payment", data, user.token);
    if (res?.data?.success) {
      setDialogOpen(false);
      refreshFunction();
    }
  };

  return (
    <FormDialog
      title="Agregar Ingreso"
      schema={PaymentSchema}
      buttonLabel=""
      buttonIcon={<Plus />}
      open={isDialogOpen}
      handleOpen={() => setDialogOpen((prev) => !prev)}
      onSubmit={handleSubmit}
    >
      <IncomeFieldValues cashFlowId={cashflowId} />
    </FormDialog>
  );
}
