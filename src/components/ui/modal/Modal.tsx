import { Modal as AntdModal } from "antd";
import React, { ComponentProps, FC, memo, PropsWithChildren } from "react";

export interface IModalProps extends ComponentProps<typeof AntdModal> {}

const _Modal: FC<PropsWithChildren<IModalProps>> = props => {
  return <AntdModal {...props} />;
};

export const Modal = memo(_Modal);
