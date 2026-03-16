import { typedFormField } from "@force-dev/react";
import React, { FC, memo, PropsWithChildren } from "react";
import { FormProvider } from "react-hook-form";

import { AsyncButton, FieldWrapper, Input } from "~@components";

import { useRecoveryPassword } from "./hooks/useRecoveryPassword";
import { TRecoveryPasswordForm } from "./validations";

export type IRecoveryPasswordProps = object;

const Field = typedFormField<TRecoveryPasswordForm>();

export const RecoveryPassword: FC<PropsWithChildren<IRecoveryPasswordProps>> =
  memo(() => {
    const { form, handleSubmit } = useRecoveryPassword();

    return (
      <div className={"flex items-center justify-center flex-col h-screen"}>
        <FormProvider {...form}>
          <form
            className={
              "w-full max-w-[500px] p-8 rounded-2xl shadow-[3px_4px_18px_0_rgba(34,60,80,0.2)]"
            }
          >
            <div className={"flex justify-between"}>
              <div className={"text-xl mb-4"}>{"Востановление пароля"}</div>
            </div>

            <Field
              name={"login"}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FieldWrapper error={error}>
                  <Input
                    name={"login"}
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
          </form>
        </FormProvider>
      </div>
    );
  });
