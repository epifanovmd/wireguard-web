import { makeAutoObservable } from "mobx";

import { IClientsDataStore } from "../../store";
import { ClientsProps, IClientListVM } from "./Clients.types";

@IClientListVM()
export class ClientListVM implements IClientListVM {
  private _props?: ClientsProps;

  setProps(props: ClientsProps) {
    this._props = props;
  }

  constructor(
    @IClientsDataStore() private _clientsDataStore: IClientsDataStore,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get list() {
    return this._clientsDataStore.models;
  }

  refresh() {
    return this._clientsDataStore.onRefresh();
  }
}
