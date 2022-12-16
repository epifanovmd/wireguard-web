import { IBaseViewModel } from "../../common";
import { ClientModel } from "../../models";
import { IClient, IClientsResponse } from "../../service";

export interface ClientsProps {
  title: string;
}

export interface IClientListVM extends IBaseViewModel<ClientsProps> {
  readonly list: ClientModel[];

  refresh(): Promise<IClientsResponse>;
}
