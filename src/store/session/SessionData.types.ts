import { iocDecorator } from "../../common";

export const ISessionDataStore = iocDecorator<ISessionDataStore>();

export interface ISessionDataStore {
  token: string;

  setToken(token?: string): void;

  clearToken(): void;
}
