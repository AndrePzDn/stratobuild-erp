import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, type ReactNode } from "react";
import type { z } from "zod";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";

interface Props<T extends z.ZodTypeAny> {
  schema: T;
  children: ReactNode;
  data?: z.infer<T>;
  onSubmit?: (data: z.infer<T>) => void;
}

export default function FormTemplate<T extends z.ZodTypeAny>({
  schema,
  children,
  data,
  onSubmit = (data: z.infer<T>) => console.log(data),
}: Props<T>) {
  type FormValues = z.infer<T>;

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: data,
  });

  useEffect(() => {
    console.log(methods.formState.errors);
    if (data) {
      methods.reset(data);
    }
  }, [data, methods, methods.reset]);

  return (
    <Form {...methods}>
      <form
        id={`${schema.toString()}-form`}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </Form>
  );
}
