import { useModal } from "../modal";

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
}

export const useConfirm = (): ((options: ConfirmOptions) => Promise<boolean>) => {
  const { confirm } = useModal();

  return (options: ConfirmOptions): Promise<boolean> =>
    new Promise(resolve => {
      confirm({
        title: options.title,
        description: options.message,
        confirmVariant: options.variant === "danger" ? "destructive" : "default",
        confirmLabel: options.confirmLabel,
        cancelLabel: options.cancelLabel,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
};
