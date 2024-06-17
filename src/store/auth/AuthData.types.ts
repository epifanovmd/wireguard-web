import { DataHolder, iocDecorator, Maybe } from "@force-dev/utils";

import { ILoginRequest, IProfile } from "../../service";

export const IAuthDataStore = iocDecorator<IAuthDataStore>();

export interface IAuthDataStore {
  holder: DataHolder<Maybe<IProfile>>;
  data: Maybe<IProfile>;

  login(params: ILoginRequest): Promise<Maybe<IProfile>>;
}
