import { iocDecorator } from "@force-dev/utils";

export const ISessionDataStore = iocDecorator<ISessionDataStore>();

export interface ISessionDataStore {
  token: string;

  setToken(token?: string): void;

  clearToken(): void;
}
