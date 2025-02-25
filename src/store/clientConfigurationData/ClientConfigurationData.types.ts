import { createServiceDecorator, DataHolder, Maybe } from "@force-dev/utils";

export const IClientConfigurationDataDataStore =
  createServiceDecorator<IClientConfigurationDataDataStore>();

export interface IClientConfigurationDataDataStore {
  holder: DataHolder<string>;
  data: Maybe<string>;
  loading: boolean;

  onRefresh(clientId: string): Promise<Maybe<string>>;
}
