import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps } from "react-hook-form";

import { serverValidation, TServerForm } from "../validation";

export const useServerForm = (props?: UseFormProps<TServerForm>) => {
  return useForm<TServerForm>({
    defaultValues: { name: "" },
    resolver: zodResolver(serverValidation),
    ...props,
  });
};
