import React from "react";
import { toast } from "react-hot-toast";

import { CustomToast } from "./ToastProvider";

export interface ToastContextValue {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

export const useToast = (): ToastContextValue => ({
  success: (message, duration = 4000) =>
    toast.custom(
      t => (
        <CustomToast
          id={t.id}
          message={message}
          variant="success"
          visible={t.visible}
        />
      ),
      { duration },
    ),
  error: (message, duration = 5000) =>
    toast.custom(
      t => (
        <CustomToast
          id={t.id}
          message={message}
          variant="error"
          visible={t.visible}
        />
      ),
      { duration },
    ),
  warning: (message, duration = 4000) =>
    toast.custom(
      t => (
        <CustomToast
          id={t.id}
          message={message}
          variant="warning"
          visible={t.visible}
        />
      ),
      { duration },
    ),
  info: (message, duration = 4000) =>
    toast.custom(
      t => (
        <CustomToast
          id={t.id}
          message={message}
          variant="info"
          visible={t.visible}
        />
      ),
      { duration },
    ),
});
