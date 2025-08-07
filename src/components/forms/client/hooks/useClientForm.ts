import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps } from "react-hook-form";

import { clientValidation, TClientForm } from "../validation";

export const useClientForm = (props?: UseFormProps<TClientForm>) => {
  return useForm<TClientForm>({
    defaultValues: { name: "", enabled: true },
    resolver: zodResolver(clientValidation),
    ...props,
  });
};
