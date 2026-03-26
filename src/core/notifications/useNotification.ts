import { iocHook } from "@di";

import { INotificationService } from "./NotificationService";

export const useNotification = iocHook(INotificationService);
