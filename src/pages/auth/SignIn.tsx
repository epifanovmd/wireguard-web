import { typedFormField } from "@force-dev/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { FormProvider } from "react-hook-form";
import styled from "styled-components";

import { AsyncButton, Container, Input } from "~@components";

import { useSignInVM } from "./hooks";
import { TSignInForm } from "./validations";

const Field = typedFormField<TSignInForm>();

export const SignInPage = observer(() => {
  const { form, handleLogin, handleNavigateSignUp } = useSignInVM();

  return (
    <Container>
      <Wrap>
        <Form>
          <FormProvider {...form}>
            <div className={"text-xl mb-4"}>{"Авторизация"}</div>
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
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            <Field
              name={"password"}
              render={({
                field: { onChange, value },
                fieldState: { invalid },
              }) => (
                <Input
                  name={"password"}
                  status={invalid ? "error" : undefined}
                  className={"mt-2"}
                  value={value}
                  onChange={onChange}
                  type={"password"}
                />
              )}
            />
            <div className={"flex justify-between mt-4"}>
              <AsyncButton onClick={handleLogin}>{"Войти"}</AsyncButton>
              <AsyncButton type={"link"} onClick={handleNavigateSignUp}>
                {"Зарегистрироваться"}
              </AsyncButton>
            </div>
          </FormProvider>
        </Form>
      </Wrap>
    </Container>
  );
});

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
`;

const Form = styled.div`
  width: 500px;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 3px 4px 18px 0 rgba(34, 60, 80, 0.2);
`;