import { typedFormField } from "@force-dev/react";
import { Form, Switch } from "antd";
import React, { FC, memo, PropsWithChildren, useCallback } from "react";
import { FormProvider } from "react-hook-form";

import { AsyncButton, Input } from "~@components";
import { IClient } from "~@service";

import { useClientForm } from "./hooks";
import { TClientForm } from "./validation";

export interface IClientFormProps {
  client?: IClient;
  onSubmit: (data: TClientForm) => void | Promise<void>;
}

export const ClientFormField = typedFormField<TClientForm>();

const _ClientForm: FC<PropsWithChildren<IClientFormProps>> = ({
  client,
  onSubmit,
  children,
}) => {
  const form = useClientForm({
    defaultValues: {
      name: client?.name ?? "",
      enabled: client?.enabled || true,
    },
  });

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
            <Input placeholder="Имя VPN клиента" {...field} />
          </Form.Item>
        )}
      />
      <ClientFormField
        name={"enabled"}
        render={({ field, fieldState: { error, invalid } }) => (
          <Form.Item
            layout={"horizontal"}
            colon={true}
            label="Активен"
            validateStatus={invalid ? "error" : undefined}
            help={error?.message}
          >
            <div className={"flex justify-end w-[100%]"}>
              <Switch
                title="Активировать"
                className={"ml-auto"}
                checked={field.value}
                onChange={field.onChange}
              />
            </div>
          </Form.Item>
        )}
      />
      <div className={"flex justify-end mt-3"}>
        <AsyncButton onClick={handleSubmit}>
          {client ? "Сохранить" : "Создать"}
        </AsyncButton>
      </div>
    </FormProvider>
  );
};

export const ClientForm = memo(_ClientForm);
