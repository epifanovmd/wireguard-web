import { IntervalDataSource } from "@force-dev/utils";

import { IClient, IClientsService } from "~@service";

export class ClientsIntervalDataSource extends IntervalDataSource<
  IClient[],
  { serverId?: string }
> {
  private _params = {};

  constructor(_clientsService: IClientsService) {
    super(async req => {
      if (req.serverId) {
        const res = await _clientsService.getClients(req.serverId);

        return res.data?.data || [];
      }

      return [];
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

  setParams(args: { serverId: string }) {
    this._params = args;
  }
}
