import { AppSocket } from "./socketTransport.types";

type AnyHandler = (...args: any[]) => void;

export class PersistentListeners {
  private _store = new Map<string, Set<AnyHandler>>();

  add(event: string, handler: AnyHandler): () => void {
    if (!this._store.has(event)) {
      this._store.set(event, new Set());
    }
    this._store.get(event)!.add(handler);

    return () => this._store.get(event)?.delete(handler);
  }

  bindTo(socket: AppSocket): void {
    this._store.forEach((handlers, event) =>
      handlers.forEach(h => socket.on(event as never, h as never)),
    );
  }

  clear(): void {
    this._store.clear();
  }
}
