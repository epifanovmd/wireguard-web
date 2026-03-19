import { action, computed, makeObservable, observable } from "mobx";

import {
  HolderStatus,
  IApiResponse,
  IHolderError,
  IPagedResponse,
  PagedFetchFn,
  toHolderError,
} from "./HolderTypes";

// ─────────────────────────────────────────────────────────────────────────────

export interface IPagedHolderPagination {
  /** Current page, 1-based. */
  page: number;
  pageSize: number;
  /** Total items across ALL pages (from the server). */
  totalCount: number;
}

export interface IPagedHolderOptions<TItem, TArgs = void> {
  /** Called automatically from `load()` / `goToPage()` / `reload()`. */
  onFetch?: PagedFetchFn<TItem, TArgs>;
  /** Key extractor for CRUD helpers (updateItem / removeItem). */
  keyExtractor?: (item: TItem) => string | number;
  /** Default page size (default: 20). */
  pageSize?: number;
}

export interface IPagedHolderResult<TItem, TError extends IHolderError> {
  data: TItem[] | null;
  totalCount: number;
  error: TError | null;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Holder for **server-side paginated** collections.
 *
 * Manages current page, page size, total count, and page navigation.
 * Every page change triggers a fresh API request.
 *
 * Features:
 * - Full status lifecycle + silent refresh
 * - `load(args?)` → page 1
 * - `goToPage(n)` → navigate to page n
 * - `setPageSize(n)` → change page size and reload page 1
 * - `reload()` → re-fetch current page with last args
 * - Built-in CRUD helpers that mutate the *current page* optimistically
 * - `fromApi()` for manual control
 *
 * @example
 * ```ts
 * peersHolder = new PagedHolder<WgPeerDto, { serverId: string }>({
 *   pageSize: 20,
 *   keyExtractor: p => p.id,
 *   onFetch: ({ offset, limit }, { serverId }) =>
 *     this._api.getPeersByServer({ serverId, offset, limit }),
 * });
 *
 * async load(serverId: string) {
 *   await this.peersHolder.load({ serverId });
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

  /** Arguments used in the last successful load — for reload(). */
  lastArgs: TArgs | null = null;

  private readonly _onFetch?: PagedFetchFn<TItem, TArgs>;
  private readonly _keyExtractor?: (item: TItem) => string | number;

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

  /** Total pages based on server totalCount. */
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

  /** Offset to send to the server for the current page. */
  get offset() {
    const { page, pageSize } = this.pagination;

    return (page - 1) * pageSize;
  }

  // ─── State setters ────────────────────────────────────────────────────────

  setLoading() {
    this.status = HolderStatus.Loading;
    this.error = null;
  }

  setRefreshing() {
    this.status = HolderStatus.Refreshing;
    this.error = null;
  }

  /** Jump to page without fetching (combine with manual setItems). */
  setPage(page: number) {
    this.pagination = { ...this.pagination, page: Math.max(1, page) };
  }

  /** Change page size and reset to page 1 (does NOT fetch). */
  setPageSize(pageSize: number) {
    this.pagination = { ...this.pagination, pageSize, page: 1 };
  }

  /** Bulk-update any pagination fields (does NOT fetch). */
  setPagination(update: Partial<IPagedHolderPagination>) {
    this.pagination = { ...this.pagination, ...update };
  }

  /**
   * Set items for the current page + the server's total count.
   * Call this after a successful API response.
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

  /** Reset items, pagination (except pageSize), and status to idle. */
  reset() {
    this.items = [];
    this.status = HolderStatus.Idle;
    this.error = null;
    this.lastArgs = null;
    this.pagination = { ...this.pagination, page: 1, totalCount: 0 };
  }

  // ─── CRUD helpers (optimistic, current page only) ─────────────────────────

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

  // ─── Async helpers ────────────────────────────────────────────────────────

  /**
   * Wraps a **manual** API call that returns a paginated response.
   * Handles loading state, error normalisation, and data storage.
   *
   * @example
   * ```ts
   * await this.peersHolder.fromApi(
   *   () => this._api.getPeersByServer({ serverId, offset: this.peersHolder.offset, limit: this.peersHolder.pagination.pageSize }),
   *   res => ({ items: res.data ?? [], totalCount: res.totalCount ?? 0 }),
   * );
   * ```
   */
  async fromApi<TResponse, TApiError extends IHolderError = TError>(
    fn: () => Promise<IApiResponse<TResponse, TApiError>>,
    extractor: (response: TResponse) => { items: TItem[]; totalCount: number },
    options?: { refresh?: boolean },
  ): Promise<IPagedHolderResult<TItem, TApiError>> {
    if (options?.refresh) {
      this.setRefreshing();
    } else {
      this.setLoading();
    }

    try {
      const res = await fn();

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
      const err = toHolderError(e) as unknown as TApiError;

      this.setError(err as unknown as TError);

      return { data: null, totalCount: 0, error: err };
    }
  }

  /**
   * Loads page 1 with new args.
   * Resets the current page to 1 before fetching.
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
   * Re-fetches the **current page** with the same args used last time.
   */
  async reload(options?: {
    refresh?: boolean;
  }): Promise<IPagedHolderResult<TItem, TError>> {
    return this._runFetch(this.lastArgs as TArgs, options?.refresh ?? false);
  }

  /**
   * Navigate to a specific page and fetch its data.
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

  // ─── Private ──────────────────────────────────────────────────────────────

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

    if (isRefresh) {
      this.setRefreshing();
    } else {
      this.setLoading();
    }

    const { page, pageSize } = this.pagination;
    const offset = (page - 1) * pageSize;

    try {
      const res = await this._onFetch({ offset, limit: pageSize }, args);

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
      const err = toHolderError(e) as TError;

      this.setError(err);

      return { data: null, totalCount: 0, error: err };
    }
  }
}
