import { iocHook } from "@common/ioc";

import { INotificationService } from "./NotificationService";

export const useNotification = iocHook(INotificationService);
