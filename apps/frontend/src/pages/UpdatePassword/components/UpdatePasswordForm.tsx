import FormTemplate from "@/components/template/FormTemplate";
import UpdatePasswordFormFields from "./UpdatePasswordFormFields";
import {
  UpdatePasswordSchema,
  type UpdatePasswordSchemaType,
} from "../schemas/updatePassword.schema";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { updatePassword } from "@/utils/connections";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UpdatePasswordForm() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/login");
    logout();
  };

  const handleOnSubmit = async (data: UpdatePasswordSchemaType) => {
    if (!user || !user.token) return;
    const res = await updatePassword(user.token, data);

    if (res.status === 200) {
      navigate("/login");
      toast.success("Contraseña actualizada correctamente");
      logout();
    } else {
      console.error("Error updating password:", res.data);
    }
  };

  return (
    <FormTemplate schema={UpdatePasswordSchema} onSubmit={handleOnSubmit}>
      <UpdatePasswordFormFields />
      <div className="grid grid-cols-2 gap-4 w-full">
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={handleBack}
        >
          Volver
        </Button>
        <Button type="submit" className="w-full">
          Actualizar Contraseña
        </Button>
      </div>
    </FormTemplate>
  );
}
