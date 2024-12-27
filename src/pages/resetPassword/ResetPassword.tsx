import { typedFormField } from "@force-dev/react";
import React, { FC, memo, PropsWithChildren } from "react";
import { FormProvider } from "react-hook-form";
import styled from "styled-components";

import { AsyncButton, FieldWrapper, Input } from "~@components";

import { useResetPassword } from "./hooks";
import { TResetPasswordForm } from "./validations";

export interface IResetPasswordProps {}

const Field = typedFormField<TResetPasswordForm>();

const _ResetPassword: FC<PropsWithChildren<IResetPasswordProps>> = () => {
  const { form, handleSubmit } = useResetPassword();

  return (
    <Wrap>
      <FormProvider {...form}>
        <Form>
          <div className={"flex justify-between"}>
            <div className={"text-xl mb-4"}>{"Введите новый пароль"}</div>
          </div>

          <Field
            name={"password"}
            render={({
              field: { onChange, value },
              fieldState: { invalid, error },
            }) => (
              <FieldWrapper error={error}>
                <Input.Password
                  name={"password"}
                  status={invalid ? "error" : undefined}
                  className={"mt-2"}
                  placeholder={"Пароль"}
                  value={value}
                  onChange={onChange}
                  type={"password"}
                  autoComplete={"new-password"}
                />
              </FieldWrapper>
            )}
          />
          <Field
            name={"confirmPassword"}
            render={({
              field: { onChange, value },
              fieldState: { invalid, error },
            }) => (
              <FieldWrapper error={error}>
                <Input.Password
                  name={"confirmPassword"}
                  status={invalid ? "error" : undefined}
                  className={"mt-2"}
                  placeholder={"Подтверждение пароля"}
                  value={value}
                  onChange={onChange}
                  type={"password"}
                  autoComplete={"new-password"}
                />
              </FieldWrapper>
            )}
          />

          <div className={"flex justify-between mt-4"}>
            <AsyncButton onClick={handleSubmit}>{"Сохранить"}</AsyncButton>
          </div>
        </Form>
      </FormProvider>
    </Wrap>
  );
};

export const ResetPassword = memo(_ResetPassword);

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
`;

const Form = styled.form`
  width: 100%;
  max-width: 500px;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 3px 4px 18px 0 rgba(34, 60, 80, 0.2);
`;
