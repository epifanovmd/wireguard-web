import { createServiceDecorator } from "@di";
import React from "react";
import { toast } from "react-hot-toast";

import { CustomToast, ToastVariant } from "./CustomToast";

export interface NotificationOptions {
  duration?: number;
}

export const INotificationService =
  createServiceDecorator<INotificationService>();

export interface INotificationService {
  success(message: string, options?: NotificationOptions): void;
  error(message: string, options?: NotificationOptions): void;
  warning(message: string, options?: NotificationOptions): void;
  info(message: string, options?: NotificationOptions): void;
}

const DEFAULT_DURATION: Record<ToastVariant, number> = {
  success: 4000,
  error: 5000,
  warning: 4000,
  info: 4000,
};

@INotificationService({ inSingleton: true })
export class NotificationService implements INotificationService {
  success(message: string, { duration } = {} as NotificationOptions): void {
    this._show("success", message, duration);
  }

  error(message: string, { duration } = {} as NotificationOptions): void {
    this._show("error", message, duration);
  }

  warning(message: string, { duration } = {} as NotificationOptions): void {
    this._show("warning", message, duration);
  }

  info(message: string, { duration } = {} as NotificationOptions): void {
    this._show("info", message, duration);
  }

  private _show(
    variant: ToastVariant,
    message: string,
    duration = DEFAULT_DURATION[variant],
  ): void {
    toast.custom(
      t => (
        <CustomToast
          id={t.id}
          message={message}
          variant={variant}
          visible={t.visible}
        />
      ),
      { duration },
    );
  }
}
