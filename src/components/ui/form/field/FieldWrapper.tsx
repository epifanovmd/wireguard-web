import { Form } from "antd";
import { FormItemProps } from "antd/es/form/FormItem";
import classNames from "classnames";
import React, { FC, memo, PropsWithChildren } from "react";
import { FieldError } from "react-hook-form";

export interface IFieldWrapperProps extends FormItemProps {
  error?: FieldError;
  caption?: string;
}

const _FieldWrapper: FC<PropsWithChildren<IFieldWrapperProps>> = ({
  error,
  caption,
  children,
  className,
  ...rest
}) => {
  const validateStatus =
    rest?.validateStatus ?? error?.message ? "error" : "success";
  const help = rest.help ?? error?.message ?? caption;

  return (
    <Form.Item
      {...rest}
      className={classNames("mb-0", className)}
      validateStatus={validateStatus}
      help={help}
    >
      {children}
    </Form.Item>
  );
};

export const FieldWrapper = memo(_FieldWrapper);
