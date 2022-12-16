import { ClientsComponent } from "./pages/clients";
import { LoginComponent } from "./pages/login";

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
    component: ClientsComponent,
  },
  {
    path: RoutePaths.AUTH,
    pathName: "auth",
    component: LoginComponent,
  },
];
