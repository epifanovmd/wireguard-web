import { action, computed, makeObservable, observable, runInAction } from "mobx";

import {
  CollectionFetchFn,
  HolderStatus,
  IApiResponse,
  IHolderError,
  toHolderError,
} from "./HolderTypes";

// ─────────────────────────────────────────────────────────────────────────────

export interface ICollectionHolderOptions<TItem, TArgs = void> {
  /** Called automatically from `load()` / `refresh()`. */
  onFetch?: CollectionFetchFn<TItem, TArgs>;
  /** Key extractor for CRUD helpers (update/remove by id). */
  keyExtractor?: (item: TItem) => string | number;
}

export interface ICollectionHolderResult<TItem, TError extends IHolderError> {
  data: TItem[] | null;
  error: TError | null;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Holder for a **flat list** of items with no server-side pagination.
 * Suitable for small datasets, dropdowns, lookup tables, etc.
 *
 * Features:
 * - Full status lifecycle + silent refresh
 * - Built-in CRUD helpers: `appendItem`, `prependItem`, `updateItem`, `removeItem`
 * - `fromApi()` wrapper with extractor support (for nested `{ data: [...] }` shapes)
 * - `load()` / `refresh()` for auto-fetch via options
 *
 * @example
 * ```ts
 * serversHolder = new CollectionHolder<WgServerDto>({
 *   onFetch: () => this._api.getServers(),
 * });
 *
 * async load() {
 *   await this.serversHolder.load();
 * }
 *
 * // Or with nested response:
 * await this.serversHolder.fromApi(
 *   () => this._api.getServers(),
 *   res => res.data ?? [],
 * );
 * ```
 */
export class CollectionHolder<
  TItem,
  TArgs = void,
  TError extends IHolderError = IHolderError,
> {
  items: TItem[] = [];
  status: HolderStatus = "idle";
  error: TError | null = null;

  private readonly _onFetch?: CollectionFetchFn<TItem, TArgs>;
  private readonly _keyExtractor?: (item: TItem) => string | number;

  constructor(options?: ICollectionHolderOptions<TItem, TArgs>) {
    makeObservable(this, {
      items: observable,
      status: observable,
      error: observable.ref,

      isIdle: computed,
      isLoading: computed,
      isRefreshing: computed,
      isBusy: computed,
      isSuccess: computed,
      isError: computed,
      isEmpty: computed,
      count: computed,

      setLoading: action,
      setRefreshing: action,
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
    return this.status === "idle";
  }

  get isLoading() {
    return this.status === "loading";
  }

  get isRefreshing() {
    return this.status === "refreshing";
  }

  get isBusy() {
    return this.status === "loading" || this.status === "refreshing";
  }

  get isSuccess() {
    return this.status === "success";
  }

  get isError() {
    return this.status === "error";
  }

  get isEmpty() {
    return this.isSuccess && this.items.length === 0;
  }

  get count() {
    return this.items.length;
  }

  // ─── State setters ────────────────────────────────────────────────────────

  setLoading() {
    this.status = "loading";
    this.error = null;
  }

  setRefreshing() {
    this.status = "refreshing";
    this.error = null;
  }

  setItems(items: TItem[]) {
    this.items = items;
    this.status = "success";
    this.error = null;
  }

  setError(error: TError | IHolderError | string) {
    this.status = "error";
    this.error =
      typeof error === "string"
        ? ({ message: error } as TError)
        : (error as TError);
  }

  reset() {
    this.items = [];
    this.status = "idle";
    this.error = null;
  }

  // ─── CRUD helpers ─────────────────────────────────────────────────────────

  /** Add item at the beginning of the list. */
  prependItem(item: TItem) {
    this.items = [item, ...this.items];
  }

  /** Add item at the end of the list. */
  appendItem(item: TItem) {
    this.items = [...this.items, item];
  }

  /**
   * Replace the first item that matches `predicate`.
   * If `keyExtractor` is configured, you can pass the item's key directly.
   */
  updateItem(
    predicate: ((item: TItem) => boolean) | string | number,
    updated: TItem,
  ) {
    const fn = this._normalizePredicate(predicate);

    this.items = this.items.map(item => (fn(item) ? updated : item));
  }

  /**
   * Remove first item matching `predicate` or key.
   */
  removeItem(predicate: ((item: TItem) => boolean) | string | number) {
    const fn = this._normalizePredicate(predicate);

    this.items = this.items.filter(item => !fn(item));
  }

  /**
   * Insert item if no match found; update if found.
   * Requires `keyExtractor` to be configured or a predicate.
   */
  upsertItem(
    predicate: ((item: TItem) => boolean) | string | number,
    item: TItem,
  ) {
    const fn = this._normalizePredicate(predicate);
    const exists = this.items.some(fn);

    if (exists) {
      this.items = this.items.map(i => (fn(i) ? item : i));
    } else {
      this.items = [...this.items, item];
    }
  }

  // ─── Async helpers ────────────────────────────────────────────────────────

  /**
   * Wraps an API call, automatically managing loading state.
   *
   * Supports both flat `TItem[]` responses and nested responses via
   * the optional `extractor` — e.g. `res => res.data ?? []`.
   *
   * @example
   * ```ts
   * // Flat response: API returns TItem[] directly
   * await this.holder.fromApi(() => this._api.getItems());
   *
   * // Nested response: API returns { data: TItem[], count: number }
   * await this.holder.fromApi(
   *   () => this._api.getItems(),
   *   res => res.data,
   * );
   * ```
   */
  async fromApi<TResponse = TItem[], TApiError extends IHolderError = TError>(
    fn: () => Promise<IApiResponse<TResponse, TApiError>>,
    extractor?: (response: TResponse) => TItem[],
    options?: { refresh?: boolean },
  ): Promise<ICollectionHolderResult<TItem, TApiError>> {
    if (options?.refresh) {
      this.setRefreshing();
    } else {
      this.setLoading();
    }

    try {
      const res = await fn();

      if (res.error) {
        this.setError(res.error as unknown as TError);

        return { data: null, error: res.error };
      }

      if (res.data != null) {
        const items = extractor
          ? extractor(res.data as TResponse)
          : (res.data as unknown as TItem[]);

        this.setItems(items);

        return { data: items, error: null };
      }

      this.setItems([]);

      return { data: [], error: null };
    } catch (e) {
      const err = toHolderError(e) as unknown as TApiError;

      this.setError(err as unknown as TError);

      return { data: null, error: err };
    }
  }

  /**
   * Calls `onFetch` provided in constructor options (full load).
   */
  async load(
    ..._args: TArgs extends void ? [] : [args: TArgs]
  ): Promise<ICollectionHolderResult<TItem, TError>> {
    return this._runFetch(_args[0] as TArgs, false);
  }

  /**
   * Calls `onFetch` silently — keeps existing items visible.
   */
  async refresh(
    ..._args: TArgs extends void ? [] : [args: TArgs]
  ): Promise<ICollectionHolderResult<TItem, TError>> {
    return this._runFetch(_args[0] as TArgs, true);
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  private _normalizePredicate(
    predicate: ((item: TItem) => boolean) | string | number,
  ): (item: TItem) => boolean {
    if (typeof predicate === "function") return predicate;
    if (!this._keyExtractor) {
      throw new Error(
        "[CollectionHolder] keyExtractor must be configured to use string/number predicates.",
      );
    }
    const key = predicate;

    return item => this._keyExtractor!(item) === key;
  }

  private async _runFetch(
    args: TArgs,
    isRefresh: boolean,
  ): Promise<ICollectionHolderResult<TItem, TError>> {
    if (!this._onFetch) {
      console.warn(
        "[CollectionHolder] load/refresh called but no onFetch was provided in options.",
      );

      return { data: null, error: null };
    }

    if (isRefresh) {
      this.setRefreshing();
    } else {
      this.setLoading();
    }

    try {
      const res = await this._onFetch(args);

      if (res.error) {
        this.setError(res.error as unknown as TError);

        return { data: null, error: res.error as unknown as TError };
      }

      const items = (res.data ?? []) as TItem[];

      this.setItems(items);

      return { data: items, error: null };
    } catch (e) {
      const err = toHolderError(e) as TError;

      this.setError(err);

      return { data: null, error: err };
    }
  }
}
