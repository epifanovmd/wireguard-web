import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import { AsyncButton } from "../button/AsyncButton";
import type { ButtonVariant } from "../button/Button";
import { Button } from "../button/Button";
import { Modal } from "./Modal";

export interface ConfirmOptions {
  title?: ReactNode;
  message?: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: ButtonVariant;
  /** @deprecated use confirmVariant */
  variant?: ButtonVariant;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn>(() => Promise.resolve(false));

export const useConfirm = (): ConfirmFn => useContext(ConfirmContext);

export const ConfirmModalProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<{
    opts: ConfirmOptions;
    resolve: (v: boolean) => void;
  } | null>(null);

  const confirm: ConfirmFn = useCallback(opts => {
    return new Promise<boolean>(resolve => {
      setState({ opts, resolve });
    });
  }, []);

  const handleClose = useCallback(
    (result: boolean) => {
      state?.resolve(result);
      setState(null);
    },
    [state],
  );

  const handleConfirm = useCallback(async () => {
    if (state?.opts.onConfirm) {
      await state.opts.onConfirm();
    }
    handleClose(true);
  }, [state, handleClose]);

  const handleCancel = useCallback(() => {
    state?.opts.onCancel?.();
    handleClose(false);
  }, [state, handleClose]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <Modal
          open
          onClose={handleCancel}
          title={state.opts.title ?? "Confirm action"}
          closable={false}
          size="sm"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={handleCancel}>
                {state.opts.cancelText ?? "Cancel"}
              </Button>
              <AsyncButton
                variant={
                  state.opts.confirmVariant ?? state.opts.variant ?? "danger"
                }
                size="sm"
                onClick={handleConfirm}
              >
                {state.opts.confirmText ?? "Confirm"}
              </AsyncButton>
            </>
          }
        >
          <div className="flex flex-col gap-1.5">
            {state.opts.message && (
              <p className="m-0 text-sm text-[var(--text-primary)]">
                {state.opts.message}
              </p>
            )}
            {state.opts.description && (
              <p className="m-0 text-xs text-[var(--text-muted)] leading-relaxed">
                {state.opts.description}
              </p>
            )}
          </div>
        </Modal>
      )}
    </ConfirmContext.Provider>
  );
};
