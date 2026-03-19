import { clsx } from "clsx";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import * as React from "react";
import { toast } from "react-hot-toast";
import { twMerge } from "tailwind-merge";

export type ToastVariant = "success" | "error" | "warning" | "info";

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle size={16} />,
  error: <AlertCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info: <Info size={16} />,
};

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  success: "border-success/40 text-success",
  error: "border-destructive/40 text-destructive",
  warning: "border-warning/40 text-warning",
  info: "border-info/40 text-info",
};

export interface CustomToastProps {
  id: string;
  message: string;
  variant: ToastVariant;
  visible: boolean;
}

export const CustomToast: React.FC<CustomToastProps> = ({
  id,
  message,
  variant,
  visible,
}) => (
  <div
    className={twMerge(
      clsx(
        "flex items-start gap-2.5 px-4 py-3 rounded-lg border shadow-lg",
        "min-w-[280px] max-w-[400px] bg-[var(--card)] text-[var(--card-foreground)]",
        VARIANT_CLASSES[variant],
        visible
          ? "animate-in slide-in-from-right-5 fade-in duration-300 ease-out"
          : "animate-out slide-out-to-right-5 fade-out duration-200 ease-in fill-mode-forwards",
      ),
    )}
  >
    <span className="flex-shrink-0 mt-0.5">{ICONS[variant]}</span>
    <span className="flex-1 text-sm leading-snug">{message}</span>
    <button
      type="button"
      onClick={() => toast.dismiss(id)}
      className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity mt-0.5 cursor-pointer"
    >
      <X size={14} />
    </button>
  </div>
);
