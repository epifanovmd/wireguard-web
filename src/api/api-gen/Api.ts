/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import type { AxiosError } from "axios";
import {
  Base64URLString,
  CheckStatusParams,
  CreateWgServerPayload,
  GenerateAuthenticationOptionsPayload,
  GenerateRegistrationOptionsPayload,
  GetAllProfilesParams,
  GetWgClientsParams,
  GetWgServersParams,
  IProfileDto,
  IProfileListDto,
  IProfilePrivilegesRequest,
  IProfileUpdateRequest,
  IProfileWithTokensDto,
  ISignInRequest,
  ISignUpRequest,
  ITokensDto,
  IVerifyAuthenticationRequest,
  IVerifyAuthenticationResponse,
  IVerifyRegistrationRequest,
  IWgClientCreateRequest,
  IWgClientListDto,
  IWgClientsDto,
  IWgClientUpdateRequest,
  IWgServerDto,
  IWgServersListDto,
  IWireguardPeerStatus,
  PublicKeyCredentialRequestOptionsJSON,
  RefreshPayload,
} from "./data-contracts";
import { EContentType, HttpClient, RequestParams } from "./http-client";

export class Api<E extends Error | AxiosError<EBody> = AxiosError<unknown>, EBody = unknown> extends HttpClient<
  E,
  EBody
> {
  /**
   * No description
   *
   * @tags Profile
   * @name GetMyProfile
   * @request GET:/api/profile/my
   * @secure
   */
  getMyProfile = (params: RequestParams = {}) =>
    this.request<IProfileDto, any>({
      url: `/api/profile/my`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Profile
   * @name UpdateMyProfile
   * @request PATCH:/api/profile/my/update
   * @secure
   */
  updateMyProfile = (data: IProfileUpdateRequest, params: RequestParams = {}) =>
    this.request<IProfileDto, any>({
      url: `/api/profile/my/update`,
      method: "PATCH",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Profile
   * @name DeleteMyProfile
   * @request DELETE:/api/profile/my/delete
   * @secure
   */
  deleteMyProfile = (params: RequestParams = {}) =>
    this.request<Base64URLString, any>({
      url: `/api/profile/my/delete`,
      method: "DELETE",
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Profile
   * @name GetAllProfiles
   * @request GET:/api/profile/all
   * @secure
   */
  getAllProfiles = (query: GetAllProfilesParams, params: RequestParams = {}) =>
    this.request<IProfileListDto, any>({
      url: `/api/profile/all`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Profile
   * @name GetProfileById
   * @request GET:/api/profile/{id}
   * @secure
   */
  getProfileById = (id: string, params: RequestParams = {}) =>
    this.request<IProfileDto, any>({
      url: `/api/profile/${id}`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Profile
   * @name SetPrivileges
   * @request PATCH:/api/profile/setPrivileges/{id}
   * @secure
   */
  setPrivileges = (id: string, data: IProfilePrivilegesRequest, params: RequestParams = {}) =>
    this.request<IProfileDto, any>({
      url: `/api/profile/setPrivileges/${id}`,
      method: "PATCH",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Profile
   * @name UpdateProfile
   * @request PATCH:/api/profile/update/{id}
   * @secure
   */
  updateProfile = (id: string, data: IProfileUpdateRequest, params: RequestParams = {}) =>
    this.request<IProfileDto, any>({
      url: `/api/profile/update/${id}`,
      method: "PATCH",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Profile
   * @name DeleteProfile
   * @request DELETE:/api/profile/delete/{id}
   * @secure
   */
  deleteProfile = (id: string, params: RequestParams = {}) =>
    this.request<Base64URLString, any>({
      url: `/api/profile/delete/${id}`,
      method: "DELETE",
      responseType: "json",
      ...params,
    });
  /**
   * @description Endpoint description
   *
   * @tags Authorization
   * @name SignUp
   * @summary Endpoint summary.
   * @request POST:/api/auth/signUp
   */
  signUp = (data: ISignUpRequest, params: RequestParams = {}) =>
    this.request<IProfileWithTokensDto, any>({
      url: `/api/auth/signUp`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Authorization
   * @name SignIn
   * @request POST:/api/auth/signIn
   */
  signIn = (data: ISignInRequest, params: RequestParams = {}) =>
    this.request<IProfileWithTokensDto, any>({
      url: `/api/auth/signIn`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Authorization
   * @name Refresh
   * @request POST:/api/auth/refresh
   */
  refresh = (data: RefreshPayload, params: RequestParams = {}) =>
    this.request<ITokensDto, any>({
      url: `/api/auth/refresh`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Passkeys
   * @name GenerateRegistrationOptions
   * @request POST:/api/passkeys/generate-registration-options
   */
  generateRegistrationOptions = (data: GenerateRegistrationOptionsPayload, params: RequestParams = {}) =>
    this.request<PublicKeyCredentialRequestOptionsJSON, any>({
      url: `/api/passkeys/generate-registration-options`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Passkeys
   * @name VerifyRegistration
   * @request POST:/api/passkeys/verify-registration
   */
  verifyRegistration = (data: IVerifyRegistrationRequest, params: RequestParams = {}) =>
    this.request<
      {
        verified: boolean;
      },
      any
    >({
      url: `/api/passkeys/verify-registration`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Passkeys
   * @name GenerateAuthenticationOptions
   * @request POST:/api/passkeys/generate-authentication-options
   */
  generateAuthenticationOptions = (data: GenerateAuthenticationOptionsPayload, params: RequestParams = {}) =>
    this.request<PublicKeyCredentialRequestOptionsJSON, any>({
      url: `/api/passkeys/generate-authentication-options`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Passkeys
   * @name VerifyAuthentication
   * @request POST:/api/passkeys/verify-authentication
   */
  verifyAuthentication = (data: IVerifyAuthenticationRequest, params: RequestParams = {}) =>
    this.request<IVerifyAuthenticationResponse, any>({
      url: `/api/passkeys/verify-authentication`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Wireguard
   * @name StartVpn
   * @request GET:/api/wireguard/start/{interfaceName}
   * @secure
   */
  startVpn = (interfaceName: string, params: RequestParams = {}) =>
    this.request<void, any>({
      url: `/api/wireguard/start/${interfaceName}`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Wireguard
   * @name StopVpn
   * @request GET:/api/wireguard/stop/{interfaceName}
   * @secure
   */
  stopVpn = (interfaceName: string, params: RequestParams = {}) =>
    this.request<boolean, any>({
      url: `/api/wireguard/stop/${interfaceName}`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Wireguard
   * @name CheckStatus
   * @request GET:/api/wireguard/status/{interfaceName}
   * @secure
   */
  checkStatus = ({ interfaceName, ...query }: CheckStatusParams, params: RequestParams = {}) =>
    this.request<IWireguardPeerStatus | null, any>({
      url: `/api/wireguard/status/${interfaceName}`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags WgServer
   * @name StartServer
   * @request GET:/api/wgserver/server/{id}/start
   * @secure
   */
  startServer = (id: string, params: RequestParams = {}) =>
    this.request<void, any>({
      url: `/api/wgserver/server/${id}/start`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags WgServer
   * @name StopServer
   * @request GET:/api/wgserver/server/{id}/stop
   * @secure
   */
  stopServer = (id: string, params: RequestParams = {}) =>
    this.request<void, any>({
      url: `/api/wgserver/server/${id}/stop`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags WgServer
   * @name GetServerStatus
   * @request GET:/api/wgserver/server/{id}/status
   * @secure
   */
  getServerStatus = (id: string, params: RequestParams = {}) =>
    this.request<string | null, any>({
      url: `/api/wgserver/server/${id}/status`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags WgServer
   * @name GetWgServers
   * @request GET:/api/wgserver
   * @secure
   */
  getWgServers = (query: GetWgServersParams, params: RequestParams = {}) =>
    this.request<IWgServersListDto, any>({
      url: `/api/wgserver`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags WgServer
   * @name GetWgServer
   * @request GET:/api/wgserver/server/{id}
   * @secure
   */
  getWgServer = (id: string, params: RequestParams = {}) =>
    this.request<IWgServerDto, any>({
      url: `/api/wgserver/server/${id}`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags WgServer
   * @name CreateWgServer
   * @request POST:/api/wgserver/create
   * @secure
   */
  createWgServer = (data: CreateWgServerPayload, params: RequestParams = {}) =>
    this.request<IWgServerDto, any>({
      url: `/api/wgserver/create`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags WgServer
   * @name DeleteWgServer
   * @request DELETE:/api/wgserver/delete/{id}
   * @secure
   */
  deleteWgServer = (id: string, params: RequestParams = {}) =>
    this.request<Base64URLString, any>({
      url: `/api/wgserver/delete/${id}`,
      method: "DELETE",
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags WgClient
   * @name GetWgClients
   * @request GET:/api/wgclients/server/{serverId}
   * @secure
   */
  getWgClients = ({ serverId, ...query }: GetWgClientsParams, params: RequestParams = {}) =>
    this.request<IWgClientListDto, any>({
      url: `/api/wgclients/server/${serverId}`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags WgClient
   * @name GetWgClient
   * @request GET:/api/wgclients/client/{id}
   * @secure
   */
  getWgClient = (id: string, params: RequestParams = {}) =>
    this.request<IWgClientsDto, any>({
      url: `/api/wgclients/client/${id}`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags WgClient
   * @name GetWgClientConfiguration
   * @request GET:/api/wgclients/client/{id}/configuration
   * @secure
   */
  getWgClientConfiguration = (id: string, params: RequestParams = {}) =>
    this.request<Base64URLString, any>({
      url: `/api/wgclients/client/${id}/configuration`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags WgClient
   * @name CreateWgClient
   * @request POST:/api/wgclients/create
   * @secure
   */
  createWgClient = (data: IWgClientCreateRequest, params: RequestParams = {}) =>
    this.request<IWgClientsDto, any>({
      url: `/api/wgclients/create`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags WgClient
   * @name UpdateWgClient
   * @request PATCH:/api/wgclients/update/{id}
   * @secure
   */
  updateWgClient = (id: string, data: IWgClientUpdateRequest, params: RequestParams = {}) =>
    this.request<IWgClientsDto, any>({
      url: `/api/wgclients/update/${id}`,
      method: "PATCH",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags WgClient
   * @name DeleteWgClient
   * @request DELETE:/api/wgclients/delete/{id}
   * @secure
   */
  deleteWgClient = (id: string, params: RequestParams = {}) =>
    this.request<Base64URLString, any>({
      url: `/api/wgclients/delete/${id}`,
      method: "DELETE",
      responseType: "json",
      ...params,
    });
}
