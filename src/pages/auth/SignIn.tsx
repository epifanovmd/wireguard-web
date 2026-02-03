import { typedFormField } from "@force-dev/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { FormProvider } from "react-hook-form";
import styled from "styled-components";

import { usePasskeyAuth } from "~@common";
import { AsyncButton, Input } from "~@components";
import { FieldWrapper } from "~@components/ui/form/field";

import { useSignInVM } from "./hooks";
import { TSignInForm } from "./validations";

const Field = typedFormField<TSignInForm>();

export const SignInPage = observer(() => {
  const {
    form,
    handleLogin,
    handleNavigateSignUp,
    handleNavigateRecoveryPassword,
  } = useSignInVM();
  const { profileId, support, handleLogin: handlePasskey } = usePasskeyAuth();

  return (
    <Wrap>
      <FormProvider {...form}>
        <Form1>
          <div className={"flex justify-between"}>
            <div className={"text-xl mb-4"}>{"Авторизация"}</div>
            {support && profileId && (
              <AsyncButton type={"primary"} onClick={handlePasskey}>
                {"Passkey"}
              </AsyncButton>
            )}
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
                  placeholder={"Login"}
                  value={value}
                  onChange={onChange}
                  autoComplete={"login"}
                />
              </FieldWrapper>
            )}
          />

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
                  autoComplete={"current-password"}
                />
              </FieldWrapper>
            )}
          />
          <div className={"flex justify-between mt-4"}>
            <div className={"flex"}>
              <AsyncButton onClick={handleLogin}>{"Войти"}</AsyncButton>
              {/*<AsyncButton*/}
              {/*  type={"link"}*/}
              {/*  onClick={handleNavigateRecoveryPassword}*/}
              {/*>*/}
              {/*  {"Забыли пароль?"}*/}
              {/*</AsyncButton>*/}
            </div>
            {/*<AsyncButton type={"link"} onClick={handleNavigateSignUp}>*/}
            {/*  {"Регистрация"}*/}
            {/*</AsyncButton>*/}
          </div>
        </Form1>
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

const Form1 = styled.form`
  width: 100%;
  max-width: 500px;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 3px 4px 18px 0 rgba(34, 60, 80, 0.2);
`;
