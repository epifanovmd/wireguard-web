import { ApiResponse, CancelablePromise, iocDecorator } from "@force-dev/utils";

import { ApiError, ListResponse } from "~@api";

import { IProfile } from "../profile";
import { IServer } from "../server";

export interface IClient {
  id: string;
  serverId: string;
  profileId: string;
  name: string;
  address: string;
  allowedIPs?: string;
  publicKey: string;
  privateKey: string;
  preSharedKey: string;
  transferRx?: number;
  transferTx?: number;
  latestHandshakeAt?: string;
  persistentKeepalive?: number;
  enabled?: boolean;
  createdAt: string;
  updatedAt: string;
  profile: IProfile;
  server: IServer;
}

export type TClientsResponse = IClient[];

export interface IClientResponse extends IClient {}

export interface ICreateClientRequest {
  serverId: string;
  name: string;
  allowedIPs?: string;
  persistentKeepalive?: number;
  enabled?: boolean;
}

export interface IUpdateClientRequest
  extends Partial<Omit<ICreateClientRequest, "serverId">> {}

export const IClientsService = iocDecorator<IClientsService>();

export interface IClientsService {
  getClients(
    serverId: string,
  ): CancelablePromise<ApiResponse<ListResponse<TClientsResponse>, ApiError>>;

  getClient(
    clientId: string,
  ): CancelablePromise<ApiResponse<IClientResponse, ApiError>>;

  getClientConfiguration(
    clientId: string,
  ): CancelablePromise<ApiResponse<string, ApiError>>;

  createClient(
    params: ICreateClientRequest,
  ): CancelablePromise<ApiResponse<IClientResponse, ApiError>>;

  updateClient(
    clientId: string,
    params: IUpdateClientRequest,
  ): CancelablePromise<ApiResponse<IClientResponse, ApiError>>;

  deleteClient(
    clientId: string,
  ): CancelablePromise<ApiResponse<string, ApiError>>;
}
