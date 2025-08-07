import { IntervalDataSource } from "@force-dev/utils";

import { IApiService } from "~@api";
import { IWgClientsDto } from "~@api/api-gen/data-contracts";

export class ClientsIntervalDataSource extends IntervalDataSource<
  IWgClientsDto[],
  { serverId?: string }
> {
  private _params = {};

  constructor(_getWgClients: IApiService["getWgClients"]) {
    super(async req => {
      if (req.serverId) {
        const res = await _getWgClients({ serverId: req.serverId });

        return res.data?.data || [];
      }

      return [];
    });
  }

  afterFetch(v: IWgClientsDto[]) {
    return v;
  }

  beforeFetch() {}

  getParams() {
    return this._params;
  }

  setParams(args: { serverId: string }) {
    this._params = args;
  }
}
