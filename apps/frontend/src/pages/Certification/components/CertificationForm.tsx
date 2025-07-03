import FormDialog from "@/pages/Client/components/FormDialog";
import CertificationFormValues from "./CertificationFormValues";
import {
  CertificationSchema,
  type CertificationSchemaValues,
} from "../schemas/certification.schema";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "react-toastify";
import { postEntity } from "@/utils/connections";
import { uploadFile } from "@/utils/cloudinary";
import { useParams } from "react-router-dom";

interface Props {
  refreshData: () => void;
}

export default function CertificationForm({ refreshData }: Props) {
  const { id } = useParams<{ id: string }>();
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const { user } = useAuthStore();

  const handleOnSubmit = async (values: CertificationSchemaValues) => {
    if (!user) return;

    console.log("Submitting certification:", values);
    toast.promise(
      async () => {
        const url = await uploadFile(values.certificationUrl, id);
        postEntity(
          "certification",
          { ...values, certificationUrl: url },
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
      title="Agregar Certificación"
      buttonLabel="Agregar Certificación"
      schema={CertificationSchema}
      buttonIcon={<Plus />}
      open={openCreateDialog}
      handleOpen={() => setOpenCreateDialog(!openCreateDialog)}
      onSubmit={handleOnSubmit}
    >
      <CertificationFormValues />
    </FormDialog>
  );
}
