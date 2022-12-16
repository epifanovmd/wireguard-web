import "reflect-metadata";

import { Container as InversifyContainer } from "inversify";

import { ClientListVM } from "./pages/clients";
import {
  AuthService,
  ClientsService,
  ClientsSocketService,
  SocketService,
} from "./service";
import { ClientsDataStore, SessionDataStore } from "./store";

export const iocContainer = new InversifyContainer();

iocContainer.bind(ClientListVM).toSelf();
iocContainer.bind(AuthService).toSelf();
iocContainer.bind(ClientsService).toSelf();
iocContainer.bind(ClientsSocketService).toSelf();
iocContainer.bind(SocketService).toSelf().inSingletonScope();

iocContainer.bind(SessionDataStore).toSelf().inSingletonScope();
iocContainer.bind(ClientsDataStore).toSelf();
