import { Input as AntdInput } from "antd";
import React, { ComponentProps, ElementRef, forwardRef } from "react";

const _Input = forwardRef<
  ElementRef<typeof AntdInput>,
  ComponentProps<typeof AntdInput>
>((props, ref) => {
  return <AntdInput ref={ref} {...props} />;
});

const _Password = forwardRef<
  ElementRef<typeof AntdInput.Password>,
  ComponentProps<typeof AntdInput.Password>
>((props, ref) => {
  return <AntdInput.Password ref={ref} {...props} />;
});

const _OTP = forwardRef<
  ElementRef<typeof AntdInput.OTP>,
  ComponentProps<typeof AntdInput.OTP>
>((props, ref) => {
  return <AntdInput.OTP ref={ref} {...props} />;
});

const _Search = forwardRef<
  ElementRef<typeof AntdInput.Search>,
  ComponentProps<typeof AntdInput.Search>
>((props, ref) => {
  return <AntdInput.Search ref={ref} {...props} />;
});

const _TextArea = forwardRef<
  ElementRef<typeof AntdInput.TextArea>,
  ComponentProps<typeof AntdInput.TextArea>
>((props, ref) => {
  return <AntdInput.TextArea ref={ref} {...props} />;
});

export const Input = _Input as typeof AntdInput;

Input.Password = _Password;
Input.OTP = _OTP;
Input.Search = _Search;
Input.TextArea = _TextArea;
