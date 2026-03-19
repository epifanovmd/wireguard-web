import { iocHook } from "@force-dev/react";

import { INotificationService } from "./NotificationService";

export const useNotification = iocHook(INotificationService);
