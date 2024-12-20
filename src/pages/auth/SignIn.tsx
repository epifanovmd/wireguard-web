import { typedFormField } from "@force-dev/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { FormProvider } from "react-hook-form";
import styled from "styled-components";

import { AsyncButton, Input } from "~@components";

import { useSignInVM } from "./hooks";
import { usePasskeyAuth } from "./hooks/usePasskyAuth";
import { TSignInForm } from "./validations";

const Field = typedFormField<TSignInForm>();

export const SignInPage = observer(() => {
  const { form, handleLogin, handleNavigateSignUp } = useSignInVM();
  const { support, handleLogin: handlePasskey } = usePasskeyAuth();

  return (
    <Wrap>
      <FormProvider {...form}>
        <Form>
          <div className={"flex justify-between"}>
            <div className={"text-xl mb-4"}>{"Авторизация"}</div>
            {support && (
              <AsyncButton type={"primary"} onClick={handlePasskey}>
                {"Passkey"}
              </AsyncButton>
            )}
          </div>
          <Field
            name={"username"}
            render={({
              field: { onChange, value },
              fieldState: { invalid },
            }) => (
              <Input
                name={"username"}
                status={invalid ? "error" : undefined}
                className={"mt-2"}
                placeholder={"Username"}
                value={value}
                onChange={onChange}
                autoComplete={"username"}
              />
            )}
          />

          <Field
            name={"password"}
            render={({
              field: { onChange, value },
              fieldState: { invalid },
            }) => (
              <Input.Password
                name={"password"}
                status={invalid ? "error" : undefined}
                className={"mt-2"}
                placeholder={"Пароль"}
                value={value}
                onChange={onChange}
                type={"password"}
                autoComplete={"current-password"}
              />
            )}
          />
          <div className={"flex justify-between mt-4"}>
            <AsyncButton onClick={handleLogin}>{"Войти"}</AsyncButton>
            <AsyncButton type={"link"} onClick={handleNavigateSignUp}>
              {"Регистрация"}
            </AsyncButton>
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
