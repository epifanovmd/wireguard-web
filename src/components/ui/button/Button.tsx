import { Button as AntdButton } from "antd";
import React, { ComponentProps, FC, memo, PropsWithChildren } from "react";

type IButtonProps = ComponentProps<typeof AntdButton>;

export const Button: FC<PropsWithChildren<IButtonProps>> = memo(props => {
  return <AntdButton {...props} />;
});
