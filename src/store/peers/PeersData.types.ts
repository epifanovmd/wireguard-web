import { createServiceDecorator, DataHolder } from "@force-dev/utils";

import {
  IWgPeerCreateRequestDto,
  IWgPeerListDto,
  IWgPeerUpdateRequestDto,
  WgPeerDto,
} from "~@api/api-gen/data-contracts";
import { PeerModel } from "~@models";

export const IPeersDataStore = createServiceDecorator<IPeersDataStore>();

export interface IPeersDataStore {
  listHolder: DataHolder<IWgPeerListDto>;
  peerHolder: DataHolder<WgPeerDto>;
  peers: WgPeerDto[];
  models: PeerModel[];
  total: number;
  isLoading: boolean;
  peer: WgPeerDto | undefined;
  peerModel: PeerModel | undefined;
  loadPeersByServer(serverId: string): Promise<void>;
  loadPeersByUser(userId: string): Promise<void>;
  loadMyPeers(): Promise<void>;
  loadPeer(id: string): Promise<WgPeerDto | undefined>;
  createPeer(serverId: string, params: IWgPeerCreateRequestDto): Promise<any>;
  updatePeer(id: string, params: IWgPeerUpdateRequestDto): Promise<any>;
  deletePeer(id: string): Promise<any>;
  enablePeer(id: string): Promise<any>;
  disablePeer(id: string): Promise<any>;
  assignPeer(id: string, userId: string): Promise<any>;
  revokePeer(id: string): Promise<any>;
  rotatePsk(id: string): Promise<any>;
  removePsk(id: string): Promise<any>;
  loadQrCode(id: string): Promise<any>;
}
