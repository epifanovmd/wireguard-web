import React, { ComponentProps, FC, memo, PropsWithChildren } from "react";

import { AsyncButton } from "~@components";

interface IProps {
  clasName?: string;
  prevTitle?: string;
  cancelTitle?: string;
  submitTitle?: string;
  onPrev?: () => void;
  onCancel?: () => void;
  onSubmit?: () => Promise<void> | void;
  disabledPrev?: boolean;
  disabledCancel?: boolean;
  disableSubmit?: boolean;
  loading?: boolean;
  prevButtonProps?: ComponentProps<typeof AsyncButton>;
  cancelButtonProps?: ComponentProps<typeof AsyncButton>;
  submitButtonProps?: ComponentProps<typeof AsyncButton>;
}

export const ModalFooter: FC<PropsWithChildren<IProps>> = memo(
  ({
    clasName,
    prevTitle = "Назад",
    cancelTitle = "Отменить",
    submitTitle = "Далее",
    onPrev,
    onCancel,
    onSubmit,
    disabledPrev,
    disabledCancel,
    disableSubmit,
    loading,
    prevButtonProps,
    cancelButtonProps,
    submitButtonProps,
  }) => {
    return (
      <div className={"modal-footer bg-white sticky bottom-0 z-50 mt-3"}>
        <div className={`flex flex-grow ${clasName}`}>
          {onPrev && (
            <AsyncButton
              color="default"
              onClick={onPrev}
              disabled={disabledPrev || loading}
              className={"mr-auto"}
              {...prevButtonProps}
            >
              {prevTitle}
            </AsyncButton>
          )}

          <div className={!onPrev ? "ml-auto" : ""}>
            {onCancel && (
              <AsyncButton
                type={"primary"}
                danger={true}
                disabled={disabledCancel || loading}
                onClick={onCancel}
                {...cancelButtonProps}
                className={`!ml-2 ${cancelButtonProps?.className}`}
              >
                {cancelTitle}
              </AsyncButton>
            )}
            {onSubmit && (
              <AsyncButton
                type={"primary"}
                loading={loading}
                disabled={disableSubmit || loading}
                color="primary"
                onClick={onSubmit}
                {...submitButtonProps}
                className={`!ml-2 ${submitButtonProps?.className}`}
              >
                {submitTitle}
              </AsyncButton>
            )}
          </div>
        </div>
      </div>
    );
  },
);
