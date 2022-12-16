export interface IProfile {
  id: string;
  login: string;
  name: string;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IRegistrationRequest extends ILoginRequest {
  name: string;
}
