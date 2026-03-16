import { notifications } from "@mantine/notifications";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";
import React from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastContextValue {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  dismiss: (id: string) => void;
}

const toastValue: ToastContextValue = {
  success: (message, duration) =>
    notifications.show({
      message,
      color: "green",
      icon: <CheckCircle size={16} />,
      autoClose: duration ?? 4000,
    }),
  error: (message, duration) =>
    notifications.show({
      message,
      color: "red",
      icon: <AlertCircle size={16} />,
      autoClose: duration ?? 5000,
    }),
  warning: (message, duration) =>
    notifications.show({
      message,
      color: "yellow",
      icon: <AlertTriangle size={16} />,
      autoClose: duration ?? 4000,
    }),
  info: (message, duration) =>
    notifications.show({
      message,
      color: "blue",
      icon: <Info size={16} />,
      autoClose: duration ?? 4000,
    }),
  dismiss: (id: string) => notifications.hide(id),
};

export const useToast = (): ToastContextValue => toastValue;
