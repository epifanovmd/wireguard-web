import { ArrowLeftOutlined } from "@ant-design/icons";
import { typedFormField } from "@force-dev/react";
import { useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import React, { useCallback } from "react";
import { FormProvider } from "react-hook-form";
import styled from "styled-components";

import { AsyncButton, Input } from "~@components";

import { useSignUpVM } from "./hooks";
import { TSignUpForm } from "./validations";

const Field = typedFormField<TSignUpForm>();

export const SignUpPage = observer(() => {
  const { form, handleSignUp } = useSignUpVM();
  const navigate = useNavigate();

  const onBack = useCallback(() => {
    navigate({ to: "/auth/signIn" }).then();
  }, [navigate]);

  return (
    <Wrap>
      <FormProvider {...form}>
        <Form>
          <div className={"flex items-center mb-4"}>
            <ArrowLeftOutlined
              className={"p-1 mr-2 cursor-pointer"}
              onClick={onBack}
            />
            <div className={"text-xl"}>{"Регистрация"}</div>
          </div>

          <Field
            name={"email"}
            render={({
              field: { onChange, value },
              fieldState: { invalid },
            }) => (
              <Input
                placeholder={"Email"}
                status={invalid ? "error" : undefined}
                className={"mt-2"}
                value={value}
                onChange={onChange}
                autoComplete={"email"}
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
                placeholder={"Пароль"}
                type={"password"}
                status={invalid ? "error" : undefined}
                className={"mt-2"}
                value={value}
                onChange={onChange}
                autoComplete={"new-password"}
              />
            )}
          />
          <Field
            name={"confirmPassword"}
            render={({
              field: { onChange, value },
              fieldState: { invalid },
            }) => (
              <Input.Password
                placeholder={"Подтверждение пароля"}
                type={"password"}
                status={invalid ? "error" : undefined}
                className={"mt-2"}
                value={value}
                onChange={onChange}
                autoComplete={"new-password"}
              />
            )}
          />

          <div className={"flex justify-end mt-4"}>
            <AsyncButton onClick={handleSignUp}>
              {"Зарегистрироваться"}
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
