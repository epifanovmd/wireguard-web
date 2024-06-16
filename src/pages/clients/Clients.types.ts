import { IBaseViewModel, iocDecorator } from "../../common";
import { ClientModel } from "../../models";
import { IClientsResponse } from "../../service";
import { ClientListVM } from "./useClientsVM";

export interface ClientsProps {
  title: string;
}

export const IClientListVM = iocDecorator<ClientListVM>();

export interface IClientListVM extends IBaseViewModel<ClientsProps> {
  readonly list: ClientModel[];

  refresh(): Promise<IClientsResponse>;
}
