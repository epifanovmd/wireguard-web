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

/** From T, pick a set of properties whose keys are in the union K */
export interface PickProfileModelExcludeKeysPasswordHash {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
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
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickTProfileCreateModelExcludeKeysIdOrPasswordHash {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface IProfileUpdateRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
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
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  tokens: ITokensDto;
}

export interface ISignUpRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password: string;
}

export interface ISignInRequest {
  username: string;
  password: string;
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
