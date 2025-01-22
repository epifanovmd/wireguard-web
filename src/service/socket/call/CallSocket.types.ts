import { iocDecorator } from "@force-dev/utils";

import { ISocketService } from "../Socket.types";

export interface CallSocketEvents {
  offer: (offer: { from: string; to: string; offer: any }) => void;
  answer: (data: { from: string; to: string; answer: any }) => void;
  "ice-candidate": (candidate: {
    from: string;
    to: string;
    candidate: any;
  }) => void;
}

export interface CallSocketEmitEvents {
  offer: (data: { from: string; to: string; offer: any }) => void;
  answer: (data: { from: string; to: string; answer: any }) => void;
  "ice-candidate": (data: { from: string; to: string; candidate: any }) => void;
}

export const ICallSocketService = iocDecorator<ICallSocketService>();

export interface ICallSocketService {
  socket: ISocketService;
}
