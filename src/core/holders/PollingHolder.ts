import { action, makeObservable, observable } from "mobx";

import { EntityHolder, IEntityHolderOptions } from "./EntityHolder";
import { IHolderError } from "./HolderTypes";

// ─────────────────────────────────────────────────────────────────────────────

export type PollingStartOptions<TArgs> = TArgs extends void
  ? { interval?: number } | undefined
  : { args: TArgs; interval?: number };

export interface IPollingHolderOptions<TData, TArgs = void>
  extends IEntityHolderOptions<TData, TArgs> {
  /** Интервал опроса по умолчанию в мс (default: 5000). */
  interval?: number;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Расширяет `EntityHolder` автоматическим опросом (на основе setInterval).
 *
 * - `startPolling(options?)` — первичная загрузка (если idle) + периодическое тихое обновление
 * - `stopPolling()` — очищает интервал
 * - `reset()` — останавливает опрос и сбрасывает в idle
 * - `isPolling` — observable-флаг
 *
 * @example
 * ```ts
 * // TArgs = void
 * healthHolder = new PollingHolder<HealthDto>({
 *   onFetch: () => this._api.getHealth(),
 *   interval: 10_000,
 * });
 * healthHolder.startPolling();
 * healthHolder.stopPolling();
 *
 * // TArgs = string (идентификатор ресурса)
 * jobStatusHolder = new PollingHolder<JobStatusDto, string>({
 *   onFetch: id => this._api.getJobStatus(id),
 * });
 * jobStatusHolder.startPolling({ args: jobId, interval: 5_000 });
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
   * Запускает опрос. Выполняет немедленный `load()`, если холдер в состоянии idle,
   * затем тихо вызывает `refresh()` на каждом тике интервала.
   *
   * Повторный вызов `startPolling` во время активного опроса перезапускает интервал.
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

  /** Очищает интервал опроса. */
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
