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

export enum EPermissions {
  Read = "read",
  Write = "write",
  Delete = "delete",
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickPermissionModelExcludeKeysPasswordHash {
  id?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  name?: EPermissions;
}

export interface IPermissionDto {
  id?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  name?: EPermissions;
}

export enum ERole {
  Admin = "admin",
  User = "user",
  Guest = "guest",
}

/**
 * Utility type to extract Attributes of a given Model class.
 *
 * It returns all instance properties defined in the Model, except:
 * - those inherited from Model (intermediate inheritance works),
 * - the ones whose type is a function,
 * - the ones manually excluded using the second parameter.
 * - the ones branded using {@link NonAttribute}
 *
 * It cannot detect whether something is a getter or not, you should use the `Excluded`
 * parameter to exclude getter & setters from the attribute list.
 */
export interface InferAttributesRole {
  permissions: IPermissionDto[];
  id?: string;
  name?: ERole;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface IRoleDto {
  permissions: IPermissionDto[];
  id?: string;
  name?: ERole;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickProfileModelExcludeKeysPasswordHash {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  roleId?: string;
  challenge?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface IProfileDto {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  roleId?: string;
  challenge?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  role: IRoleDto;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickTProfileCreateModelExcludeKeysIdOrPasswordHash {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  roleId?: string;
  challenge?: string;
}

export interface IProfileUpdateRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  roleId?: string;
  challenge?: string;
}

export interface IProfileListDto {
  /** @format double */
  count?: number;
  /** @format double */
  offset?: number;
  /** @format double */
  limit?: number;
  data: IProfileDto[];
}

export interface IProfilePrivilegesRequest {
  roleName: ERole;
  permissions: EPermissions[];
}

export interface ITokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface IProfileWithTokensDto {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  roleId?: string;
  challenge?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  role: IRoleDto;
  tokens: ITokensDto;
}

export interface ISignUpRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  roleId?: string;
  challenge?: string;
  password: string;
}

export interface ISignInRequest {
  username: string;
  password: string;
}

/** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
export type Base64URLString = string;

export enum PublicKeyCredentialType {
  PublicKey = "public-key",
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

/** https://w3c.github.io/webauthn/#dictdef-publickeycredentialdescriptorjson */
export interface PublicKeyCredentialDescriptorJSON {
  /** An attempt to communicate that this isn't just any string, but a Base64URL-encoded string */
  id: Base64URLString;
  type: PublicKeyCredentialType;
  transports?: AuthenticatorTransportFuture[];
}

export enum UserVerificationRequirement {
  Discouraged = "discouraged",
  Preferred = "preferred",
  Required = "required",
}

export interface AuthenticationExtensionsClientInputs {
  appid?: string;
  credProps?: boolean;
  hmacCreateSecret?: boolean;
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

/** @format double */
export type COSEAlgorithmIdentifier = number;

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

export enum AuthenticatorAttachment {
  CrossPlatform = "cross-platform",
  Platform = "platform",
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

export interface IVerifyRegistrationRequest {
  profileId: string;
  /**
   * A slightly-modified RegistrationCredential to simplify working with ArrayBuffers that
   * are Base64URL-encoded in the browser so that they can be sent as JSON to the server.
   *
   * https://w3c.github.io/webauthn/#dictdef-registrationresponsejson
   */
  data: RegistrationResponseJSON;
}

export interface IVerifyAuthenticationResponse {
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

export interface IVerifyAuthenticationRequest {
  profileId: string;
  /**
   * A slightly-modified AuthenticationCredential to simplify working with ArrayBuffers that
   * are Base64URL-encoded in the browser so that they can be sent as JSON to the server.
   *
   * https://w3c.github.io/webauthn/#dictdef-authenticationresponsejson
   */
  data: AuthenticationResponseJSON;
}

export interface IWireguardPeerStatus {
  allowedIps: string;
  latestHandshakeAt?: string;
  /** @format double */
  transferRx: number;
  /** @format double */
  transferTx: number;
  /** @format double */
  persistentKeepalive: number;
}

export interface IWgServerDto {
  id?: string;
  profileId?: string;
  name?: string;
  /** @format double */
  port?: number;
  privateKey?: string;
  publicKey?: string;
  address?: string;
  createdAt?: string & {
    undefined?: true;
  };
  updatedAt?: string & {
    undefined?: true;
  };
  clients?: IWgClientsDto[];
  profile?: IProfileDto;
}

/**
 * Utility type to extract Attributes of a given Model class.
 *
 * It returns all instance properties defined in the Model, except:
 * - those inherited from Model (intermediate inheritance works),
 * - the ones whose type is a function,
 * - the ones manually excluded using the second parameter.
 * - the ones branded using {@link NonAttribute}
 *
 * It cannot detect whether something is a getter or not, you should use the `Excluded`
 * parameter to exclude getter & setters from the attribute list.
 */
export interface InferAttributesWgClient {
  id?: string;
  serverId?: string;
  profileId?: string;
  name?: string;
  address?: string;
  allowedIPs?: string;
  publicKey?: string;
  privateKey?: string;
  preSharedKey?: string;
  /** @format double */
  transferRx?: number;
  /** @format double */
  transferTx?: number;
  /** @format date-time */
  latestHandshakeAt?: string;
  /** @format double */
  persistentKeepalive?: number;
  enabled?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface IWgClientsDto {
  id?: string;
  serverId?: string;
  profileId?: string;
  name?: string;
  address?: string;
  allowedIPs?: string;
  publicKey?: string;
  privateKey?: string;
  preSharedKey?: string;
  /** @format double */
  transferRx?: number;
  /** @format double */
  transferTx?: number;
  /** @format date-time */
  latestHandshakeAt?: string;
  /** @format double */
  persistentKeepalive?: number;
  enabled?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  profile: IProfileDto;
  server: IWgServerDto;
}

/**
 * Utility type to extract Attributes of a given Model class.
 *
 * It returns all instance properties defined in the Model, except:
 * - those inherited from Model (intermediate inheritance works),
 * - the ones whose type is a function,
 * - the ones manually excluded using the second parameter.
 * - the ones branded using {@link NonAttribute}
 *
 * It cannot detect whether something is a getter or not, you should use the `Excluded`
 * parameter to exclude getter & setters from the attribute list.
 */
export interface InferAttributesWgServer {
  id?: string;
  profileId?: string;
  name?: string;
  /** @format double */
  port?: number;
  privateKey?: string;
  publicKey?: string;
  address?: string;
  createdAt?: string & {
    undefined?: true;
  };
  updatedAt?: string & {
    undefined?: true;
  };
}

export interface IWgServersListDto {
  /** @format double */
  count?: number;
  /** @format double */
  offset?: number;
  /** @format double */
  limit?: number;
  data: IWgServerDto[];
}

export interface IWgClientListDto {
  /** @format double */
  count?: number;
  /** @format double */
  offset?: number;
  /** @format double */
  limit?: number;
  data: IWgClientsDto[];
}

export interface IWgClientCreateRequest {
  name?: string;
  serverId?: string;
  allowedIPs?: string;
  /** @format double */
  persistentKeepalive?: number;
  enabled?: boolean;
}

export interface IWgClientUpdateRequest {
  name?: string;
  allowedIPs?: string;
  /** @format double */
  persistentKeepalive?: number;
  enabled?: boolean;
}

export interface GetAllProfilesParams {
  /** @format double */
  offset?: number;
  /** @format double */
  limit?: number;
}

export interface RefreshPayload {
  refreshToken: string;
}

export interface GenerateRegistrationOptionsPayload {
  profileId: string;
}

export interface GenerateAuthenticationOptionsPayload {
  profileId: string;
}

export interface CheckStatusParams {
  publicKey: string;
  interfaceName: string;
}

export interface GetWgServersParams {
  /** @format double */
  offset?: number;
  /** @format double */
  limit?: number;
}

export interface CreateWgServerPayload {
  name: string;
}

export interface GetWgClientsParams {
  /** @format double */
  offset?: number;
  /** @format double */
  limit?: number;
  serverId: string;
}
