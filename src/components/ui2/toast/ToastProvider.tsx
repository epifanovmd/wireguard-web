import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import * as React from "react";
import { toast, Toaster } from "react-hot-toast";

import { cn } from "../cn";

type ToastVariant = "success" | "error" | "warning" | "info";

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle size={16} />,
  error: <AlertCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info: <Info size={16} />,
};

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  success: "border-success/30 text-success",
  error: "border-destructive/30 text-destructive",
  warning: "border-warning/30 text-warning",
  info: "border-info/30 text-info",
};

interface CustomToastProps {
  id: string;
  message: string;
  variant: ToastVariant;
}

export const CustomToast: React.FC<CustomToastProps> = ({
  id,
  message,
  variant,
}) => (
  <div
    className={cn(
      "flex items-start gap-2.5 px-4 py-3 rounded-lg border shadow-lg",
      "min-w-[280px] max-w-[400px] bg-[var(--card)] text-[var(--card-foreground)]",
      VARIANT_CLASSES[variant],
    )}
  >
    <span className="flex-shrink-0 mt-0.5">{ICONS[variant]}</span>
    <span className="flex-1 text-sm leading-snug">{message}</span>
    <button
      type="button"
      onClick={() => toast.dismiss(id)}
      className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity mt-0.5 cursor-pointer"
    >
      <X size={14} />
    </button>
  </div>
);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <>
    {children}
    <Toaster
      position="top-right"
      toastOptions={{ duration: 4000 }}
      containerStyle={{ zIndex: 9999 }}
    />
  </>
);
