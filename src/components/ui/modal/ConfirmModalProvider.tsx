import { useBoolean } from "@force-dev/react";
import { ButtonType } from "antd/es/button/buttonHelpers";
import React, {
  ComponentProps,
  FC,
  memo,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";

import { AsyncButton } from "../button";
import { ConfirmModalContext } from "./ConfirmModalContext";
import { Modal } from "./Modal";
import { ModalFooter } from "./ModalFooter";

interface IConfirmModalProviderProps extends PropsWithChildren {}

export interface IConfirmParams {
  title?: React.ReactNode;
  description?: React.ReactNode;
  question?: React.ReactNode;

  submitColor?: ButtonType;
  cancelColor?: ButtonType;
  submitTitle?: string;
  cancelTitle?: string;

  onSubmit?: () => Promise<void> | void;
}

export interface IConfirmModalContext {
  onConfirm: (data?: IConfirmParams) => Promise<boolean>;
}

const cancelButtonProps: ComponentProps<typeof AsyncButton> = {};

export const ConfirmModalProvider: FC<
  PropsWithChildren<IConfirmModalProviderProps>
> = memo(({ children }) => {
  const [open, openConfirm, closeConfirm] = useBoolean();
  const [confirmData, setConfirmData] = useState<IConfirmParams>();

  const [callback, setCallback] = useState<(confirm: boolean) => void>();

  const onConfirm = useCallback(
    (data?: IConfirmParams): Promise<boolean> => {
      if (data) {
        setConfirmData({
          ...data,
        });
      }

      return new Promise(resolve => {
        openConfirm();
        setCallback(() => (confirm: boolean) => {
          resolve(confirm);
        });
      });
    },
    [openConfirm],
  );

  const onSubmit = useCallback(async () => {
    callback?.(true);
    if (confirmData?.onSubmit) {
      await confirmData.onSubmit();
    }
    closeConfirm();
  }, [callback, closeConfirm, confirmData]);

  const onCancel = useCallback(() => {
    closeConfirm();
    callback?.(false);
  }, [callback, closeConfirm]);

  const submitButtonProps: ComponentProps<typeof AsyncButton> = useMemo(
    () => ({
      type: confirmData?.submitColor ?? "primary",
    }),
    [confirmData?.submitColor],
  );

  return (
    <ConfirmModalContext.Provider
      value={{
        onConfirm,
      }}
    >
      {children}
      <Modal
        open={open}
        title={confirmData?.title}
        onCancel={onCancel}
        footer={
          <ModalFooter
            onCancel={onCancel}
            onSubmit={onSubmit}
            submitButtonProps={submitButtonProps}
            cancelButtonProps={cancelButtonProps}
            cancelTitle={confirmData?.cancelTitle ?? "Закрыть"}
            submitTitle={confirmData?.submitTitle ?? "Да"}
          />
        }
      >
        <div className={"flex flex-col justify-content-center pt-4"}>
          <div className={"text-base"}>{confirmData?.question}</div>
          {!!confirmData?.description && (
            <div className={"text-sm opacity-50"}>
              {confirmData.description}
            </div>
          )}
        </div>
      </Modal>
    </ConfirmModalContext.Provider>
  );
});
