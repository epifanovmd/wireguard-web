import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

import {
  HolderStatus,
  IApiResponse,
  IHolderError,
  InfiniteFetchFn,
  IPagedResponse,
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
> {
  /** Накопленные элементы со всех загруженных страниц. */
  items: TItem[] = [];

  /** Статус **первичной / refresh** загрузки. */
  status = HolderStatus.Idle;

  /** Статус действия **«загрузить ещё»** (независим от `status`). */
  loadMoreStatus = MutationStatus.Idle;

  error: TError | null = null;
  loadMoreError: TError | null = null;

  /** Сервер сообщил, что есть ещё элементы. */
  hasMore: boolean = true;

  /** Последние использованные аргументы — для refresh / продолжения loadMore. */
  lastArgs: TArgs | null = null;

  private _currentOffset: number = 0;
  private readonly _pageSize: number;
  private readonly _onFetch?: InfiniteFetchFn<TItem, TArgs>;
  private readonly _keyExtractor?: (item: TItem) => string | number;

  constructor(options?: IInfiniteHolderOptions<TItem, TArgs>) {
    this._pageSize = options?.pageSize ?? 20;
    this._onFetch = options?.onFetch;
    this._keyExtractor = options?.keyExtractor;

    makeObservable(this, {
      items: observable,
      status: observable,
      loadMoreStatus: observable,
      error: observable.ref,
      loadMoreError: observable.ref,
      hasMore: observable,
      lastArgs: observable.ref,

      isIdle: computed,
      isLoading: computed,
      isRefreshing: computed,
      isBusy: computed,
      isSuccess: computed,
      isError: computed,
      isEmpty: computed,
      isLoadingMore: computed,
      isLoadMoreError: computed,
      count: computed,

      setLoading: action,
      setRefreshing: action,
      setItems: action,
      appendItems: action,
      prependItem: action,
      appendItem: action,
      updateItem: action,
      removeItem: action,
      upsertItem: action,
      setError: action,
      reset: action,
    });
  }

  // ─── Computed ──────────────────────────────────────────────────────────────

  get isIdle() {
    return this.status === HolderStatus.Idle;
  }

  get isLoading() {
    return this.status === HolderStatus.Loading;
  }

  get isRefreshing() {
    return this.status === HolderStatus.Refreshing;
  }

  /** True, пока идёт первичная загрузка ИЛИ refreshing. */
  get isBusy() {
    return (
      this.status === HolderStatus.Loading ||
      this.status === HolderStatus.Refreshing
    );
  }

  get isSuccess() {
    return this.status === HolderStatus.Success;
  }

  get isError() {
    return this.status === HolderStatus.Error;
  }

  get isEmpty() {
    return this.isSuccess && this.items.length === 0;
  }

  get isLoadingMore() {
    return this.loadMoreStatus === MutationStatus.Loading;
  }

  get isLoadMoreError() {
    return this.loadMoreStatus === MutationStatus.Error;
  }

  get count() {
    return this.items.length;
  }

  // ─── Сеттеры состояния ────────────────────────────────────────────────────

  setLoading() {
    this.status = HolderStatus.Loading;
    this.error = null;
  }

  setRefreshing() {
    this.status = HolderStatus.Refreshing;
    this.error = null;
  }

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

  setError(error: TError | IHolderError | string) {
    this.status = HolderStatus.Error;
    this.error =
      typeof error === "string"
        ? ({ message: error } as TError)
        : (error as TError);
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

  updateItem(
    predicate: ((item: TItem) => boolean) | string | number,
    updated: TItem,
  ) {
    const fn = this._normalizePredicate(predicate);

    this.items = this.items.map(item => (fn(item) ? updated : item));
  }

  removeItem(predicate: ((item: TItem) => boolean) | string | number) {
    const fn = this._normalizePredicate(predicate);

    this.items = this.items.filter(item => !fn(item));
    this._currentOffset = Math.max(0, this._currentOffset - 1);
  }

  upsertItem(
    predicate: ((item: TItem) => boolean) | string | number,
    item: TItem,
  ) {
    const fn = this._normalizePredicate(predicate);
    const exists = this.items.some(fn);

    if (exists) {
      this.items = this.items.map(i => (fn(i) ? item : i));
    } else {
      this.appendItem(item);
    }
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

    try {
      const res = await fn();

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

  private _normalizePredicate(
    predicate: ((item: TItem) => boolean) | string | number,
  ): (item: TItem) => boolean {
    if (typeof predicate === "function") return predicate;
    if (!this._keyExtractor) {
      throw new Error(
        "[InfiniteHolder] keyExtractor must be configured to use string/number predicates.",
      );
    }
    const key = predicate;

    return item => this._keyExtractor!(item) === key;
  }

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

    try {
      const res = await this._onFetch({ offset, limit: this._pageSize }, args);

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
