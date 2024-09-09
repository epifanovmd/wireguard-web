import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UseFormProps } from "react-hook-form/dist/types";

import { serverValidation, TServerForm } from "../validation";

export const useServerForm = (props?: UseFormProps<TServerForm>) => {
  return useForm<TServerForm>({
    defaultValues: { name: "" },
    resolver: zodResolver(serverValidation),
    ...props,
  });
};
