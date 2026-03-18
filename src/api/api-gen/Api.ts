/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
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
  ApiResponseDto,
  AssignPeerParams,
  Base64URLString,
  GetPeerSpeedParams,
  GetPeerStatsParams,
  GetPeerTrafficParams,
  GetProfilesParams,
  GetServerSpeedParams,
  GetServerStatsParams,
  GetServerTrafficParams,
  GetUsersParams,
  IGenerateAuthenticationOptionsRequestDto,
  IProfileListDto,
  IProfileUpdateRequestDto,
  ISignInRequestDto,
  ITokensDto,
  IUserChangePasswordDto,
  IUserListDto,
  IUserLoginRequestDto,
  IUserPrivilegesRequestDto,
  IUserResetPasswordRequestDto,
  IUserUpdateRequestDto,
  IUserWithTokensDto,
  IVerifyAuthenticationRequestDto,
  IVerifyAuthenticationResponseDto,
  IVerifyRegistrationRequestDto,
  IVerifyRegistrationResponseDto,
  IWgPeerCreateRequestDto,
  IWgPeerListDto,
  IWgPeerStatsResponse,
  IWgPeerUpdateRequestDto,
  IWgServerCreateRequestDto,
  IWgServerListDto,
  IWgServerStatsResponse,
  IWgServerStatusDto,
  IWgServerUpdateRequestDto,
  ProfileDto,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RefreshPayload,
  TSignUpRequestDto,
  UserDto,
  WgPeerDto,
  WgServerDto,
  WgSpeedSampleDto,
  WgTrafficStatDto,
} from "./data-contracts";
import { EContentType, HttpClient, RequestParams } from "./http-client";

export class Api<
  E extends Error | AxiosError<EBody> = AxiosError<unknown>,
  EBody = unknown,
> extends HttpClient<E, EBody> {
  /**
   * @description Получить профиль текущего пользователя. Этот эндпоинт позволяет получить данные профиля пользователя, который выполнил запрос. Используется для получения информации о текущем пользователе, например, его имени, email, и других данных.
   *
   * @tags Profile
   * @name GetMyProfile
   * @summary Получение профиля текущего пользователя
   * @request GET:/api/profile/my
   * @secure
   */
  getMyProfile = (params: RequestParams = {}) =>
    this.request<ProfileDto, any>({
      url: `/api/profile/my`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Обновить профиль текущего пользователя. Этот эндпоинт позволяет пользователю обновить свои данные, такие как имя, email и другие параметры профиля.
   *
   * @tags Profile
   * @name UpdateMyProfile
   * @summary Обновление профиля текущего пользователя
   * @request PATCH:/api/profile/my/update
   * @secure
   */
  updateMyProfile = (
    data: IProfileUpdateRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<ProfileDto, any>({
      url: `/api/profile/my/update`,
      method: "PATCH",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Удалить профиль текущего пользователя. Этот эндпоинт позволяет пользователю удалить свой профиль из системы.
   *
   * @tags Profile
   * @name DeleteMyProfile
   * @summary Удаление профиля текущего пользователя
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
   * @description Получить все профили. Этот эндпоинт позволяет администраторам получить список всех пользователей системы. Он поддерживает пагинацию через параметры `offset` и `limit`.
   *
   * @tags Profile
   * @name GetProfiles
   * @summary Получение всех профилей
   * @request GET:/api/profile/all
   * @secure
   */
  getProfiles = (query: GetProfilesParams, params: RequestParams = {}) =>
    this.request<IProfileListDto, any>({
      url: `/api/profile/all`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * @description Получить профиль по ID. Этот эндпоинт позволяет получить профиль другого пользователя по его ID. Доступен только для администраторов.
   *
   * @tags Profile
   * @name GetProfileById
   * @summary Получение профиля по ID
   * @request GET:/api/profile/{userId}
   * @secure
   */
  getProfileById = (userId: string, params: RequestParams = {}) =>
    this.request<ProfileDto, any>({
      url: `/api/profile/${userId}`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Обновить профиль другого пользователя. Этот эндпоинт позволяет администраторам обновлять профиль других пользователей.
   *
   * @tags Profile
   * @name UpdateProfile
   * @summary Обновление профиля другого пользователя
   * @request PATCH:/api/profile/update/{userId}
   * @secure
   */
  updateProfile = (
    userId: string,
    data: IProfileUpdateRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<ProfileDto, any>({
      url: `/api/profile/update/${userId}`,
      method: "PATCH",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Удалить профиль другого пользователя. Этот эндпоинт позволяет администраторам удалить профиль другого пользователя из системы.
   *
   * @tags Profile
   * @name DeleteProfile
   * @summary Удаление профиля другого пользователя
   * @request DELETE:/api/profile/delete/{userId}
   * @secure
   */
  deleteProfile = (userId: string, params: RequestParams = {}) =>
    this.request<Base64URLString, any>({
      url: `/api/profile/delete/${userId}`,
      method: "DELETE",
      responseType: "json",
      ...params,
    });
  /**
   * @description Получить пользователя. Этот эндпоинт позволяет получить данные пользователя, который выполнил запрос.
   *
   * @tags User
   * @name GetMyUser
   * @summary Получение данных текущего пользователя
   * @request GET:/api/user/my
   * @secure
   */
  getMyUser = (params: RequestParams = {}) =>
    this.request<UserDto, any>({
      url: `/api/user/my`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Обновить пользователя. Этот эндпоинт позволяет пользователю обновить свои данные, такие как email, телефон и другие параметры пользователя.
   *
   * @tags User
   * @name UpdateMyUser
   * @summary Обновление данных текущего пользователя
   * @request PATCH:/api/user/my/update
   * @secure
   */
  updateMyUser = (data: IUserUpdateRequestDto, params: RequestParams = {}) =>
    this.request<UserDto, any>({
      url: `/api/user/my/update`,
      method: "PATCH",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Удалить текущего пользователя. Этот эндпоинт позволяет удалить пользователя из системы.
   *
   * @tags User
   * @name DeleteMyUser
   * @summary Удаление текущего пользователя
   * @request DELETE:/api/user/my/delete
   * @secure
   */
  deleteMyUser = (params: RequestParams = {}) =>
    this.request<boolean, any>({
      url: `/api/user/my/delete`,
      method: "DELETE",
      responseType: "json",
      ...params,
    });
  /**
   * @description Получить всех пользователей. Этот эндпоинт позволяет администраторам получить список всех пользователей системы. Он поддерживает пагинацию через параметры `offset` и `limit`.
   *
   * @tags User
   * @name GetUsers
   * @summary Получение всех пользователей
   * @request GET:/api/user/all
   * @secure
   */
  getUsers = (query: GetUsersParams, params: RequestParams = {}) =>
    this.request<IUserListDto, any>({
      url: `/api/user/all`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * @description Получить пользователя по ID. Этот эндпоинт позволяет получить пользователя по его ID. Доступен только для администраторов.
   *
   * @tags User
   * @name GetUserById
   * @summary Получение пользователя по ID
   * @request GET:/api/user/{id}
   * @secure
   */
  getUserById = (id: string, params: RequestParams = {}) =>
    this.request<UserDto, any>({
      url: `/api/user/${id}`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Установить привилегии для пользователя. Этот эндпоинт позволяет администраторам устанавливать роль и права пользователя.
   *
   * @tags User
   * @name SetPrivileges
   * @summary Установка привилегий для пользователя
   * @request PATCH:/api/user/setPrivileges/{id}
   * @secure
   */
  setPrivileges = (
    id: string,
    data: IUserPrivilegesRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<UserDto, any>({
      url: `/api/user/setPrivileges/${id}`,
      method: "PATCH",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Запросить подтверждение email-адреса для текущего пользователя. Этот эндпоинт позволяет отправить пользователю письмо для подтверждения его email-адреса.
   *
   * @tags User
   * @name RequestVerifyEmail
   * @summary Запрос подтверждения email
   * @request POST:/api/user/requestVerifyEmail
   * @secure
   */
  requestVerifyEmail = (params: RequestParams = {}) =>
    this.request<boolean, any>({
      url: `/api/user/requestVerifyEmail`,
      method: "POST",
      responseType: "json",
      ...params,
    });
  /**
   * @description Подтвердить email-адрес текущего пользователя по коду. Этот эндпоинт позволяет пользователю подтвердить свой email, используя код, полученный в письме.
   *
   * @tags User
   * @name VerifyEmail
   * @summary Подтверждение email-адреса
   * @request GET:/api/user/verifyEmail/{code}
   * @secure
   */
  verifyEmail = (code: string, params: RequestParams = {}) =>
    this.request<ApiResponseDto, any>({
      url: `/api/user/verifyEmail/${code}`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Обновить пользователя. Этот эндпоинт позволяет администраторам обновлять других пользователей.
   *
   * @tags User
   * @name UpdateUser
   * @summary Обновление другого пользователя
   * @request PATCH:/api/user/update/{id}
   * @secure
   */
  updateUser = (
    id: string,
    data: IUserUpdateRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<UserDto, any>({
      url: `/api/user/update/${id}`,
      method: "PATCH",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Изменить пароль текущего пользователя. Этот эндпоинт позволяет пользователю изменить свой пароль.
   *
   * @tags User
   * @name ChangePassword
   * @summary Изменение пароля
   * @request POST:/api/user/changePassword
   * @secure
   */
  changePassword = (data: IUserChangePasswordDto, params: RequestParams = {}) =>
    this.request<ApiResponseDto, any>({
      url: `/api/user/changePassword`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Удалить другого пользователя. Этот эндпоинт позволяет администраторам удалить другого пользователя из системы.
   *
   * @tags User
   * @name DeleteUser
   * @summary Удаление другого пользователя
   * @request DELETE:/api/user/delete/{id}
   * @secure
   */
  deleteUser = (id: string, params: RequestParams = {}) =>
    this.request<boolean, any>({
      url: `/api/user/delete/${id}`,
      method: "DELETE",
      responseType: "json",
      ...params,
    });
  /**
   * @description Регистрация нового пользователя
   *
   * @tags Authorization
   * @name SignUp
   * @summary Регистрация
   * @request POST:/api/auth/sign-up
   */
  signUp = (data: TSignUpRequestDto, params: RequestParams = {}) =>
    this.request<IUserWithTokensDto, any>({
      url: `/api/auth/sign-up`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Авторизация пользователя
   *
   * @tags Authorization
   * @name SignIn
   * @summary Вход в систему
   * @request POST:/api/auth/sign-in
   */
  signIn = (data: ISignInRequestDto, params: RequestParams = {}) =>
    this.request<IUserWithTokensDto, any>({
      url: `/api/auth/sign-in`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Запрос на сброс пароля
   *
   * @tags Authorization
   * @name RequestResetPassword
   * @summary Запрос сброса пароля
   * @request POST:/api/auth/request-reset-password
   */
  requestResetPassword = (
    data: IUserLoginRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseDto, any>({
      url: `/api/auth/request-reset-password`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Сброс пароля
   *
   * @tags Authorization
   * @name ResetPassword
   * @summary Смена пароля
   * @request POST:/api/auth/reset-password
   */
  resetPassword = (
    data: IUserResetPasswordRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseDto, any>({
      url: `/api/auth/reset-password`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Обновление токенов доступа
   *
   * @tags Authorization
   * @name Refresh
   * @summary Обновление токенов
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
   * @description Генерирует параметры для регистрации нового passkey. Требует авторизации — passkey привязывается к текущему пользователю.
   *
   * @tags Passkeys
   * @name GenerateRegistrationOptions
   * @summary Параметры регистрации passkey
   * @request POST:/api/passkeys/generate-registration-options
   * @secure
   */
  generateRegistrationOptions = (params: RequestParams = {}) =>
    this.request<PublicKeyCredentialCreationOptionsJSON, any>({
      url: `/api/passkeys/generate-registration-options`,
      method: "POST",
      responseType: "json",
      ...params,
    });
  /**
   * @description Верифицирует ответ устройства и сохраняет passkey для текущего пользователя.
   *
   * @tags Passkeys
   * @name VerifyRegistration
   * @summary Верификация регистрации passkey
   * @request POST:/api/passkeys/verify-registration
   * @secure
   */
  verifyRegistration = (
    data: IVerifyRegistrationRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<IVerifyRegistrationResponseDto, any>({
      url: `/api/passkeys/verify-registration`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Генерирует параметры для аутентификации по passkey. Принимает login (email или телефон) пользователя.
   *
   * @tags Passkeys
   * @name GenerateAuthenticationOptions
   * @summary Параметры аутентификации passkey
   * @request POST:/api/passkeys/generate-authentication-options
   */
  generateAuthenticationOptions = (
    data: IGenerateAuthenticationOptionsRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<PublicKeyCredentialRequestOptionsJSON, any>({
      url: `/api/passkeys/generate-authentication-options`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Верифицирует ответ устройства и возвращает токены при успехе.
   *
   * @tags Passkeys
   * @name VerifyAuthentication
   * @summary Аутентификация по passkey
   * @request POST:/api/passkeys/verify-authentication
   */
  verifyAuthentication = (
    data: IVerifyAuthenticationRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<IVerifyAuthenticationResponseDto, any>({
      url: `/api/passkeys/verify-authentication`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description List all peers for a given server.
   *
   * @tags WireGuard Peers
   * @name GetPeersByServer
   * @summary Get peers by server
   * @request GET:/api/wg/servers/{serverId}/peers
   * @secure
   */
  getPeersByServer = (serverId: string, params: RequestParams = {}) =>
    this.request<IWgPeerListDto, any>({
      url: `/api/wg/servers/${serverId}/peers`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Create a new peer on a server. Keys are auto-generated. Peer is applied to live interface if server is up.
   *
   * @tags WireGuard Peers
   * @name CreatePeer
   * @summary Create peer
   * @request POST:/api/wg/servers/{serverId}/peers
   * @secure
   */
  createPeer = (
    serverId: string,
    data: IWgPeerCreateRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<WgPeerDto, any>({
      url: `/api/wg/servers/${serverId}/peers`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Get all peers owned by the current user.
   *
   * @tags WireGuard Peers
   * @name GetMyPeers
   * @summary Get my peers
   * @request GET:/api/wg/peers/my
   * @secure
   */
  getMyPeers = (params: RequestParams = {}) =>
    this.request<IWgPeerListDto, any>({
      url: `/api/wg/peers/my`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Get all peers for a user (admin only).
   *
   * @tags WireGuard Peers
   * @name GetPeersByUser
   * @summary Get peers by user
   * @request GET:/api/wg/peers/user/{userId}
   * @secure
   */
  getPeersByUser = (userId: string, params: RequestParams = {}) =>
    this.request<IWgPeerListDto, any>({
      url: `/api/wg/peers/user/${userId}`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Get a peer by ID.
   *
   * @tags WireGuard Peers
   * @name GetPeer
   * @summary Get peer
   * @request GET:/api/wg/peers/{id}
   * @secure
   */
  getPeer = (id: string, params: RequestParams = {}) =>
    this.request<WgPeerDto, any>({
      url: `/api/wg/peers/${id}`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Update a peer.
   *
   * @tags WireGuard Peers
   * @name UpdatePeer
   * @summary Update peer
   * @request PATCH:/api/wg/peers/{id}
   * @secure
   */
  updatePeer = (
    id: string,
    data: IWgPeerUpdateRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<WgPeerDto, any>({
      url: `/api/wg/peers/${id}`,
      method: "PATCH",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Delete a peer. Peer is removed from live interface if server is up.
   *
   * @tags WireGuard Peers
   * @name DeletePeer
   * @summary Delete peer
   * @request DELETE:/api/wg/peers/{id}
   * @secure
   */
  deletePeer = (id: string, params: RequestParams = {}) =>
    this.request<boolean, any>({
      url: `/api/wg/peers/${id}`,
      method: "DELETE",
      responseType: "json",
      ...params,
    });
  /**
   * @description Start a peer (add to live WG interface, status → UP).
   *
   * @tags WireGuard Peers
   * @name StartPeer
   * @summary Start peer
   * @request POST:/api/wg/peers/{id}/start
   * @secure
   */
  startPeer = (id: string, params: RequestParams = {}) =>
    this.request<WgPeerDto, any>({
      url: `/api/wg/peers/${id}/start`,
      method: "POST",
      responseType: "json",
      ...params,
    });
  /**
   * @description Stop a peer (remove from live WG interface, status → DOWN).
   *
   * @tags WireGuard Peers
   * @name StopPeer
   * @summary Stop peer
   * @request POST:/api/wg/peers/{id}/stop
   * @secure
   */
  stopPeer = (id: string, params: RequestParams = {}) =>
    this.request<WgPeerDto, any>({
      url: `/api/wg/peers/${id}/stop`,
      method: "POST",
      responseType: "json",
      ...params,
    });
  /**
   * @description Assign a peer to a user.
   *
   * @tags WireGuard Peers
   * @name AssignPeer
   * @summary Assign peer to user
   * @request POST:/api/wg/peers/{id}/assign
   * @secure
   */
  assignPeer = (
    { id, ...query }: AssignPeerParams,
    params: RequestParams = {},
  ) =>
    this.request<WgPeerDto, any>({
      url: `/api/wg/peers/${id}/assign`,
      method: "POST",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * @description Revoke peer from its current user.
   *
   * @tags WireGuard Peers
   * @name RevokePeer
   * @summary Revoke peer from user
   * @request POST:/api/wg/peers/{id}/revoke
   * @secure
   */
  revokePeer = (id: string, params: RequestParams = {}) =>
    this.request<WgPeerDto, any>({
      url: `/api/wg/peers/${id}/revoke`,
      method: "POST",
      responseType: "json",
      ...params,
    });
  /**
   * @description Rotate (regenerate) preshared key for a peer.
   *
   * @tags WireGuard Peers
   * @name RotatePresharedKey
   * @summary Rotate preshared key
   * @request POST:/api/wg/peers/{id}/rotate-psk
   * @secure
   */
  rotatePresharedKey = (id: string, params: RequestParams = {}) =>
    this.request<WgPeerDto, any>({
      url: `/api/wg/peers/${id}/rotate-psk`,
      method: "POST",
      responseType: "json",
      ...params,
    });
  /**
   * @description Remove preshared key from a peer.
   *
   * @tags WireGuard Peers
   * @name RemovePresharedKey
   * @summary Remove preshared key
   * @request DELETE:/api/wg/peers/{id}/psk
   * @secure
   */
  removePresharedKey = (id: string, params: RequestParams = {}) =>
    this.request<WgPeerDto, any>({
      url: `/api/wg/peers/${id}/psk`,
      method: "DELETE",
      responseType: "json",
      ...params,
    });
  /**
   * @description Download the WireGuard client .conf file for this peer.
   *
   * @tags WireGuard Peers
   * @name GetPeerConfig
   * @summary Get peer config file
   * @request GET:/api/wg/peers/{id}/config
   * @secure
   */
  getPeerConfig = (id: string, params: RequestParams = {}) =>
    this.request<Base64URLString, any>({
      url: `/api/wg/peers/${id}/config`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Get QR code PNG image for the client config. Returns base64-encoded PNG data URL.
   *
   * @tags WireGuard Peers
   * @name GetPeerQrCode
   * @summary Get peer QR code
   * @request GET:/api/wg/peers/{id}/qr
   * @secure
   */
  getPeerQrCode = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        dataUrl: string;
      },
      any
    >({
      url: `/api/wg/peers/${id}/qr`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description List all WireGuard servers.
   *
   * @tags WireGuard Servers
   * @name GetServers
   * @summary Get all servers
   * @request GET:/api/wg/servers
   * @secure
   */
  getServers = (params: RequestParams = {}) =>
    this.request<IWgServerListDto, any>({
      url: `/api/wg/servers`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Create a new WireGuard server. Keys are generated automatically. The config file is written to the WG config directory.
   *
   * @tags WireGuard Servers
   * @name CreateServer
   * @summary Create server
   * @request POST:/api/wg/servers
   * @secure
   */
  createServer = (
    data: IWgServerCreateRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<WgServerDto, any>({
      url: `/api/wg/servers`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Get a WireGuard server by ID.
   *
   * @tags WireGuard Servers
   * @name GetServer
   * @summary Get server by ID
   * @request GET:/api/wg/servers/{id}
   * @secure
   */
  getServer = (id: string, params: RequestParams = {}) =>
    this.request<WgServerDto, any>({
      url: `/api/wg/servers/${id}`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Update a WireGuard server. Config file is rewritten automatically.
   *
   * @tags WireGuard Servers
   * @name UpdateServer
   * @summary Update server
   * @request PATCH:/api/wg/servers/{id}
   * @secure
   */
  updateServer = (
    id: string,
    data: IWgServerUpdateRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<WgServerDto, any>({
      url: `/api/wg/servers/${id}`,
      method: "PATCH",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Delete a WireGuard server. Stops the interface and removes the config file.
   *
   * @tags WireGuard Servers
   * @name DeleteServer
   * @summary Delete server
   * @request DELETE:/api/wg/servers/{id}
   * @secure
   */
  deleteServer = (id: string, params: RequestParams = {}) =>
    this.request<boolean, any>({
      url: `/api/wg/servers/${id}`,
      method: "DELETE",
      responseType: "json",
      ...params,
    });
  /**
   * @description Start a WireGuard interface (wg-quick up).
   *
   * @tags WireGuard Servers
   * @name StartServer
   * @summary Start server
   * @request POST:/api/wg/servers/{id}/start
   * @secure
   */
  startServer = (id: string, params: RequestParams = {}) =>
    this.request<WgServerDto, any>({
      url: `/api/wg/servers/${id}/start`,
      method: "POST",
      responseType: "json",
      ...params,
    });
  /**
   * @description Stop a WireGuard interface (wg-quick down).
   *
   * @tags WireGuard Servers
   * @name StopServer
   * @summary Stop server
   * @request POST:/api/wg/servers/{id}/stop
   * @secure
   */
  stopServer = (id: string, params: RequestParams = {}) =>
    this.request<WgServerDto, any>({
      url: `/api/wg/servers/${id}/stop`,
      method: "POST",
      responseType: "json",
      ...params,
    });
  /**
   * @description Restart a WireGuard interface.
   *
   * @tags WireGuard Servers
   * @name RestartServer
   * @summary Restart server
   * @request POST:/api/wg/servers/{id}/restart
   * @secure
   */
  restartServer = (id: string, params: RequestParams = {}) =>
    this.request<WgServerDto, any>({
      url: `/api/wg/servers/${id}/restart`,
      method: "POST",
      responseType: "json",
      ...params,
    });
  /**
   * @description Get real-time status of a WireGuard interface. Queries the actual wg interface, not cached DB status.
   *
   * @tags WireGuard Servers
   * @name GetServerStatus
   * @summary Get live server status
   * @request GET:/api/wg/servers/{id}/status
   * @secure
   */
  getServerStatus = (id: string, params: RequestParams = {}) =>
    this.request<IWgServerStatusDto, any>({
      url: `/api/wg/servers/${id}/status`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Get traffic history for a specific peer.
   *
   * @tags WireGuard Statistics
   * @name GetPeerTraffic
   * @summary Peer traffic history
   * @request GET:/api/wg/statistics/peers/{peerId}/traffic
   * @secure
   */
  getPeerTraffic = (
    { peerId, ...query }: GetPeerTrafficParams,
    params: RequestParams = {},
  ) =>
    this.request<WgTrafficStatDto[], any>({
      url: `/api/wg/statistics/peers/${peerId}/traffic`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * @description Get speed samples for a specific peer.
   *
   * @tags WireGuard Statistics
   * @name GetPeerSpeed
   * @summary Peer speed history
   * @request GET:/api/wg/statistics/peers/{peerId}/speed
   * @secure
   */
  getPeerSpeed = (
    { peerId, ...query }: GetPeerSpeedParams,
    params: RequestParams = {},
  ) =>
    this.request<WgSpeedSampleDto[], any>({
      url: `/api/wg/statistics/peers/${peerId}/speed`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * @description Get combined latest stats + history for a peer.
   *
   * @tags WireGuard Statistics
   * @name GetPeerStats
   * @summary Peer full stats
   * @request GET:/api/wg/statistics/peers/{peerId}
   * @secure
   */
  getPeerStats = (
    { peerId, ...query }: GetPeerStatsParams,
    params: RequestParams = {},
  ) =>
    this.request<IWgPeerStatsResponse, any>({
      url: `/api/wg/statistics/peers/${peerId}`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * @description Get traffic history for a server (all peers aggregated).
   *
   * @tags WireGuard Statistics
   * @name GetServerTraffic
   * @summary Server traffic history
   * @request GET:/api/wg/statistics/servers/{serverId}/traffic
   * @secure
   */
  getServerTraffic = (
    { serverId, ...query }: GetServerTrafficParams,
    params: RequestParams = {},
  ) =>
    this.request<WgTrafficStatDto[], any>({
      url: `/api/wg/statistics/servers/${serverId}/traffic`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * @description Get speed history for a server.
   *
   * @tags WireGuard Statistics
   * @name GetServerSpeed
   * @summary Server speed history
   * @request GET:/api/wg/statistics/servers/{serverId}/speed
   * @secure
   */
  getServerSpeed = (
    { serverId, ...query }: GetServerSpeedParams,
    params: RequestParams = {},
  ) =>
    this.request<WgSpeedSampleDto[], any>({
      url: `/api/wg/statistics/servers/${serverId}/speed`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * @description Get combined stats for a server.
   *
   * @tags WireGuard Statistics
   * @name GetServerStats
   * @summary Server full stats
   * @request GET:/api/wg/statistics/servers/{serverId}
   * @secure
   */
  getServerStats = (
    { serverId, ...query }: GetServerStatsParams,
    params: RequestParams = {},
  ) =>
    this.request<IWgServerStatsResponse, any>({
      url: `/api/wg/statistics/servers/${serverId}`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
}
