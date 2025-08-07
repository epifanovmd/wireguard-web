import { typedFormField } from "@force-dev/react";
import React, { FC, memo, PropsWithChildren } from "react";
import { FormProvider } from "react-hook-form";
import styled from "styled-components";

import { AsyncButton, FieldWrapper, Input } from "~@components";

import { useRecoveryPassword } from "./hooks/useRecoveryPassword";
import { TRecoveryPasswordForm } from "./validations";

export type IRecoveryPasswordProps = object;

const Field = typedFormField<TRecoveryPasswordForm>();

export const RecoveryPassword: FC<PropsWithChildren<IRecoveryPasswordProps>> =
  memo(() => {
    const { form, handleSubmit } = useRecoveryPassword();

    return (
      <Wrap>
        <FormProvider {...form}>
          <Form>
            <div className={"flex justify-between"}>
              <div className={"text-xl mb-4"}>{"Востановление пароля"}</div>
            </div>

            <Field
              name={"login"}
              render={({
                field: { onChange, value },
                fieldState: { invalid, error },
              }) => (
                <FieldWrapper error={error}>
                  <Input
                    name={"login"}
                    status={invalid ? "error" : undefined}
                    className={"mt-2"}
                    placeholder={"Введите ваш Email для востановления пароля"}
                    value={value}
                    onChange={onChange}
                    type={"email"}
                    autoComplete={"email"}
                  />
                </FieldWrapper>
              )}
            />
            <div className={"flex justify-between mt-4"}>
              <AsyncButton onClick={handleSubmit}>{"Востановить"}</AsyncButton>
            </div>
          </Form>
        </FormProvider>
      </Wrap>
    );
  });

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
