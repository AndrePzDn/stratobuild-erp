import { z } from "zod";

export const CertificationSchema = z.object({
  name: z
    .string({
      message: "El nombre es obligatorio",
      required_error: "El nombre es obligatorio",
    })
    .min(1, "El nombre es obligatorio"),
  description: z
    .string({
      message: "La descripción es obligatoria",
      required_error: "La descripción es obligatoria",
    })
    .min(1, "La descripción es obligatoria"),
  certificationType: z
    .string({
      message: "El tipo de certificación es obligatorio",
      required_error: "El tipo de certificación es obligatorio",
    })
    .min(1, "El tipo de certificación es obligatorio"),
  certificationUrl: z.any(),
  project: z.string().min(1, "El ID del proyecto es obligatorio"),
});

export type CertificationSchemaValues = z.infer<typeof CertificationSchema>;
