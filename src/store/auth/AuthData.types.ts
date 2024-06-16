import { DataHolder, iocDecorator, Maybe } from "../../common";
import { ILoginRequest, IProfile } from "../../service";

export const IAuthDataStore = iocDecorator<IAuthDataStore>();

export interface IAuthDataStore {
  holder: DataHolder<Maybe<IProfile>>;
  data: Maybe<IProfile>;

  login(params: ILoginRequest): Promise<Maybe<IProfile>>;
}
