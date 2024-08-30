import { Button as AntdButton } from "antd";
import React, { ComponentProps, FC, memo, PropsWithChildren } from "react";

interface IButtonProps extends ComponentProps<typeof AntdButton> {}

export const _Button: FC<PropsWithChildren<IButtonProps>> = props => {
  return <AntdButton {...props} />;
};

export const Button = memo(_Button);
