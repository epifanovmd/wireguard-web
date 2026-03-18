import { createServiceDecorator, DataHolder } from "@force-dev/utils";

import {
  IWgPeerCreateRequestDto,
  IWgPeerUpdateRequestDto,
  WgPeerDto,
} from "~@api/api-gen/data-contracts";
import { PeerModel } from "~@models";

export const IPeerDataStore = createServiceDecorator<IPeerDataStore>();

export interface IPeerDataStore {
  peerHolder: DataHolder<WgPeerDto>;
  qrHolder: DataHolder<{ dataUrl: string }>;
  peer: WgPeerDto | undefined;
  peerModel: PeerModel | undefined;

  loadPeer(id: string): Promise<WgPeerDto | undefined>;
  createPeer(serverId: string, params: IWgPeerCreateRequestDto): Promise<any>;
  updatePeer(id: string, params: IWgPeerUpdateRequestDto): Promise<any>;
  deletePeer(id: string): Promise<any>;
  startPeer(id: string): Promise<any>;
  stopPeer(id: string): Promise<any>;
  assignPeer(id: string, userId: string): Promise<any>;
  revokePeer(id: string): Promise<any>;
  rotatePsk(id: string): Promise<any>;
  removePsk(id: string): Promise<any>;
  loadQrCode(id: string): Promise<any>;
}
