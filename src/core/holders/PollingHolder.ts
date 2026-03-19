import { action, makeObservable, observable } from "mobx";

import { EntityHolder, IEntityHolderOptions } from "./EntityHolder";
import { IHolderError } from "./HolderTypes";

// ─────────────────────────────────────────────────────────────────────────────

export type PollingStartOptions<TArgs> = TArgs extends void
  ? { interval?: number } | undefined
  : { args: TArgs; interval?: number };

export interface IPollingHolderOptions<TData, TArgs = void>
  extends IEntityHolderOptions<TData, TArgs> {
  /** Default polling interval in ms (default: 5000). */
  interval?: number;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extends `EntityHolder` with automatic polling (setInterval-based refresh).
 *
 * - `startPolling(options?)` — initial load (if idle) + periodic silent refresh
 * - `stopPolling()` — clears the interval
 * - `reset()` — stops polling and resets to idle
 * - `isPolling` — observable flag
 *
 * @example
 * ```ts
 * // TArgs = void
 * statusHolder = new PollingHolder<StatusDto>({
 *   onFetch: () => this._api.getStatus(),
 *   interval: 10_000,
 * });
 * statusHolder.startPolling();
 * statusHolder.stopPolling();
 *
 * // TArgs = string
 * statusHolder = new PollingHolder<StatusDto, string>({
 *   onFetch: id => this._api.getStatus(id),
 * });
 * statusHolder.startPolling({ args: serverId, interval: 10_000 });
 * ```
 */
export class PollingHolder<
  TData,
  TArgs = void,
  TError extends IHolderError = IHolderError,
> extends EntityHolder<TData, TArgs, TError> {
  isPolling = false;

  private _intervalId: ReturnType<typeof setInterval> | null = null;
  private readonly _defaultInterval: number;

  constructor(options?: IPollingHolderOptions<TData, TArgs>) {
    super(options);
    this._defaultInterval = options?.interval ?? 5000;

    makeObservable(this, {
      isPolling: observable,
      startPolling: action,
      stopPolling: action,
    });
  }

  /**
   * Starts polling. Performs an immediate `load()` if the holder is idle,
   * then silently `refresh()`es on every interval tick.
   *
   * Calling `startPolling` while already polling restarts the interval.
   */
  startPolling(options?: PollingStartOptions<TArgs>): void {
    this.stopPolling();

    const args = (options as any)?.args as TArgs | undefined;
    const interval =
      (options as any)?.interval ?? this._defaultInterval;

    const doLoad = () => (this as any).load(args);
    const doRefresh = () => (this as any).refresh(args);

    this.isPolling = true;

    if (this.isIdle) {
      doLoad();
    }

    this._intervalId = setInterval(doRefresh, interval);
  }

  /** Clears the polling interval. */
  stopPolling(): void {
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
    this.isPolling = false;
  }

  override reset(): void {
    this.stopPolling();
    super.reset();
  }
}
