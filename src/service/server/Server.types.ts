import { ApiResponse, CancelablePromise, iocDecorator } from "@force-dev/utils";

import { ListResponse } from "~@api";

import { IClient } from "../client";
import { IProfile } from "../profile";

export interface IServer {
  id: string;
  profileId: string;
  name: string;
  privateKey: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  clients?: IClient[];
  profile: IProfile;
}

export type TServersResponse = IServer[];

export interface IServerResponse extends IServer {}

export interface ICreateServerRequest {
  name: string;
}

export const IServerService = iocDecorator<IServerService>();

export interface IServerService {
  getServers(): CancelablePromise<ApiResponse<ListResponse<TServersResponse>>>;

  getServer(serverId: string): CancelablePromise<ApiResponse<IServerResponse>>;

  createServer(
    params: ICreateServerRequest,
  ): CancelablePromise<ApiResponse<IServerResponse>>;

  deleteServer(ServerId: string): CancelablePromise<ApiResponse<string>>;
}
