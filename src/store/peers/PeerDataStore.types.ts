import { ApiResponse, createServiceDecorator } from "@force-dev/utils";

import { ApiError } from "~@api";
import {
  IWgPeerCreateRequestDto,
  IWgPeerUpdateRequestDto,
  WgPeerDto,
} from "~@api/api-gen/data-contracts";
import { EntityHolder, IHolderError, IMutationHolderResult, MutationHolder } from "~@core/holders";
import { PeerModel } from "~@models";

export const IPeerDataStore = createServiceDecorator<IPeerDataStore>();

export interface IPeerDataStore {
  peerHolder: EntityHolder<WgPeerDto, string>;
  qrHolder: EntityHolder<{ dataUrl: string }>;
  updatePeerMutation: MutationHolder<
    { id: string; params: IWgPeerUpdateRequestDto },
    WgPeerDto
  >;
  peer: WgPeerDto | null;
  peerModel: PeerModel | null;

  loadPeer(id: string): Promise<WgPeerDto | null>;
  createPeer(
    serverId: string,
    params: IWgPeerCreateRequestDto,
  ): Promise<ApiResponse<WgPeerDto, ApiError>>;
  updatePeer(
    id: string,
    params: IWgPeerUpdateRequestDto,
  ): Promise<IMutationHolderResult<WgPeerDto, IHolderError>>;
  deletePeer(id: string): Promise<ApiResponse<boolean, ApiError>>;
  startPeer(id: string): Promise<ApiResponse<WgPeerDto, ApiError>>;
  stopPeer(id: string): Promise<ApiResponse<WgPeerDto, ApiError>>;
  assignPeer(id: string, userId: string): Promise<ApiResponse<WgPeerDto, ApiError>>;
  revokePeer(id: string): Promise<ApiResponse<WgPeerDto, ApiError>>;
  rotatePsk(id: string): Promise<ApiResponse<WgPeerDto, ApiError>>;
  removePsk(id: string): Promise<ApiResponse<WgPeerDto, ApiError>>;
  loadQrCode(id: string): Promise<{ dataUrl: string } | undefined>;
}
