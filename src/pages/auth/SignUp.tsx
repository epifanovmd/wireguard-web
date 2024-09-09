import { typedFormField } from "@force-dev/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { FormProvider } from "react-hook-form";
import styled from "styled-components";

import { AsyncButton, Container, Input } from "~@components";

import { useSignUpVM } from "./hooks";
import { TSignUpForm } from "./validations";

const Field = typedFormField<TSignUpForm>();

export const SignUpPage = observer(() => {
  const { form, handleSignUp } = useSignUpVM();

  return (
    <Container>
      <Wrap>
        <Form>
          <FormProvider {...form}>
            <div className={"text-xl mb-4"}>{"Регистрация"}</div>
            <Field
              name={"username"}
              render={({
                field: { onChange, value },
                fieldState: { invalid },
              }) => (
                <Input
                  placeholder={"Username"}
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
                  placeholder={"Пароль"}
                  type={"password"}
                  status={invalid ? "error" : undefined}
                  className={"mt-2"}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            <Field
              name={"confirmPassword"}
              render={({
                field: { onChange, value },
                fieldState: { invalid },
              }) => (
                <Input
                  placeholder={"Подтверждение пароля"}
                  type={"password"}
                  status={invalid ? "error" : undefined}
                  className={"mt-2"}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            <div className={"flex justify-end mt-4"}>
              <AsyncButton onClick={handleSignUp}>
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
