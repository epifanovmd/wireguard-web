import { IntervalDataSource } from "@force-dev/utils";

import { IClient, IClientsService } from "~@service";

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

  afterFetch(v: IClient[]) {
    return v;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeFetch() {}

  getParams(): {} {
    return this._params;
  }

  setParams(args: {}) {
    this._params = args;
  }
}
