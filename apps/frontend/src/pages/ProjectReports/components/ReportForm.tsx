import FormDialog from "@/pages/Client/components/FormDialog";
import {
  ReportsSchema,
  type ReportsSchemaType,
} from "@/pages/Planning/schemas/planning.schema";
import { useAuthStore } from "@/stores/authStore";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ReportFormValues from "./ReportFormValues";
import { postEntity } from "@/utils/connections";
import { toast } from "react-toastify";
import { uploadFile } from "@/utils/cloudinary";

interface Props {
  refreshData: () => void;
}

export default function ReportForm({ refreshData }: Props) {
  const { id } = useParams<{ id: string }>();
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const { user } = useAuthStore();

  const handleOnSubmit = async (values: ReportsSchemaType) => {
    if (!user || !id) return;

    toast.promise(
      async () => {
        const url = await uploadFile(values.imageUrl, id);
        if (!url) return;

        await postEntity(
          "ConstructionReport",
          {
            ...values,
            imageUrl: url,
          },
          user.token
        );
        setOpenCreateDialog(false);
        refreshData();
      },
      {
        pending: "Subiendo archivo...",
        success: "Archivo subido correctamente",
        error: "Error al subir el archivo",
      }
    );
  };

  return (
    <FormDialog
      title="Agregar Reporte"
      buttonLabel="Agregar Reporte"
      schema={ReportsSchema}
      buttonIcon={<Plus />}
      open={openCreateDialog}
      handleOpen={() => setOpenCreateDialog(!openCreateDialog)}
      onSubmit={handleOnSubmit}
    >
      <ReportFormValues />
    </FormDialog>
  );
}
