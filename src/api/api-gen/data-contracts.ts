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

export enum EWgServerStatus {
  Up = "up",
  Down = "down",
  Error = "error",
  Unknown = "unknown",
}

export enum AttestationConveyancePreference {
  Direct = "direct",
  Enterprise = "enterprise",
  Indirect = "indirect",
  None = "none",
}

export enum UserVerificationRequirement {
  Discouraged = "discouraged",
  Preferred = "preferred",
  Required = "required",
}

export enum ResidentKeyRequirement {
  Discouraged = "discouraged",
  Preferred = "preferred",
  Required = "required",
}

export enum AuthenticatorAttachment {
  CrossPlatform = "cross-platform",
  Platform = "platform",
}

/**
 * A super class of TypeScript's `AuthenticatorTransport` that includes support for the latest
 * transports. Should eventually be replaced by TypeScript's when TypeScript gets updated to
 * know about it (sometime after 4.6.3)
 */
export enum AuthenticatorTransportFuture {
  Ble = "ble",
  Cable = "cable",
  Hybrid = "hybrid",
  Internal = "internal",
  Nfc = "nfc",
  SmartCard = "smart-card",
  Usb = "usb",
}

export enum PublicKeyCredentialType {
  PublicKey = "public-key",
}

export enum EProfileStatus {
  Online = "online",
  Offline = "offline",
}

export enum EPermissions {
  Value = "*",
  Wg = "wg:*",
  WgServer = "wg:server:*",
  WgPeer = "wg:peer:*",
  WgStats = "wg:stats:*",
  WgServerView = "wg:server:view",
  WgServerManage = "wg:server:manage",
  WgServerControl = "wg:server:control",
  WgPeerView = "wg:peer:view",
  WgPeerManage = "wg:peer:manage",
  WgPeerOwn = "wg:peer:own",
  WgStatsView = "wg:stats:view",
  WgStatsExport = "wg:stats:export",
  UserView = "user:view",
  UserManage = "user:manage",
}

export enum ERole {
  Admin = "admin",
  User = "user",
  Guest = "guest",
}

export interface ProfileDto {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  /** @format date-time */
  birthDate?: string | null;
  gender?: string;
  status?: string;
  /** @format date-time */
  lastOnline?: string | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  user?: UserDto;
}

export interface IPermissionDto {
  id: string;
  name: EPermissions;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface IRoleDto {
  id: string;
  name: ERole;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  permissions: IPermissionDto[];
}

export interface UserDto {
  id: string;
  email?: string;
  emailVerified?: boolean;
  phone?: string;
  profile?: ProfileDto;
  roles: IRoleDto[];
  directPermissions: IPermissionDto[];
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface IProfileUpdateRequestDto {
  firstName?: string;
  lastName?: string;
  bio?: string;
  /** @format date-time */
  birthDate?: string;
  gender?: string;
  status?: EProfileStatus;
}

export interface PublicProfileDto {
  id: string;
  firstName?: string;
  lastName?: string;
  status: EProfileStatus;
  /** @format date-time */
  lastOnline?: string;
}

export interface IProfileListDto {
  /** @format double */
  count?: number;
  /** @format double */
  totalCount?: number;
  /** @format double */
  offset?: number;
  /** @format double */
  limit?: number;
  data: PublicProfileDto[];
}

export interface IUserUpdateRequestDto {
  email?: string;
  phone?: string;
  roleId?: string;
}

export interface PublicUserDto {
  userId: string;
  email: string;
  profile: PublicProfileDto;
}

export interface IUserListDto {
  /** @format double */
  count?: number;
  /** @format double */
  totalCount?: number;
  /** @format double */
  offset?: number;
  /** @format double */
  limit?: number;
  data: PublicUserDto[];
}

export interface IUserOptionDto {
  id: string;
  name: string;
}

export interface IUserOptionsDto {
  data: IUserOptionDto[];
}

export interface IUserPrivilegesRequestDto {
  /** Roles to assign to the user (replaces current roles). */
  roles: ERole[];
  /**
   * Direct permissions granted to this user on top of role permissions.
   * Replaces current direct permissions.
   */
  permissions: EPermissions[];
}

export interface ApiResponseDto {
  message?: string;
  data?: any;
}

export interface IUserChangePasswordDto {
  password: string;
}

export interface ITokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface IUserWithTokensDto {
  id: string;
  email?: string;
  emailVerified?: boolean;
  phone?: string;
  profile?: ProfileDto;
  roles: IRoleDto[];
  directPermissions: IPermissionDto[];
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  tokens: ITokensDto;
}

export type TSignUpRequestDto = {
  password: string;
  lastName?: string;
  firstName?: string;
} & (
  | {
      phone: string;
      email?: string;
    }
  | {
      phone?: string;
      email: string;
    }
);

export interface ISignInRequestDto {
  /** Может быть телефоном, email-ом и username-ом */
  login: string;
  password: string;
}

export interface IUserLoginRequestDto {
  /** Может быть телефоном, email-ом и username-ом */
  login: string;
}

export interface IUserResetPasswordRequestDto {
  password: string;
  token: string;
}

export interface PublicKeyCredentialRpEntity {
  name: string;
  id?: string;
}

/** https://w3c.github.io/webauthn/#dictdef-publickeycredentialuserentityjson */
export interface PublicKeyCredentialUserEntityJSON {
  id: string;
  name: string;
  displayName: string;
}

/** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
export type Base64URLString = string;

/** @format double */
export type COSEAlgorithmIdentifier = number;

export interface PublicKeyCredentialParameters {
  alg: COSEAlgorithmIdentifier;
  type: PublicKeyCredentialType;
}

/** https://w3c.github.io/webauthn/#dictdef-publickeycredentialdescriptorjson */
export interface PublicKeyCredentialDescriptorJSON {
  /** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
  id: Base64URLString;
  type: PublicKeyCredentialType;
  transports?: AuthenticatorTransportFuture[];
}

export interface AuthenticatorSelectionCriteria {
  authenticatorAttachment?: AuthenticatorAttachment;
  requireResidentKey?: boolean;
  residentKey?: ResidentKeyRequirement;
  userVerification?: UserVerificationRequirement;
}

export interface AuthenticationExtensionsClientInputs {
  appid?: string;
  credProps?: boolean;
  hmacCreateSecret?: boolean;
  minPinLength?: boolean;
}

/**
 * A variant of PublicKeyCredentialCreationOptions suitable for JSON transmission to the browser to
 * (eventually) get passed into navigator.credentials.create(...) in the browser.
 *
 * This should eventually get replaced with official TypeScript DOM types when WebAuthn L3 types
 * eventually make it into the language:
 *
 * https://w3c.github.io/webauthn/#dictdef-publickeycredentialcreationoptionsjson
 */
export interface PublicKeyCredentialCreationOptionsJSON {
  rp: PublicKeyCredentialRpEntity;
  /** https://w3c.github.io/webauthn/#dictdef-publickeycredentialuserentityjson */
  user: PublicKeyCredentialUserEntityJSON;
  /** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
  challenge: Base64URLString;
  pubKeyCredParams: PublicKeyCredentialParameters[];
  /** @format double */
  timeout?: number;
  excludeCredentials?: PublicKeyCredentialDescriptorJSON[];
  authenticatorSelection?: AuthenticatorSelectionCriteria;
  attestation?: AttestationConveyancePreference;
  extensions?: AuthenticationExtensionsClientInputs;
}

export interface IVerifyRegistrationResponseDto {
  verified: boolean;
}

/**
 * A slightly-modified AuthenticatorAttestationResponse to simplify working with ArrayBuffers that
 * are Base64URL-encoded in the browser so that they can be sent as JSON to the server.
 *
 * https://w3c.github.io/webauthn/#dictdef-authenticatorattestationresponsejson
 */
export interface AuthenticatorAttestationResponseJSON {
  /** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
  clientDataJSON: Base64URLString;
  /** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
  attestationObject: Base64URLString;
  /** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
  authenticatorData?: Base64URLString;
  transports?: AuthenticatorTransportFuture[];
  publicKeyAlgorithm?: COSEAlgorithmIdentifier;
  /** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
  publicKey?: Base64URLString;
}

export interface CredentialPropertiesOutput {
  rk?: boolean;
}

export interface AuthenticationExtensionsClientOutputs {
  appid?: boolean;
  credProps?: CredentialPropertiesOutput;
  hmacCreateSecret?: boolean;
}

/**
 * A slightly-modified RegistrationCredential to simplify working with ArrayBuffers that
 * are Base64URL-encoded in the browser so that they can be sent as JSON to the server.
 *
 * https://w3c.github.io/webauthn/#dictdef-registrationresponsejson
 */
export interface RegistrationResponseJSON {
  /** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
  id: Base64URLString;
  /** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
  rawId: Base64URLString;
  /**
   * A slightly-modified AuthenticatorAttestationResponse to simplify working with ArrayBuffers that
   * are Base64URL-encoded in the browser so that they can be sent as JSON to the server.
   *
   * https://w3c.github.io/webauthn/#dictdef-authenticatorattestationresponsejson
   */
  response: AuthenticatorAttestationResponseJSON;
  authenticatorAttachment?: AuthenticatorAttachment;
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
  type: PublicKeyCredentialType;
}

export interface IVerifyRegistrationRequestDto {
  /**
   * A slightly-modified RegistrationCredential to simplify working with ArrayBuffers that
   * are Base64URL-encoded in the browser so that they can be sent as JSON to the server.
   *
   * https://w3c.github.io/webauthn/#dictdef-registrationresponsejson
   */
  data: RegistrationResponseJSON;
}

/**
 * A variant of PublicKeyCredentialRequestOptions suitable for JSON transmission to the browser to
 * (eventually) get passed into navigator.credentials.get(...) in the browser.
 */
export interface PublicKeyCredentialRequestOptionsJSON {
  /** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
  challenge: Base64URLString;
  /** @format double */
  timeout?: number;
  rpId?: string;
  allowCredentials?: PublicKeyCredentialDescriptorJSON[];
  userVerification?: UserVerificationRequirement;
  extensions?: AuthenticationExtensionsClientInputs;
}

export interface IGenerateAuthenticationOptionsRequestDto {
  /** Email или телефон пользователя */
  login: string;
}

export interface IVerifyAuthenticationResponseDto {
  verified: boolean;
  tokens?: ITokensDto;
}

/**
 * A slightly-modified AuthenticatorAssertionResponse to simplify working with ArrayBuffers that
 * are Base64URL-encoded in the browser so that they can be sent as JSON to the server.
 *
 * https://w3c.github.io/webauthn/#dictdef-authenticatorassertionresponsejson
 */
export interface AuthenticatorAssertionResponseJSON {
  /** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
  clientDataJSON: Base64URLString;
  /** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
  authenticatorData: Base64URLString;
  /** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
  signature: Base64URLString;
  /** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
  userHandle?: Base64URLString;
}

/**
 * A slightly-modified AuthenticationCredential to simplify working with ArrayBuffers that
 * are Base64URL-encoded in the browser so that they can be sent as JSON to the server.
 *
 * https://w3c.github.io/webauthn/#dictdef-authenticationresponsejson
 */
export interface AuthenticationResponseJSON {
  /** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
  id: Base64URLString;
  /** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
  rawId: Base64URLString;
  /**
   * A slightly-modified AuthenticatorAssertionResponse to simplify working with ArrayBuffers that
   * are Base64URL-encoded in the browser so that they can be sent as JSON to the server.
   *
   * https://w3c.github.io/webauthn/#dictdef-authenticatorassertionresponsejson
   */
  response: AuthenticatorAssertionResponseJSON;
  authenticatorAttachment?: AuthenticatorAttachment;
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
  type: PublicKeyCredentialType;
}

export interface IVerifyAuthenticationRequestDto {
  /**
   * A slightly-modified AuthenticationCredential to simplify working with ArrayBuffers that
   * are Base64URL-encoded in the browser so that they can be sent as JSON to the server.
   *
   * https://w3c.github.io/webauthn/#dictdef-authenticationresponsejson
   */
  data: AuthenticationResponseJSON;
}

export interface WgPeerDto {
  id: string;
  serverId: string;
  userId: string | null;
  name: string;
  publicKey: string;
  hasPresharedKey: boolean;
  allowedIPs: string;
  /** @format double */
  persistentKeepalive: number | null;
  dns: string | null;
  /** @format double */
  mtu: number | null;
  clientAllowedIPs: string;
  enabled: boolean;
  status: EWgServerStatus;
  /** @format date-time */
  expiresAt: string | null;
  description: string | null;
  /** @format date-time */
  lastHandshake: string | null;
  isActive: boolean;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface IWgPeerListDto {
  /** @format double */
  count?: number;
  /** @format double */
  totalCount?: number;
  /** @format double */
  offset?: number;
  /** @format double */
  limit?: number;
  data: WgPeerDto[];
}

export interface IWgPeerOptionDto {
  id: string;
  name: string;
}

export interface IWgPeerOptionsDto {
  data: IWgPeerOptionDto[];
}

export interface IWgPeerCreateRequestDto {
  name: string;
  presharedKey?: boolean;
  /** @format double */
  persistentKeepalive?: number;
  dns?: string;
  /** @format double */
  mtu?: number;
  clientAllowedIPs?: string;
  description?: string;
  expiresAt?: string;
  enabled?: boolean;
}

export interface IWgPeerUpdateRequestDto {
  name?: string;
  allowedIPs?: string;
  userId?: string | null;
  /** true — сгенерировать новый, false/null — удалить существующий */
  presharedKey?: boolean | null;
  /** @format double */
  persistentKeepalive?: number | null;
  dns?: string | null;
  /** @format double */
  mtu?: number | null;
  clientAllowedIPs?: string;
  description?: string | null;
  expiresAt?: string | null;
  enabled?: boolean;
}

export interface WgServerDto {
  id: string;
  userId: string | null;
  name: string;
  interface: string;
  /** @format double */
  listenPort: number;
  publicKey: string;
  address: string;
  dns: string | null;
  endpoint: string | null;
  /** @format double */
  mtu: number | null;
  preUp: string | null;
  preDown: string | null;
  postUp: string | null;
  postDown: string | null;
  status: EWgServerStatus;
  enabled: boolean;
  description: string | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface IWgServerListDto {
  /** @format double */
  count?: number;
  /** @format double */
  totalCount?: number;
  /** @format double */
  offset?: number;
  /** @format double */
  limit?: number;
  data: WgServerDto[];
}

export interface IWgServerOptionDto {
  id: string;
  name: string;
}

export interface IWgServerOptionsDto {
  data: IWgServerOptionDto[];
}

export interface IWgServerCreateRequestDto {
  userId?: string | null;
  name: string;
  interface: string;
  /** @format double */
  listenPort: number;
  address: string;
  dns?: string;
  endpoint?: string;
  /** @format double */
  mtu?: number;
  preUp?: string;
  preDown?: string;
  postUp?: string;
  postDown?: string;
  description?: string;
  enabled?: boolean;
}

export interface IWgServerUpdateRequestDto {
  name?: string;
  /** @format double */
  listenPort?: number;
  address?: string;
  dns?: string;
  endpoint?: string;
  /** @format double */
  mtu?: number;
  preUp?: string | null;
  preDown?: string | null;
  postUp?: string | null;
  postDown?: string | null;
  description?: string;
  enabled?: boolean;
}

export interface IWgServerStatusDto {
  serverId: string;
  interface: string;
  status: EWgServerStatus;
  /** @format double */
  listenPort: number;
  /** @format double */
  peerCount: number;
  /** @format double */
  activePeerCount: number;
  publicKey: string;
}

export interface WgOverviewTrafficPointDto {
  /** @format date-time */
  timestamp: string;
  /** @format double */
  rxBytes: number;
  /** @format double */
  txBytes: number;
}

export interface WgOverviewSpeedPointDto {
  /** @format date-time */
  timestamp: string;
  /** @format double */
  rxSpeedBps: number;
  /** @format double */
  txSpeedBps: number;
}

export interface IWgOverviewStatsResponse {
  traffic: WgOverviewTrafficPointDto[];
  speed: WgOverviewSpeedPointDto[];
}

export interface GetProfilesParams {
  /**
   * Смещение для пагинации
   * @format double
   */
  offset?: number;
  /**
   * Лимит количества возвращаемых профилей
   * @format double
   */
  limit?: number;
}

export interface GetUsersParams {
  /**
   * Смещение для пагинации
   * @format double
   */
  offset?: number;
  /**
   * Лимит количества возвращаемых пользователей
   * @format double
   */
  limit?: number;
  /** Поиск по email */
  query?: string;
}

export interface GetUserOptionsParams {
  /** Поиск по email, имени или фамилии */
  query?: string;
}

/** Тело запроса с refresh токеном */
export interface RefreshPayload {
  refreshToken: string;
}

export interface GetPeersByServerParams {
  /** @format double */
  offset?: number;
  /** @format double */
  limit?: number;
  query?: string;
  enabled?: boolean;
  status?: EWgServerStatus;
  serverId: string;
}

export interface GetMyPeersParams {
  /** @format double */
  offset?: number;
  /** @format double */
  limit?: number;
  query?: string;
  enabled?: boolean;
  status?: EWgServerStatus;
  serverId?: string;
}

export interface GetPeersByUserParams {
  /** @format double */
  offset?: number;
  /** @format double */
  limit?: number;
  query?: string;
  enabled?: boolean;
  status?: EWgServerStatus;
  serverId?: string;
  userId: string;
}

export interface GetPeersOptionsParams {
  serverId?: string;
  query?: string;
}

export interface AssignPeerParams {
  userId: string;
  id: string;
}

export interface GetServersParams {
  /** @format double */
  offset?: number;
  /** @format double */
  limit?: number;
  query?: string;
  status?: EWgServerStatus;
  enabled?: boolean;
}

export interface GetServerOptionsParams {
  query?: string;
}

export interface GetOverviewStatsParams {
  /** ISO date string (default: 24h ago) */
  from?: string;
  /** ISO date string (default: now) */
  to?: string;
}

export interface GetServerStatsParams {
  /** ISO date string (default: 24h ago) */
  from?: string;
  /** ISO date string (default: now) */
  to?: string;
  /** Optional peer ID to filter */
  peerId?: string;
  /** Server ID */
  serverId: string;
}

export interface GetPeerStatsParams {
  /** ISO date string (default: 24h ago) */
  from?: string;
  /** ISO date string (default: now) */
  to?: string;
  /** Peer ID */
  peerId: string;
}
