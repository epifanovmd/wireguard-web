import { action, computed, makeObservable, observable } from "mobx";

import {
  HolderStatus,
  IApiResponse,
  IHolderError,
  IPagedResponse,
  isCancelError,
  isCancelResponse,
  PagedFetchFn,
  toHolderError,
} from "./HolderTypes";

// ─────────────────────────────────────────────────────────────────────────────

export interface IPagedHolderPagination {
  /** Текущая страница, нумерация с 1. */
  page: number;
  pageSize: number;
  /** Общее количество элементов по всем страницам (от сервера). */
  totalCount: number;
}

export interface IPagedHolderOptions<TItem, TArgs = void> {
  /** Вызывается автоматически из `load()` / `goToPage()` / `reload()`. */
  onFetch?: PagedFetchFn<TItem, TArgs>;
  /** Извлекатель ключа для CRUD-хелперов (updateItem / removeItem). */
  keyExtractor?: (item: TItem) => string | number;
  /** Размер страницы по умолчанию (default: 20). */
  pageSize?: number;
}

export interface IPagedHolderResult<TItem, TError extends IHolderError> {
  data: TItem[] | null;
  totalCount: number;
  error: TError | null;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Холдер для **серверной постраничной пагинации**.
 *
 * Управляет текущей страницей, размером страницы, общим количеством
 * и навигацией. Каждая смена страницы инициирует новый API-запрос.
 *
 * Возможности:
 * - Полный жизненный цикл + тихое обновление
 * - `load(args?)` → загружает страницу 1
 * - `goToPage(n)` → переходит на страницу n
 * - `setPageSize(n)` → меняет размер страницы и перезагружает с 1-й
 * - `reload()` → перезапрашивает текущую страницу с теми же аргументами
 * - Встроенные CRUD-хелперы для оптимистичного обновления *текущей страницы*
 * - `fromApi()` для ручного управления
 *
 * @example
 * ```ts
 * ordersHolder = new PagedHolder<OrderDto, { userId: string }>({
 *   pageSize: 20,
 *   keyExtractor: o => o.id,
 *   onFetch: ({ offset, limit }, { userId }) =>
 *     this._api.getOrdersByUser({ userId, offset, limit }),
 * });
 *
 * async load(userId: string) {
 *   await this.ordersHolder.load({ userId });
 * }
 * ```
 */
export class PagedHolder<
  TItem,
  TArgs = void,
  TError extends IHolderError = IHolderError,
> {
  items: TItem[] = [];
  status = HolderStatus.Idle;
  error: TError | null = null;
  pagination: IPagedHolderPagination;

  /** Аргументы последней успешной загрузки — используются в reload(). */
  lastArgs: TArgs | null = null;

  private readonly _onFetch?: PagedFetchFn<TItem, TArgs>;
  private readonly _keyExtractor?: (item: TItem) => string | number;
  private _pendingFetch: { cancel?: () => void } | null = null;

  constructor(options?: IPagedHolderOptions<TItem, TArgs>) {
    this.pagination = {
      page: 1,
      pageSize: options?.pageSize ?? 20,
      totalCount: 0,
    };

    makeObservable(this, {
      items: observable,
      status: observable,
      error: observable.ref,
      pagination: observable,
      lastArgs: observable.ref,

      isIdle: computed,
      isLoading: computed,
      isRefreshing: computed,
      isBusy: computed,
      isSuccess: computed,
      isError: computed,
      isEmpty: computed,
      count: computed,
      pageCount: computed,
      hasNextPage: computed,
      hasPrevPage: computed,
      offset: computed,

      setLoading: action,
      setRefreshing: action,
      setPage: action,
      setPageSize: action,
      setPagination: action,
      setItems: action,
      prependItem: action,
      appendItem: action,
      updateItem: action,
      removeItem: action,
      upsertItem: action,
      setError: action,
      reset: action,
    });

    this._onFetch = options?.onFetch;
    this._keyExtractor = options?.keyExtractor;
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

  get count() {
    return this.items.length;
  }

  /** Общее количество страниц на основе серверного totalCount. */
  get pageCount() {
    const { pageSize, totalCount } = this.pagination;

    return pageSize > 0 ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1;
  }

  get hasNextPage() {
    return this.pagination.page < this.pageCount;
  }

  get hasPrevPage() {
    return this.pagination.page > 1;
  }

  /** Offset для отправки на сервер для текущей страницы. */
  get offset() {
    const { page, pageSize } = this.pagination;

    return (page - 1) * pageSize;
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

  /** Переходит на страницу без запроса (совместно с ручным setItems). */
  setPage(page: number) {
    this.pagination = { ...this.pagination, page: Math.max(1, page) };
  }

  /** Меняет размер страницы и сбрасывает на страницу 1 (запрос НЕ выполняется). */
  setPageSize(pageSize: number) {
    this.pagination = { ...this.pagination, pageSize, page: 1 };
  }

  /** Массово обновляет поля пагинации (запрос НЕ выполняется). */
  setPagination(update: Partial<IPagedHolderPagination>) {
    this.pagination = { ...this.pagination, ...update };
  }

  /**
   * Устанавливает элементы текущей страницы и общее количество от сервера.
   * Вызывается после успешного API-ответа.
   */
  setItems(items: TItem[], totalCount: number) {
    this.items = items;
    this.pagination = { ...this.pagination, totalCount };
    this.status = HolderStatus.Success;
    this.error = null;
  }

  setError(error: TError | IHolderError | string) {
    this.status = HolderStatus.Error;
    this.error =
      typeof error === "string"
        ? ({ message: error } as TError)
        : (error as TError);
  }

  /** Сбрасывает элементы, пагинацию (кроме pageSize) и статус в idle. */
  reset() {
    this.items = [];
    this.status = HolderStatus.Idle;
    this.error = null;
    this.lastArgs = null;
    this.pagination = { ...this.pagination, page: 1, totalCount: 0 };
  }

  // ─── CRUD-хелперы (оптимистичные, только текущая страница) ───────────────

  prependItem(item: TItem) {
    this.items = [item, ...this.items];
    this.pagination = {
      ...this.pagination,
      totalCount: this.pagination.totalCount + 1,
    };
  }

  appendItem(item: TItem) {
    this.items = [...this.items, item];
    this.pagination = {
      ...this.pagination,
      totalCount: this.pagination.totalCount + 1,
    };
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
    this.pagination = {
      ...this.pagination,
      totalCount: Math.max(0, this.pagination.totalCount - 1),
    };
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
   * Оборачивает **ручной** API-вызов, возвращающий постраничный ответ.
   * Управляет состоянием загрузки, нормализацией ошибок и сохранением данных.
   *
   * @example
   * ```ts
   * await this.ordersHolder.fromApi(
   *   () => this._api.getOrders({ offset: this.ordersHolder.offset, limit: this.ordersHolder.pagination.pageSize }),
   *   res => ({ items: res.data ?? [], totalCount: res.totalCount ?? 0 }),
   * );
   * ```
   */
  async fromApi<TResponse, TApiError extends IHolderError = TError>(
    fn: () => Promise<IApiResponse<TResponse, TApiError>>,
    extractor: (response: TResponse) => { items: TItem[]; totalCount: number },
    options?: { refresh?: boolean },
  ): Promise<IPagedHolderResult<TItem, TApiError>> {
    this._pendingFetch?.cancel?.();

    if (options?.refresh) {
      this.setRefreshing();
    } else {
      this.setLoading();
    }

    const promise = fn();

    this._pendingFetch = promise as any;

    try {
      const res = await promise;

      this._pendingFetch = null;

      if (isCancelResponse(res)) return { data: null, totalCount: 0, error: null };

      if (res.error) {
        this.setError(res.error as unknown as TError);

        return { data: null, totalCount: 0, error: res.error };
      }

      if (res.data != null) {
        const { items, totalCount } = extractor(res.data as TResponse);

        this.setItems(items, totalCount);

        return { data: items, totalCount, error: null };
      }

      this.setItems([], 0);

      return { data: [], totalCount: 0, error: null };
    } catch (e) {
      this._pendingFetch = null;

      if (isCancelError(e)) return { data: null, totalCount: 0, error: null };

      const err = toHolderError(e) as unknown as TApiError;

      this.setError(err as unknown as TError);

      return { data: null, totalCount: 0, error: err };
    }
  }

  /**
   * Загружает страницу 1 с новыми аргументами.
   * Сбрасывает текущую страницу в 1 перед запросом.
   */
  async load(
    ..._args: TArgs extends void ? [] : [args: TArgs]
  ): Promise<IPagedHolderResult<TItem, TError>> {
    const args = _args[0] as TArgs;

    this.lastArgs = args ?? null;
    this.pagination = { ...this.pagination, page: 1 };

    return this._runFetch(args, false);
  }

  /**
   * Перезапрашивает **текущую страницу** с теми же аргументами, что использовались последний раз.
   */
  async reload(options?: {
    refresh?: boolean;
  }): Promise<IPagedHolderResult<TItem, TError>> {
    return this._runFetch(this.lastArgs as TArgs, options?.refresh ?? false);
  }

  /**
   * Переходит на указанную страницу и загружает её данные.
   */
  async goToPage(
    page: number,
    options?: { refresh?: boolean },
  ): Promise<IPagedHolderResult<TItem, TError>> {
    this.pagination = {
      ...this.pagination,
      page: Math.max(1, Math.min(page, this.pageCount)),
    };

    return this._runFetch(this.lastArgs as TArgs, options?.refresh ?? false);
  }

  async nextPage(): Promise<IPagedHolderResult<TItem, TError>> {
    if (!this.hasNextPage)
      return {
        data: this.items,
        totalCount: this.pagination.totalCount,
        error: null,
      };

    return this.goToPage(this.pagination.page + 1);
  }

  async prevPage(): Promise<IPagedHolderResult<TItem, TError>> {
    if (!this.hasPrevPage)
      return {
        data: this.items,
        totalCount: this.pagination.totalCount,
        error: null,
      };

    return this.goToPage(this.pagination.page - 1);
  }

  // ─── Приватное ────────────────────────────────────────────────────────────

  private _normalizePredicate(
    predicate: ((item: TItem) => boolean) | string | number,
  ): (item: TItem) => boolean {
    if (typeof predicate === "function") return predicate;
    if (!this._keyExtractor) {
      throw new Error(
        "[PagedHolder] keyExtractor must be configured to use string/number predicates.",
      );
    }
    const key = predicate;

    return item => this._keyExtractor!(item) === key;
  }

  private async _runFetch(
    args: TArgs,
    isRefresh: boolean,
  ): Promise<IPagedHolderResult<TItem, TError>> {
    if (!this._onFetch) {
      console.warn(
        "[PagedHolder] load/reload/goToPage called but no onFetch was provided in options.",
      );

      return { data: null, totalCount: 0, error: null };
    }

    this._pendingFetch?.cancel?.();

    if (isRefresh) {
      this.setRefreshing();
    } else {
      this.setLoading();
    }

    const { page, pageSize } = this.pagination;
    const offset = (page - 1) * pageSize;
    const promise = this._onFetch({ offset, limit: pageSize }, args);

    this._pendingFetch = promise as any;

    try {
      const res = await promise;

      this._pendingFetch = null;

      if (isCancelResponse(res)) return { data: null, totalCount: 0, error: null };

      if (res.error) {
        this.setError(res.error as unknown as TError);

        return {
          data: null,
          totalCount: 0,
          error: res.error as unknown as TError,
        };
      }

      if (res.data != null) {
        const pagedRes = res.data as IPagedResponse<TItem>;
        const items = pagedRes.data ?? [];
        const totalCount =
          pagedRes.totalCount ?? pagedRes.count ?? items.length;

        this.setItems(items, totalCount);

        return { data: items, totalCount, error: null };
      }

      this.setItems([], 0);

      return { data: [], totalCount: 0, error: null };
    } catch (e) {
      this._pendingFetch = null;

      if (isCancelError(e)) return { data: null, totalCount: 0, error: null };

      const err = toHolderError(e) as TError;

      this.setError(err);

      return { data: null, totalCount: 0, error: err };
    }
  }
}
