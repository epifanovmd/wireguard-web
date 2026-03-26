import { createServiceDecorator, SupportInitialize } from "@common/ioc";

export const IAppDataStore = createServiceDecorator<IAppDataStore>();

export type IAppDataStore = SupportInitialize;
