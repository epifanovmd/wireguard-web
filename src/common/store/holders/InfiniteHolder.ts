import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

import { BaseListHolder } from "./BaseListHolder";
import {
  CancellablePromise,
  HolderStatus,
  IApiResponse,
  IHolderError,
  InfiniteFetchFn,
  IPagedResponse,
  isCancelError,
  isCancelResponse,
  MutationStatus,
  toHolderError,
} from "./HolderTypes";

// ─────────────────────────────────────────────────────────────────────────────

export interface IInfiniteHolderOptions<TItem, TArgs = void> {
  /** Вызывается при каждой загрузке (первичной, обновлении, loadMore). */
  onFetch?: InfiniteFetchFn<TItem, TArgs>;
  /** Извлекатель ключа для CRUD-хелперов. */
  keyExtractor?: (item: TItem) => string | number;
  /** Элементов на страницу (default: 20). */
  pageSize?: number;
}

export interface IInfiniteHolderResult<TItem, TError extends IHolderError> {
  data: TItem[] | null;
  hasMore: boolean;
  error: TError | null;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Холдер для списков с **бесконечной прокруткой / кнопкой «Загрузить ещё»**.
 *
 * В отличие от PagedHolder, все страницы накапливаются в `items`.
 * Отдельный `loadMoreStatus` отслеживает спиннер «загрузки ещё» независимо
 * от статуса первичной загрузки — можно одновременно показывать скелетон
 * при первом открытии и маленький спиннер внизу при подгрузке.
 *
 * Возможности:
 * - `load(args?)` → первичная загрузка, очищает элементы
 * - `refresh(args?)` → тихая перезагрузка с offset 0, заменяет элементы
 * - `loadMore()` → добавляет следующую страницу (no-op если `!hasMore` или уже грузится)
 * - Встроенные CRUD-хелперы над полным накопленным списком
 * - `fromApi()` для ручного управления
 *
 * @example
 * ```ts
 * notificationsHolder = new InfiniteHolder<NotificationDto>({
 *   pageSize: 50,
 *   keyExtractor: n => n.id,
 *   onFetch: ({ offset, limit }) => this._api.getNotifications({ offset, limit }),
 * });
 *
 * // В компоненте
 * <List onEndReached={() => notificationsHolder.loadMore()} />
 * ```
 */
export class InfiniteHolder<
  TItem,
  TArgs = void,
  TError extends IHolderError = IHolderError,
> extends BaseListHolder<TItem, TError> {
  /** Статус действия **«загрузить ещё»** (независим от `status`). */
  loadMoreStatus = MutationStatus.Idle;

  loadMoreError: TError | null = null;

  /** Сервер сообщил, что есть ещё элементы. */
  hasMore: boolean = true;

  /** Последние использованные аргументы — для refresh / продолжения loadMore. */
  lastArgs: TArgs | null = null;

  private _currentOffset: number = 0;
  private readonly _pageSize: number;
  private readonly _onFetch?: InfiniteFetchFn<TItem, TArgs>;

  constructor(options?: IInfiniteHolderOptions<TItem, TArgs>) {
    super(options?.keyExtractor);

    this._pageSize = options?.pageSize ?? 20;
    this._onFetch = options?.onFetch;

    makeObservable(this, {
      loadMoreStatus: observable,
      loadMoreError: observable.ref,
      hasMore: observable,
      lastArgs: observable.ref,

      isLoadingMore: computed,
      isLoadMoreError: computed,

      setItems: action,
      appendItems: action,
      prependItem: action,
      appendItem: action,
      removeItem: action,
      reset: action,
    });
  }

  // ─── Computed ──────────────────────────────────────────────────────────────

  get isLoadingMore() {
    return this.loadMoreStatus === MutationStatus.Loading;
  }

  get isLoadMoreError() {
    return this.loadMoreStatus === MutationStatus.Error;
  }

  // ─── Сеттеры состояния ────────────────────────────────────────────────────

  /**
   * Заменяет все элементы (первая загрузка или refresh).
   * Сбрасывает offset в items.length.
   */
  setItems(items: TItem[], hasMore: boolean) {
    this.items = items;
    this.hasMore = hasMore;
    this._currentOffset = items.length;
    this.status = HolderStatus.Success;
    this.error = null;
    this.loadMoreStatus = MutationStatus.Idle;
    this.loadMoreError = null;
  }

  /**
   * Добавляет элементы следующей страницы в конец списка.
   */
  appendItems(items: TItem[], hasMore: boolean) {
    this.items = [...this.items, ...items];
    this.hasMore = hasMore;
    this._currentOffset = this.items.length;
    this.loadMoreStatus = MutationStatus.Success;
    this.loadMoreError = null;
  }

  reset() {
    this.items = [];
    this.status = HolderStatus.Idle;
    this.loadMoreStatus = MutationStatus.Idle;
    this.error = null;
    this.loadMoreError = null;
    this.hasMore = true;
    this.lastArgs = null;
    this._currentOffset = 0;
  }

  // ─── CRUD-хелперы ─────────────────────────────────────────────────────────

  prependItem(item: TItem) {
    this.items = [item, ...this.items];
    this._currentOffset++;
  }

  appendItem(item: TItem) {
    this.items = [...this.items, item];
    this._currentOffset++;
  }

  removeItem(predicate: ((item: TItem) => boolean) | string | number) {
    const fn = this._normalizePredicate(predicate);

    this.items = this.items.filter(item => !fn(item));
    this._currentOffset = Math.max(0, this._currentOffset - 1);
  }

  // ─── Async-хелперы ────────────────────────────────────────────────────────

  /**
   * Первичная загрузка — очищает существующие элементы, показывает скелетон.
   * Сбрасывает offset в 0.
   */
  async load(
    ..._args: TArgs extends void ? [] : [args: TArgs]
  ): Promise<IInfiniteHolderResult<TItem, TError>> {
    const args = _args[0] as TArgs;

    this.lastArgs = args ?? null;
    this._currentOffset = 0;

    return this._runFetch(args, "loading");
  }

  /**
   * Тихая перезагрузка с offset 0 — старые элементы остаются видны во время запроса.
   */
  async refresh(
    ..._args: TArgs extends void ? [] : [args: TArgs]
  ): Promise<IInfiniteHolderResult<TItem, TError>> {
    const args = _args[0] as TArgs;

    this.lastArgs = args ?? null;
    this._currentOffset = 0;

    return this._runFetch(args, "refreshing");
  }

  /**
   * Добавляет следующую страницу. No-op, если уже грузится или `!hasMore`.
   */
  async loadMore(): Promise<IInfiniteHolderResult<TItem, TError>> {
    if (!this.hasMore || this.isLoadingMore || this.isBusy) {
      return {
        data: this.items,
        hasMore: this.hasMore,
        error: null,
      };
    }

    return this._runFetch(this.lastArgs as TArgs, "loadMore");
  }

  /**
   * Ручная обёртка API для первичной загрузки / refresh.
   *
   * @example
   * ```ts
   * await this.notificationsHolder.fromApi(
   *   () => this._api.getNotifications({ offset: 0, limit: 50 }),
   *   res => ({ items: res.data, hasMore: res.data.length === 50 }),
   * );
   * ```
   */
  async fromApi<TResponse, TApiError extends IHolderError = TError>(
    fn: () => Promise<IApiResponse<TResponse, TApiError>>,
    extractor: (
      response: TResponse,
      offset: number,
      limit: number,
    ) => { items: TItem[]; hasMore: boolean },
    options?: { append?: boolean; refresh?: boolean },
  ): Promise<IInfiniteHolderResult<TItem, TApiError>> {
    this._pendingFetch?.cancel?.();

    if (options?.append) {
      runInAction(() => {
        this.loadMoreStatus = MutationStatus.Loading;
        this.loadMoreError = null;
      });
    } else {
      if (options?.refresh) {
        this.setRefreshing();
      } else {
        this.setLoading();
        this._currentOffset = 0;
      }
    }

    const promise = fn();

    this._pendingFetch = promise as CancellablePromise;

    try {
      const res = await promise;

      this._pendingFetch = null;

      if (isCancelResponse(res))
        return { data: null, hasMore: this.hasMore, error: null };

      if (res.error) {
        if (options?.append) {
          runInAction(() => {
            this.loadMoreStatus = MutationStatus.Error;
            this.loadMoreError = res.error as unknown as TError;
          });
        } else {
          this.setError(res.error as unknown as TError);
        }

        return { data: null, hasMore: this.hasMore, error: res.error };
      }

      if (res.data != null) {
        const { items, hasMore } = extractor(
          res.data as TResponse,
          this._currentOffset,
          this._pageSize,
        );

        if (options?.append) {
          runInAction(() => {
            this.appendItems(items, hasMore);
          });
        } else {
          this.setItems(items, hasMore);
        }

        return { data: items, hasMore, error: null };
      }

      if (options?.append) {
        runInAction(() => {
          this.hasMore = false;
          this.loadMoreStatus = MutationStatus.Success;
        });
      } else {
        this.setItems([], false);
      }

      return { data: [], hasMore: false, error: null };
    } catch (e) {
      this._pendingFetch = null;

      if (isCancelError(e))
        return { data: null, hasMore: this.hasMore, error: null };

      const err = toHolderError(e) as unknown as TApiError;

      if (options?.append) {
        runInAction(() => {
          this.loadMoreStatus = MutationStatus.Error;
          this.loadMoreError = err as unknown as TError;
        });
      } else {
        this.setError(err as unknown as TError);
      }

      return { data: null, hasMore: this.hasMore, error: err };
    }
  }

  // ─── Приватное ────────────────────────────────────────────────────────────

  private async _runFetch(
    args: TArgs,
    mode: "loading" | "refreshing" | "loadMore",
  ): Promise<IInfiniteHolderResult<TItem, TError>> {
    if (!this._onFetch) {
      console.warn(
        "[InfiniteHolder] load/refresh/loadMore called but no onFetch was provided in options.",
      );

      return { data: null, hasMore: false, error: null };
    }

    const isAppend = mode === "loadMore";

    this._pendingFetch?.cancel?.();

    if (isAppend) {
      runInAction(() => {
        this.loadMoreStatus = MutationStatus.Loading;
        this.loadMoreError = null;
      });
    } else if (mode === "refreshing") {
      this.setRefreshing();
    } else {
      this.setLoading();
    }

    const offset = isAppend ? this._currentOffset : 0;
    const promise = this._onFetch({ offset, limit: this._pageSize }, args);

    this._pendingFetch = promise as CancellablePromise;

    try {
      const res = await promise;

      this._pendingFetch = null;

      if (isCancelResponse(res))
        return { data: null, hasMore: this.hasMore, error: null };

      if (res.error) {
        if (isAppend) {
          runInAction(() => {
            this.loadMoreStatus = MutationStatus.Error;
            this.loadMoreError = res.error as unknown as TError;
          });
        } else {
          this.setError(res.error as unknown as TError);
        }

        return {
          data: null,
          hasMore: this.hasMore,
          error: res.error as unknown as TError,
        };
      }

      if (res.data != null) {
        const pagedRes = res.data as IPagedResponse<TItem>;
        const items = pagedRes.data ?? [];
        const hasMore = items.length >= this._pageSize;

        if (isAppend) {
          runInAction(() => {
            this.appendItems(items, hasMore);
          });
        } else {
          this.setItems(items, hasMore);
        }

        return { data: items, hasMore, error: null };
      }

      if (isAppend) {
        runInAction(() => {
          this.hasMore = false;
          this.loadMoreStatus = MutationStatus.Success;
        });
      } else {
        this.setItems([], false);
      }

      return { data: [], hasMore: false, error: null };
    } catch (e) {
      this._pendingFetch = null;

      if (isCancelError(e))
        return { data: null, hasMore: this.hasMore, error: null };

      const err = toHolderError(e) as TError;

      if (isAppend) {
        runInAction(() => {
          this.loadMoreStatus = MutationStatus.Error;
          this.loadMoreError = err;
        });
      } else {
        this.setError(err);
      }

      return { data: null, hasMore: this.hasMore, error: err };
    }
  }
}
