import React, { FC, memo } from "react";

import type { IAsyncButtonProps } from "../button/AsyncButton";
import { AsyncButton } from "../button/AsyncButton";

export interface ModalFooterProps {
  className?: string;
  prevTitle?: string;
  cancelTitle?: string;
  submitTitle?: string;
  onPrev?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  onSubmit?: () => void | Promise<void>;
  disabledPrev?: boolean;
  disabledCancel?: boolean;
  disabledSubmit?: boolean;
  loading?: boolean;
  prevButtonProps?: Omit<IAsyncButtonProps, "onClick">;
  cancelButtonProps?: Omit<IAsyncButtonProps, "onClick">;
  submitButtonProps?: Omit<IAsyncButtonProps, "onClick">;
}

export const ModalFooter: FC<ModalFooterProps> = memo(
  ({
    className,
    prevTitle = "Back",
    cancelTitle = "Cancel",
    submitTitle = "Submit",
    onPrev,
    onCancel,
    onSubmit,
    disabledPrev,
    disabledCancel,
    disabledSubmit,
    loading,
    prevButtonProps,
    cancelButtonProps,
    submitButtonProps,
  }) => {
    return (
      <div className={`flex items-center gap-2 w-full ${className ?? ""}`}>
        {onPrev && (
          <AsyncButton
            variant="ghost"
            size="sm"
            onClick={onPrev}
            disabled={disabledPrev || loading}
            className="mr-auto"
            {...prevButtonProps}
          >
            {prevTitle}
          </AsyncButton>
        )}
        <div className={`flex items-center gap-2 ${!onPrev ? "ml-auto" : ""}`}>
          {onCancel && (
            <AsyncButton
              variant="secondary"
              size="sm"
              onClick={onCancel}
              disabled={disabledCancel || loading}
              {...cancelButtonProps}
            >
              {cancelTitle}
            </AsyncButton>
          )}
          {onSubmit && (
            <AsyncButton
              variant="primary"
              size="sm"
              onClick={onSubmit}
              disabled={disabledSubmit || loading}
              loading={loading}
              {...submitButtonProps}
            >
              {submitTitle}
            </AsyncButton>
          )}
        </div>
      </div>
    );
  },
);

ModalFooter.displayName = "ModalFooter";
