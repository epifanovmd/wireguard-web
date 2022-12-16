import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { ClientsDataStore } from "../../store";
import { ClientsProps, IClientListVM } from "./Clients.types";

@injectable()
export class ClientListVM implements IClientListVM {
  private _props?: ClientsProps;

  setProps(props: ClientsProps) {
    this._props = props;
  }

  constructor(
    @inject(ClientsDataStore) private _clientsDataStore: ClientsDataStore,
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
