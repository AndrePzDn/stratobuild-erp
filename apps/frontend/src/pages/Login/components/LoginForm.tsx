import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginFormValues } from "@/schemas/Login.schema";
import { useForm, type FieldError, type FieldErrors } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/utils/connections";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { InputFormField } from "@/components/ui/input-form-field";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { CheckboxFormField } from "@/components/ui/checkbox-form-field";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await loginUser(data);
      login(res.data.result);
      navigate("/home");
      toast.success("Se inició sesión correctamente");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Error al iniciar sesión. Por favor, intente nuevamente.");
    }
  };

  const handleFormValidation = (
    error: FieldErrors<Partial<LoginFormValues>>
  ) => {
    const errors: FieldError[] = Object.values(error).flatMap((field) => {
      if (Array.isArray(field)) {
        return field[0].message;
      }
      return [field];
    });

    errors.forEach((err) => {
      if (err.message) {
        toast.error(err.message);
      }
    });
  };

  useEffect(() => {
    if (!form.formState.isSubmitting) return;
    if (!form.formState.errors) return;

    handleFormValidation(form.formState.errors);
  }, [form.formState.errors, form.formState.isSubmitting]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <InputFormField
          control={form.control}
          name="email"
          label="Email"
          placeholder="Ingrese su email"
        />
        <InputFormField
          control={form.control}
          name="password"
          label="Contraseña"
          placeholder="Ingrese su contraseña"
          type="password"
        />
        <CheckboxFormField
          control={form.control}
          label="Recordar sesión"
          name="remember"
          placeholder="Seleccione para recordar sesión"
        />
        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
