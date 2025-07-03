import { useFormContext } from "react-hook-form";
import type { CertificationSchemaValues } from "../schemas/certification.schema";
import { InputFormField } from "@/components/ui/input-form-field";
import FileFormField from "@/components/ui/file-form-field";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function CertificationFormValues() {
  const { control, setValue } = useFormContext<CertificationSchemaValues>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) setValue("project", id);
  }, [id, setValue]);

  return (
    <div className="flex flex-col">
      <InputFormField
        control={control}
        name="name"
        label="Nombre de la Certificación"
        placeholder="Ingrese el nombre de la certificación"
      />
      <InputFormField
        control={control}
        name="description"
        label="Descripción"
        placeholder="Ingrese una descripción de la certificación"
      />
      <InputFormField
        control={control}
        name="certificationType"
        label="Tipo de Certificación"
        placeholder="Ingrese el tipo de certificación"
      />
      <FileFormField
        control={control}
        label="Archivo de Certificación"
        name="certificationUrl"
      />
    </div>
  );
}
