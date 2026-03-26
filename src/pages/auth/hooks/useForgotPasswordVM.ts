import { useApi } from "@api/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHotkeys } from "@mantine/hooks";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  login: z.string().min(1, "Email или телефон обязателен"),
});

export type ForgotPasswordFormData = z.infer<typeof schema>;

export const useForgotPasswordVM = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const methods = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;

  const onBack = useCallback(() => {
    return navigate({ to: "/auth/signIn" });
  }, [navigate]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    await api.requestResetPassword({ login: data.login });
    setLoading(false);
    setSent(true);
  };

  useHotkeys([["Enter", () => handleSubmit(onSubmit)()]], []);

  return { methods, handleSubmit, onSubmit, onBack, loading, sent };
};
