import { ApiResponse, CancelablePromise, iocDecorator } from "@force-dev/utils";

import { ApiError, ListResponse } from "~@api";

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
  getServers(): CancelablePromise<
    ApiResponse<ListResponse<TServersResponse>, ApiError>
  >;

  getServer(
    serverId: string,
  ): CancelablePromise<ApiResponse<IServerResponse, ApiError>>;

  createServer(
    params: ICreateServerRequest,
  ): CancelablePromise<ApiResponse<IServerResponse, ApiError>>;

  deleteServer(
    serverId: string,
  ): CancelablePromise<ApiResponse<string, ApiError>>;

  getStatus(serverId: string): CancelablePromise<ApiResponse<string, ApiError>>;

  serverStart(serverId: string): CancelablePromise<ApiResponse<void, ApiError>>;

  serverStop(serverId: string): CancelablePromise<ApiResponse<void, ApiError>>;
}
