import { typedFormField } from "@force-dev/react";
import { Form } from "antd";
import React, { FC, memo, PropsWithChildren, useCallback } from "react";
import { FormProvider } from "react-hook-form";

import { AsyncButton, Input } from "~@components";

import { useClientForm } from "./hooks";
import { TClientForm } from "./validation";

export interface IClientFormProps {
  onSubmit: (data: TClientForm) => void | Promise<void>;
}

export const ClientFormField = typedFormField<TClientForm>();

const _ClientForm: FC<PropsWithChildren<IClientFormProps>> = ({
  onSubmit,
  children,
}) => {
  const form = useClientForm();

  const handleSubmit = useCallback(
    () => form.handleSubmit(onSubmit)(),
    [form, onSubmit],
  );

  if (children) {
    return <FormProvider {...form}>{children}</FormProvider>;
  }

  return (
    <FormProvider {...form}>
      <ClientFormField
        name={"name"}
        render={({ field, fieldState: { error, invalid } }) => (
          <Form.Item
            layout={"vertical"}
            colon={true}
            label="Название"
            validateStatus={invalid ? "error" : undefined}
            help={error?.message}
          >
            <Input placeholder="Название VPN клиента" {...field} />
          </Form.Item>
        )}
      />
      <div className={"flex justify-end mt-3"}>
        <AsyncButton onClick={handleSubmit}>{"Создать"}</AsyncButton>
      </div>
    </FormProvider>
  );
};

export const ClientForm = memo(_ClientForm);
