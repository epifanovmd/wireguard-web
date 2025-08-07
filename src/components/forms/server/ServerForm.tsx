import { typedFormField } from "@force-dev/react";
import { Form } from "antd";
import React, { FC, memo, PropsWithChildren, useCallback } from "react";
import { FormProvider } from "react-hook-form";

import { AsyncButton, Input } from "~@components";

import { useServerForm } from "./hooks";
import { TServerForm } from "./validation";

export interface IServerFormProps {
  onSubmit: (data: TServerForm) => void | Promise<void>;
}

export const ServerFormField = typedFormField<TServerForm>();

export const ServerForm: FC<PropsWithChildren<IServerFormProps>> = memo(
  ({ onSubmit, children }) => {
    const form = useServerForm();

    const handleSubmit = useCallback(
      () => form.handleSubmit(onSubmit)(),
      [form, onSubmit],
    );

    if (children) {
      return <FormProvider {...form}>{children}</FormProvider>;
    }

    return (
      <FormProvider {...form}>
        <ServerFormField
          name={"name"}
          render={({ field, fieldState: { error, invalid } }) => (
            <Form.Item
              layout={"vertical"}
              colon={true}
              label="Название серверв"
              validateStatus={invalid ? "error" : undefined}
              help={error?.message}
            >
              <Input placeholder="wg0" {...field} />
            </Form.Item>
          )}
        />
        <div className={"flex justify-end mt-3"}>
          <AsyncButton onClick={handleSubmit}>{"Создать"}</AsyncButton>
        </div>
      </FormProvider>
    );
  },
);
