import { useCallback, useContext } from "react";

import { ConfirmModalContext } from "../ConfirmModalContext";
import { IConfirmParams } from "../ConfirmModalProvider";

export const useConfirmModal = (params: IConfirmParams = {}) => {
  const context = useContext(ConfirmModalContext);

  if (!context) {
    throw new Error("ConfirmModalContext is not provided");
  }

  const handleConfirm = useCallback(
    (data?: IConfirmParams) => {
      return context.onConfirm({ ...params, ...data });
    },
    [context, params],
  );

  return {
    onConfirm: handleConfirm,
  };
};
