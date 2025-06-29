import { z } from "zod";

const RolesEnum = [
  "Admin",
  "ProjectManager",
  "SiteSupervisor",
  "Accountant",
  "InventoryManager",
  "GeneralDirector",
] as const;

export const UserSchema = z.object({
  email: z
    .string({ message: "El correo electronico es requerido" })
    .email({ message: "El correo electronico debe ser valido" }),
  name: z
    .string({ message: "El nombre es requerido" })
    .min(1, "El nombre es requerido"),
  surname: z
    .string({ message: "El apellido es requerido" })
    .min(1, "El apellido es requerido"),
  role: z.enum(RolesEnum, { required_error: "El rol es requerido" }),
  photo: z.any().optional().nullable(),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
