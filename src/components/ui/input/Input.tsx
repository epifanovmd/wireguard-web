import { Input as AntdInput } from "antd";
import React, { ComponentProps, FC, memo, PropsWithChildren } from "react";

export interface IInputProps extends ComponentProps<typeof AntdInput> {}

const _Input: FC<PropsWithChildren<IInputProps>> = props => {
  return <AntdInput {...props} />;
};

export const Input = memo(_Input);
