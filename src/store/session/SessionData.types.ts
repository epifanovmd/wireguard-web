import { iocDecorator, SupportInitialize } from "@force-dev/utils";

export const ISessionDataStore = iocDecorator<ISessionDataStore>();

export interface ISessionDataStore extends SupportInitialize<() => void> {
  isAuthorized: boolean;
  isReady: boolean;

  restore(): Promise<string>;
}
