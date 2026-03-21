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
 * Расширяет `EntityHolder` автоматическим опросом.
 *
 * Следующий запрос начинается через `interval` мс **после завершения предыдущего**,
 * поэтому медленные ответы не вызывают гонки и не накапливают параллельных запросов.
 *
 * - `startPolling(options?)` — первичная загрузка (если idle) + периодическое тихое обновление
 * - `stopPolling()` — останавливает опрос
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

  private _timeoutId: ReturnType<typeof setTimeout> | null = null;
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
   * Запускает опрос.
   *
   * Если холдер в состоянии idle — немедленно выполняет `load()`, иначе сразу
   * начинает цикл обновлений. После завершения каждого запроса ждёт `interval` мс,
   * затем тихо вызывает `refresh()`. Следующий запрос никогда не стартует раньше,
   * чем завершится предыдущий, поэтому медленные ответы не накапливают параллельных запросов.
   *
   * Повторный вызов во время активного опроса перезапускает цикл.
   */
  startPolling(options?: PollingStartOptions<TArgs>): void {
    this.stopPolling();

    const typedOptions = options as { args?: TArgs; interval?: number } | undefined;
    const args = typedOptions?.args as TArgs;
    const interval = typedOptions?.interval ?? this._defaultInterval;

    this.isPolling = true;

    type AnyLoadFn = (args: TArgs) => Promise<unknown>;

    const schedule = () => {
      if (!this.isPolling) return;
      this._timeoutId = setTimeout(async () => {
        if (!this.isPolling) return;
        await (this.refresh as unknown as AnyLoadFn)(args);
        schedule();
      }, interval);
    };

    if (this.isIdle) {
      (this.load as unknown as AnyLoadFn)(args).then(schedule);
    } else {
      schedule();
    }
  }

  /** Останавливает опрос. */
  stopPolling(): void {
    if (this._timeoutId !== null) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
    this.isPolling = false;
  }

  override reset(): void {
    this.stopPolling();
    super.reset();
  }
}
