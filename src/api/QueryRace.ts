/**
 * Cancels previous in-flight request to the same endpoint
 * when a new request is made (race condition prevention).
 */
export class QueryRace {
  private _map = new Map<string, (msg?: string) => void>();

  apply(endpoint: string, cancel: (msg?: string) => void) {
    this.cancel(endpoint);
    this._map.set(endpoint, cancel);
  }

  cancel(endpoint: string) {
    this._map.get(endpoint)?.("Race condition canceled");
    this._map.delete(endpoint);
  }

  delete(endpoint: string) {
    this._map.delete(endpoint);
  }
}
