import { IClient, IClientsService } from "@service";

import { IntervalDataSource } from "./IntervalDataSource";

export class ClientsIntervalDataSource extends IntervalDataSource<
  IClient[],
  {}
> {
  private _params = {};

  constructor(_clientsService: IClientsService) {
    super(async req => {
      console.log("req", req);
      const res = await _clientsService.getClients();

      return res.data || [];
    });
  }

  subscribe = (onData: (res: IClient[]) => void, timerInterval?: number) => {
    return super.subscribe(onData, timerInterval);
  };

  protected afterFetch(v: IClient[]) {
    return v;
  }

  protected beforeFetch() {}

  protected getParams(): {} {
    return this._params;
  }

  setParams(args: {}) {
    this._params = args;
  }
}
