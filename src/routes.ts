import { Clients } from "./pages/clients";
import { Login } from "./pages/login";

export enum RoutePaths {
  ROOT = "/",
  CLIENTS = "/clients",
  AUTH = "/auth",
}

export interface IRoute<
  P extends string = RoutePaths,
  T extends string = string,
> {
  path: P;
  pathName: T;
  component: any;
  children?: IRoute<P>[];
}

export const routes: IRoute[] = [
  {
    path: RoutePaths.ROOT,
    pathName: "clients",
    component: Clients,
  },
  {
    path: RoutePaths.AUTH,
    pathName: "auth",
    component: Login,
  },
];
