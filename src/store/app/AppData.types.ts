import { createServiceDecorator, SupportInitialize } from "@force-dev/utils";

export const IAppDataStore = createServiceDecorator<IAppDataStore>();

export type IAppDataStore = SupportInitialize;
