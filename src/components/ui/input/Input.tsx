import { Input as AntdInput, InputRef } from "antd";
import React, { ComponentProps, forwardRef, memo } from "react";

export interface IInputProps extends ComponentProps<typeof AntdInput> {
  ref?: React.Ref<InputRef>;
}

const _Input = forwardRef<InputRef, IInputProps>((props, ref) => {
  return <AntdInput ref={ref} {...props} />;
});

export const Input = memo(_Input);
