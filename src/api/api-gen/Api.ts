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

import {
  ApiResponseDto,
  AssignPeerParams,
  Base64URLString,
  CreatePeerParams,
  DeletePeerParams,
  DeleteProfileParams,
  DeleteServerParams,
  DeleteUserParams,
  GetOverviewStatsParams,
  GetPeerConfigParams,
  GetPeerCurrentParams,
  GetPeerParams,
  GetPeerQrCodeParams,
  GetPeersOptionsParams,
  GetPeersParams,
  GetPeerStatsParams,
  GetProfileByIdParams,
  GetProfilesParams,
  GetServerCurrentParams,
  GetServerOptionsParams,
  GetServerParams,
  GetServersParams,
  GetServerStatsParams,
  GetServerStatusParams,
  GetUserByIdParams,
  GetUserOptionsParams,
  GetUsersParams,
  IGenerateAuthenticationOptionsRequestDto,
  IProfileListDto,
  IProfileUpdateRequestDto,
  IRoleDto,
  IRolePermissionsRequestDto,
  ISignInRequestDto,
  ITokensDto,
  IUserChangePasswordDto,
  IUserListDto,
  IUserLoginRequestDto,
  IUserOptionsDto,
  IUserPrivilegesRequestDto,
  IUserResetPasswordRequestDto,
  IUserUpdateRequestDto,
  IUserWithTokensDto,
  IVerifyAuthenticationRequestDto,
  IVerifyAuthenticationResponseDto,
  IVerifyRegistrationRequestDto,
  IVerifyRegistrationResponseDto,
  IWgOverviewStatsResponse,
  IWgPeerCreateRequestDto,
  IWgPeerListDto,
  IWgPeerOptionsDto,
  IWgPeerUpdateRequestDto,
  IWgServerCreateRequestDto,
  IWgServerListDto,
  IWgServerOptionsDto,
  IWgServerStatusDto,
  IWgServerUpdateRequestDto,
  ProfileDto,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  PublicProfileDto,
  RefreshPayload,
  RemovePresharedKeyParams,
  RestartServerParams,
  RevokePeerParams,
  RotatePresharedKeyParams,
  SetPrivilegesParams,
  SetRolePermissionsParams,
  StartPeerParams,
  StartServerParams,
  StopPeerParams,
  StopServerParams,
  TSignUpRequestDto,
  UpdatePeerParams,
  UpdateProfileParams,
  UpdateServerParams,
  UpdateUserParams,
  UserDto,
  VerifyEmailParams,
  WgOverviewStatsPayload,
  WgPeerDto,
  WgPeerStatsPayload,
  WgServerDto,
  WgServerStatsPayload,
} from "./data-contracts";
import { EContentType, HttpClient, RequestParams } from "./http-client";

export class Api<E = unknown> extends HttpClient<E> {
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
    this.request<ProfileDto>({
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
    this.request<ProfileDto>({
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
    this.request<Base64URLString>({
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
    this.request<IProfileListDto>({
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
  getProfileById = (
    { userId, ...query }: GetProfileByIdParams,
    params: RequestParams = {},
  ) =>
    this.request<PublicProfileDto>({
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
    { userId, ...query }: UpdateProfileParams,
    data: IProfileUpdateRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<ProfileDto>({
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
  deleteProfile = (
    { userId, ...query }: DeleteProfileParams,
    params: RequestParams = {},
  ) =>
    this.request<Base64URLString>({
      url: `/api/profile/delete/${userId}`,
      method: "DELETE",
      responseType: "json",
      ...params,
    });
  /**
   * @description Получить все роли с их правами.
   *
   * @tags Role
   * @name GetRoles
   * @summary Список ролей
   * @request GET:/api/roles
   * @secure
   */
  getRoles = (params: RequestParams = {}) =>
    this.request<IRoleDto[]>({
      url: `/api/roles`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Установить права для роли. Заменяет текущий набор прав роли указанным.
   *
   * @tags Role
   * @name SetRolePermissions
   * @summary Установка прав роли
   * @request PATCH:/api/roles/{id}/permissions
   * @secure
   */
  setRolePermissions = (
    { id, ...query }: SetRolePermissionsParams,
    data: IRolePermissionsRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<IRoleDto>({
      url: `/api/roles/${id}/permissions`,
      method: "PATCH",
      data: data,
      type: EContentType.Json,
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
    this.request<UserDto>({
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
    this.request<UserDto>({
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
    this.request<boolean>({
      url: `/api/user/my/delete`,
      method: "DELETE",
      responseType: "json",
      ...params,
    });
  /**
   * @description Получить всех пользователей. Поддерживает пагинацию и поиск по email.
   *
   * @tags User
   * @name GetUsers
   * @summary Получение всех пользователей
   * @request GET:/api/user/all
   * @secure
   */
  getUsers = (query: GetUsersParams, params: RequestParams = {}) =>
    this.request<IUserListDto>({
      url: `/api/user/all`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * @description Получить опции пользователей для выпадающих списков (id + name). name — имя и фамилия или email если профиль не заполнен.
   *
   * @tags User
   * @name GetUserOptions
   * @summary Опции пользователей
   * @request GET:/api/user/options
   * @secure
   */
  getUserOptions = (query: GetUserOptionsParams, params: RequestParams = {}) =>
    this.request<IUserOptionsDto>({
      url: `/api/user/options`,
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
  getUserById = (
    { id, ...query }: GetUserByIdParams,
    params: RequestParams = {},
  ) =>
    this.request<UserDto>({
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
    { id, ...query }: SetPrivilegesParams,
    data: IUserPrivilegesRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<UserDto>({
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
    this.request<boolean>({
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
  verifyEmail = (
    { code, ...query }: VerifyEmailParams,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseDto>({
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
    { id, ...query }: UpdateUserParams,
    data: IUserUpdateRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<UserDto>({
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
    this.request<ApiResponseDto>({
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
  deleteUser = (
    { id, ...query }: DeleteUserParams,
    params: RequestParams = {},
  ) =>
    this.request<boolean>({
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
    this.request<IUserWithTokensDto>({
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
    this.request<IUserWithTokensDto>({
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
    this.request<ApiResponseDto>({
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
    this.request<ApiResponseDto>({
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
    this.request<ITokensDto>({
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
    this.request<PublicKeyCredentialCreationOptionsJSON>({
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
    this.request<IVerifyRegistrationResponseDto>({
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
    this.request<PublicKeyCredentialRequestOptionsJSON>({
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
    this.request<IVerifyAuthenticationResponseDto>({
      url: `/api/passkeys/verify-authentication`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Список всех пиров. Возвращает все пиры для wg:peer:view (с опциональным фильтром userId), собственные пиры для wg:peer:own.
   *
   * @tags WireGuard Peers
   * @name GetPeers
   * @summary Получить пиры
   * @request GET:/api/wg/peers
   * @secure
   */
  getPeers = (query: GetPeersParams, params: RequestParams = {}) =>
    this.request<IWgPeerListDto>({
      url: `/api/wg/peers`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * @description Получить варианты пиров для выпадающих списков. Возвращает все варианты для wg:peer:view, собственные для wg:peer:own.
   *
   * @tags WireGuard Peers
   * @name GetPeersOptions
   * @summary Получить варианты пиров
   * @request GET:/api/wg/peers/options
   * @secure
   */
  getPeersOptions = (
    query: GetPeersOptionsParams,
    params: RequestParams = {},
  ) =>
    this.request<IWgPeerOptionsDto>({
      url: `/api/wg/peers/options`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * @description Получить пир по ID. Проверка владельца для пользователей с wg:peer:own.
   *
   * @tags WireGuard Peers
   * @name GetPeer
   * @summary Получить пир
   * @request GET:/api/wg/peers/{id}
   * @secure
   */
  getPeer = ({ id, ...query }: GetPeerParams, params: RequestParams = {}) =>
    this.request<WgPeerDto>({
      url: `/api/wg/peers/${id}`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Обновить пир.
   *
   * @tags WireGuard Peers
   * @name UpdatePeer
   * @summary Обновить пир
   * @request PATCH:/api/wg/peers/{id}
   * @secure
   */
  updatePeer = (
    { id, ...query }: UpdatePeerParams,
    data: IWgPeerUpdateRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<WgPeerDto>({
      url: `/api/wg/peers/${id}`,
      method: "PATCH",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Удалить пир. Пир удаляется из активного интерфейса если сервер запущен.
   *
   * @tags WireGuard Peers
   * @name DeletePeer
   * @summary Удалить пир
   * @request DELETE:/api/wg/peers/{id}
   * @secure
   */
  deletePeer = (
    { id, ...query }: DeletePeerParams,
    params: RequestParams = {},
  ) =>
    this.request<boolean>({
      url: `/api/wg/peers/${id}`,
      method: "DELETE",
      responseType: "json",
      ...params,
    });
  /**
   * @description Создать новый пир на сервере. Ключи генерируются автоматически. Пир применяется к активному интерфейсу если сервер запущен.
   *
   * @tags WireGuard Peers
   * @name CreatePeer
   * @summary Создать пир
   * @request POST:/api/wg/servers/{serverId}/peers
   * @secure
   */
  createPeer = (
    { serverId, ...query }: CreatePeerParams,
    data: IWgPeerCreateRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<WgPeerDto>({
      url: `/api/wg/servers/${serverId}/peers`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Запустить пир (добавить в активный интерфейс WG, статус → UP). Требует чтобы пир был включён и сервер запущен.
   *
   * @tags WireGuard Peers
   * @name StartPeer
   * @summary Запустить пир
   * @request POST:/api/wg/peers/{id}/start
   * @secure
   */
  startPeer = ({ id, ...query }: StartPeerParams, params: RequestParams = {}) =>
    this.request<WgPeerDto>({
      url: `/api/wg/peers/${id}/start`,
      method: "POST",
      responseType: "json",
      ...params,
    });
  /**
   * @description Остановить пир (удалить из активного интерфейса WG, статус → DOWN).
   *
   * @tags WireGuard Peers
   * @name StopPeer
   * @summary Остановить пир
   * @request POST:/api/wg/peers/{id}/stop
   * @secure
   */
  stopPeer = ({ id, ...query }: StopPeerParams, params: RequestParams = {}) =>
    this.request<WgPeerDto>({
      url: `/api/wg/peers/${id}/stop`,
      method: "POST",
      responseType: "json",
      ...params,
    });
  /**
   * @description Назначить пир пользователю.
   *
   * @tags WireGuard Peers
   * @name AssignPeer
   * @summary Назначить пир пользователю
   * @request POST:/api/wg/peers/{id}/assign
   * @secure
   */
  assignPeer = (
    { id, ...query }: AssignPeerParams,
    params: RequestParams = {},
  ) =>
    this.request<WgPeerDto>({
      url: `/api/wg/peers/${id}/assign`,
      method: "POST",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * @description Отозвать пир у текущего пользователя.
   *
   * @tags WireGuard Peers
   * @name RevokePeer
   * @summary Отозвать пир у пользователя
   * @request POST:/api/wg/peers/{id}/revoke
   * @secure
   */
  revokePeer = (
    { id, ...query }: RevokePeerParams,
    params: RequestParams = {},
  ) =>
    this.request<WgPeerDto>({
      url: `/api/wg/peers/${id}/revoke`,
      method: "POST",
      responseType: "json",
      ...params,
    });
  /**
   * @description Ротировать (перегенерировать) предварительно общий ключ для пира.
   *
   * @tags WireGuard Peers
   * @name RotatePresharedKey
   * @summary Ротировать предварительно общий ключ
   * @request POST:/api/wg/peers/{id}/rotate-psk
   * @secure
   */
  rotatePresharedKey = (
    { id, ...query }: RotatePresharedKeyParams,
    params: RequestParams = {},
  ) =>
    this.request<WgPeerDto>({
      url: `/api/wg/peers/${id}/rotate-psk`,
      method: "POST",
      responseType: "json",
      ...params,
    });
  /**
   * @description Удалить предварительно общий ключ у пира.
   *
   * @tags WireGuard Peers
   * @name RemovePresharedKey
   * @summary Удалить предварительно общий ключ
   * @request DELETE:/api/wg/peers/{id}/psk
   * @secure
   */
  removePresharedKey = (
    { id, ...query }: RemovePresharedKeyParams,
    params: RequestParams = {},
  ) =>
    this.request<WgPeerDto>({
      url: `/api/wg/peers/${id}/psk`,
      method: "DELETE",
      responseType: "json",
      ...params,
    });
  /**
   * @description Скачать файл конфигурации WireGuard .conf для данного пира. wg:peer:view может обращаться к любому пиру; wg:peer:own только к своим.
   *
   * @tags WireGuard Peers
   * @name GetPeerConfig
   * @summary Получить файл конфигурации пира
   * @request GET:/api/wg/peers/{id}/config
   * @secure
   */
  getPeerConfig = (
    { id, ...query }: GetPeerConfigParams,
    params: RequestParams = {},
  ) =>
    this.request<Base64URLString>({
      url: `/api/wg/peers/${id}/config`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Получить PNG изображение QR-кода для клиентской конфигурации. wg:peer:view может обращаться к любому пиру; wg:peer:own только к своим. Возвращает base64-кодированный PNG data URL.
   *
   * @tags WireGuard Peers
   * @name GetPeerQrCode
   * @summary Получить QR-код пира
   * @request GET:/api/wg/peers/{id}/qr
   * @secure
   */
  getPeerQrCode = (
    { id, ...query }: GetPeerQrCodeParams,
    params: RequestParams = {},
  ) =>
    this.request<{
      dataUrl: string;
    }>({
      url: `/api/wg/peers/${id}/qr`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Список всех WireGuard-серверов с опциональными фильтрами. Возвращает все серверы для wg:server:view, собственные серверы для wg:server:own.
   *
   * @tags WireGuard Servers
   * @name GetServers
   * @summary Получить все серверы
   * @request GET:/api/wg/servers
   * @secure
   */
  getServers = (query: GetServersParams, params: RequestParams = {}) =>
    this.request<IWgServerListDto>({
      url: `/api/wg/servers`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * @description Создать новый WireGuard-сервер. Ключи генерируются автоматически. Конфигурационный файл записывается в директорию конфигов WG.
   *
   * @tags WireGuard Servers
   * @name CreateServer
   * @summary Создать сервер
   * @request POST:/api/wg/servers
   * @secure
   */
  createServer = (
    data: IWgServerCreateRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<WgServerDto>({
      url: `/api/wg/servers`,
      method: "POST",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Получить варианты серверов для выпадающих списков (только id + name). Возвращает все варианты для wg:server:view, собственные для wg:server:own.
   *
   * @tags WireGuard Servers
   * @name GetServerOptions
   * @summary Получить варианты серверов
   * @request GET:/api/wg/servers/options
   * @secure
   */
  getServerOptions = (
    query: GetServerOptionsParams,
    params: RequestParams = {},
  ) =>
    this.request<IWgServerOptionsDto>({
      url: `/api/wg/servers/options`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * @description Получить WireGuard-сервер по ID. Проверка владельца для пользователей с wg:server:own.
   *
   * @tags WireGuard Servers
   * @name GetServer
   * @summary Получить сервер по ID
   * @request GET:/api/wg/servers/{id}
   * @secure
   */
  getServer = ({ id, ...query }: GetServerParams, params: RequestParams = {}) =>
    this.request<WgServerDto>({
      url: `/api/wg/servers/${id}`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Обновить WireGuard-сервер. Конфигурационный файл перезаписывается автоматически.
   *
   * @tags WireGuard Servers
   * @name UpdateServer
   * @summary Обновить сервер
   * @request PATCH:/api/wg/servers/{id}
   * @secure
   */
  updateServer = (
    { id, ...query }: UpdateServerParams,
    data: IWgServerUpdateRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<WgServerDto>({
      url: `/api/wg/servers/${id}`,
      method: "PATCH",
      data: data,
      type: EContentType.Json,
      responseType: "json",
      ...params,
    });
  /**
   * @description Удалить WireGuard-сервер. Останавливает интерфейс и удаляет конфигурационный файл.
   *
   * @tags WireGuard Servers
   * @name DeleteServer
   * @summary Удалить сервер
   * @request DELETE:/api/wg/servers/{id}
   * @secure
   */
  deleteServer = (
    { id, ...query }: DeleteServerParams,
    params: RequestParams = {},
  ) =>
    this.request<boolean>({
      url: `/api/wg/servers/${id}`,
      method: "DELETE",
      responseType: "json",
      ...params,
    });
  /**
   * @description Запустить WireGuard-интерфейс (wg-quick up).
   *
   * @tags WireGuard Servers
   * @name StartServer
   * @summary Запустить сервер
   * @request POST:/api/wg/servers/{id}/start
   * @secure
   */
  startServer = (
    { id, ...query }: StartServerParams,
    params: RequestParams = {},
  ) =>
    this.request<WgServerDto>({
      url: `/api/wg/servers/${id}/start`,
      method: "POST",
      responseType: "json",
      ...params,
    });
  /**
   * @description Остановить WireGuard-интерфейс (wg-quick down).
   *
   * @tags WireGuard Servers
   * @name StopServer
   * @summary Остановить сервер
   * @request POST:/api/wg/servers/{id}/stop
   * @secure
   */
  stopServer = (
    { id, ...query }: StopServerParams,
    params: RequestParams = {},
  ) =>
    this.request<WgServerDto>({
      url: `/api/wg/servers/${id}/stop`,
      method: "POST",
      responseType: "json",
      ...params,
    });
  /**
   * @description Перезапустить WireGuard-интерфейс.
   *
   * @tags WireGuard Servers
   * @name RestartServer
   * @summary Перезапустить сервер
   * @request POST:/api/wg/servers/{id}/restart
   * @secure
   */
  restartServer = (
    { id, ...query }: RestartServerParams,
    params: RequestParams = {},
  ) =>
    this.request<WgServerDto>({
      url: `/api/wg/servers/${id}/restart`,
      method: "POST",
      responseType: "json",
      ...params,
    });
  /**
   * @description Получить статус WireGuard-интерфейса в реальном времени. Запрашивает реальный wg-интерфейс, а не кэшированный статус из БД.
   *
   * @tags WireGuard Servers
   * @name GetServerStatus
   * @summary Получить актуальный статус сервера
   * @request GET:/api/wg/servers/{id}/status
   * @secure
   */
  getServerStatus = (
    { id, ...query }: GetServerStatusParams,
    params: RequestParams = {},
  ) =>
    this.request<IWgServerStatusDto>({
      url: `/api/wg/servers/${id}/status`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Агрегированный трафик + скорость по всем серверам и всем пирам. wg:stats:view — полная сводка; wg:server:own — только свои серверы; wg:peer:own — только свои пиры.
   *
   * @tags WireGuard Statistics
   * @name GetOverviewStats
   * @summary Сводная статистика
   * @request GET:/api/wg/statistics/overview
   * @secure
   */
  getOverviewStats = (
    query: GetOverviewStatsParams,
    params: RequestParams = {},
  ) =>
    this.request<IWgOverviewStatsResponse>({
      url: `/api/wg/statistics/overview`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * @description Агрегированный трафик + скорость для конкретного сервера (все его пиры). Опционально фильтровать по одному пиру через параметр peerId.
   *
   * @tags WireGuard Statistics
   * @name GetServerStats
   * @summary Статистика сервера
   * @request GET:/api/wg/statistics/servers/{serverId}
   * @secure
   */
  getServerStats = (
    { serverId, ...query }: GetServerStatsParams,
    params: RequestParams = {},
  ) =>
    this.request<IWgOverviewStatsResponse>({
      url: `/api/wg/statistics/servers/${serverId}`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * @description Агрегированный трафик + скорость для конкретного пира. wg:stats:view может просматривать любой пир; wg:peer:own только свои.
   *
   * @tags WireGuard Statistics
   * @name GetPeerStats
   * @summary Статистика пира
   * @request GET:/api/wg/statistics/peers/{peerId}
   * @secure
   */
  getPeerStats = (
    { peerId, ...query }: GetPeerStatsParams,
    params: RequestParams = {},
  ) =>
    this.request<IWgOverviewStatsResponse>({
      url: `/api/wg/statistics/peers/${peerId}`,
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * @description Текущая статистика в реальном времени по всем серверам — используется при начальной загрузке страницы до получения первого события wg:stats:overview через WebSocket.
   *
   * @tags WireGuard Statistics
   * @name GetOverviewCurrent
   * @summary Текущая сводная статистика
   * @request GET:/api/wg/statistics/overview/current
   * @secure
   */
  getOverviewCurrent = (params: RequestParams = {}) =>
    this.request<WgOverviewStatsPayload | null>({
      url: `/api/wg/statistics/overview/current`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Текущая статистика в реальном времени для конкретного сервера — используется при начальной загрузке страницы до получения первого события wg:server:stats через WebSocket.
   *
   * @tags WireGuard Statistics
   * @name GetServerCurrent
   * @summary Текущая статистика сервера
   * @request GET:/api/wg/statistics/servers/{serverId}/current
   * @secure
   */
  getServerCurrent = (
    { serverId, ...query }: GetServerCurrentParams,
    params: RequestParams = {},
  ) =>
    this.request<WgServerStatsPayload | null>({
      url: `/api/wg/statistics/servers/${serverId}/current`,
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * @description Текущая статистика в реальном времени для конкретного пира — используется при начальной загрузке страницы до получения первого события wg:peer:stats через WebSocket.
   *
   * @tags WireGuard Statistics
   * @name GetPeerCurrent
   * @summary Текущая статистика пира
   * @request GET:/api/wg/statistics/peers/{peerId}/current
   * @secure
   */
  getPeerCurrent = (
    { peerId, ...query }: GetPeerCurrentParams,
    params: RequestParams = {},
  ) =>
    this.request<WgPeerStatsPayload | null>({
      url: `/api/wg/statistics/peers/${peerId}/current`,
      method: "GET",
      responseType: "json",
      ...params,
    });
}
