import { createServiceDecorator, SupportInitialize } from "@di";

export const IAppDataStore = createServiceDecorator<IAppDataStore>();

export type IAppDataStore = SupportInitialize;
