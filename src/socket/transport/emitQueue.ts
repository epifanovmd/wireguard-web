import { AppSocket } from "./socketTransport.types";

export class EmitQueue {
  private _queue: Array<(socket: AppSocket) => void> = [];

  enqueue(fn: (socket: AppSocket) => void): void {
    this._queue.push(fn);
  }

  flush(socket: AppSocket): void {
    this._queue.splice(0).forEach(fn => fn(socket));
  }

  clear(): void {
    this._queue = [];
  }
}
