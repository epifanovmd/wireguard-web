import { action, computed, makeObservable, observable, runInAction } from "mobx";

import {
  EntityFetchFn,
  HolderStatus,
  IApiResponse,
  IHolderError,
  toHolderError,
} from "./HolderTypes";

// ─────────────────────────────────────────────────────────────────────────────

export interface IEntityHolderOptions<TData, TArgs = void> {
  /** Called automatically from `load()` / `refresh()`. */
  onFetch?: EntityFetchFn<TData, TArgs>;
  /** Initial data (status becomes 'success' immediately). */
  initialData?: TData;
}

export interface IEntityHolderResult<TData, TError extends IHolderError> {
  data: TData | null;
  error: TError | null;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Holder for a **single API entity** — detail views, profile, current user, etc.
 *
 * Features:
 * - Full status lifecycle: idle → loading → success / error
 * - Silent background refresh (data stays visible, `isRefreshing` = true)
 * - `fromApi()` wrapper handles loading state, error normalisation, data set
 * - `load()` / `refresh()` for stores that provide `onFetch` in options
 * - Full MobX observability (all fields + computed)
 *
 * @example
 * ```ts
 * // Manual usage (explicit control in store methods)
 * peerHolder = new EntityHolder<WgPeerDto>();
 *
 * async loadPeer(id: string) {
 *   return this.peerHolder.fromApi(() => this._api.getPeer(id));
 * }
 *
 * // Auto-fetch usage
 * peerHolder = new EntityHolder<WgPeerDto, { id: string }>({
 *   onFetch: ({ id }) => this._api.getPeer(id),
 * });
 *
 * async loadPeer(id: string) {
 *   return this.peerHolder.load({ id });
 * }
 * ```
 */
export class EntityHolder<
  TData,
  TArgs = void,
  TError extends IHolderError = IHolderError,
> {
  data: TData | null = null;
  status: HolderStatus = "idle";
  error: TError | null = null;

  private readonly _onFetch?: EntityFetchFn<TData, TArgs>;

  constructor(options?: IEntityHolderOptions<TData, TArgs>) {
    makeObservable(this, {
      data: observable.ref,
      status: observable,
      error: observable.ref,

      isIdle: computed,
      isLoading: computed,
      isRefreshing: computed,
      isBusy: computed,
      isSuccess: computed,
      isError: computed,
      isEmpty: computed,
      isFilled: computed,

      setLoading: action,
      setRefreshing: action,
      setData: action,
      setError: action,
      reset: action,
    });

    this._onFetch = options?.onFetch;

    if (options?.initialData !== undefined) {
      this.data = options.initialData;
      this.status = "success";
    }
  }

  // ─── Computed ──────────────────────────────────────────────────────────────

  /** No request has been made yet. */
  get isIdle() {
    return this.status === "idle";
  }

  /** Full load in progress (no data visible yet). */
  get isLoading() {
    return this.status === "loading";
  }

  /** Silent background reload (old data stays visible). */
  get isRefreshing() {
    return this.status === "refreshing";
  }

  /** True while loading OR refreshing. */
  get isBusy() {
    return this.status === "loading" || this.status === "refreshing";
  }

  /** Last request completed successfully. */
  get isSuccess() {
    return this.status === "success";
  }

  /** Last request failed. */
  get isError() {
    return this.status === "error";
  }

  /** Success, but the server returned null / no data. */
  get isEmpty() {
    return this.isSuccess && this.data === null;
  }

  /** Has non-null data (regardless of current status). */
  get isFilled() {
    return this.data !== null;
  }

  // ─── Manual state setters ─────────────────────────────────────────────────

  setLoading() {
    this.status = "loading";
    this.error = null;
  }

  setRefreshing() {
    this.status = "refreshing";
    this.error = null;
  }

  setData(data: TData) {
    this.data = data;
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

  /** Clears data and resets to idle. */
  reset() {
    this.data = null;
    this.status = "idle";
    this.error = null;
  }

  // ─── Async helpers ────────────────────────────────────────────────────────

  /**
   * Wraps **any** API call that returns `{ data?, error? }`.
   * Automatically manages loading state, error normalisation, and data storage.
   *
   * Pass `{ refresh: true }` to keep the existing data visible while reloading.
   *
   * @example
   * ```ts
   * const { data, error } = await this.peerHolder.fromApi(
   *   () => this._api.getPeer(id),
   * );
   * ```
   */
  async fromApi<TApiError extends IHolderError = TError>(
    fn: () => Promise<IApiResponse<TData, TApiError>>,
    options?: { refresh?: boolean },
  ): Promise<IEntityHolderResult<TData, TApiError>> {
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
        this.setData(res.data);

        return { data: res.data, error: null };
      }

      // Server returned success with no body (204 / empty data)
      runInAction(() => {
        this.data = null;
        this.status = "success";
      });

      return { data: null, error: null };
    } catch (e) {
      const err = toHolderError(e) as unknown as TApiError;

      this.setError(err as unknown as TError);

      return { data: null, error: err };
    }
  }

  /**
   * Calls `onFetch` provided in constructor options.
   * Performs a full load (spinner, clears old data on error).
   *
   * @example
   * ```ts
   * await this.peerHolder.load({ id });
   * ```
   */
  async load(
    ..._args: TArgs extends void ? [] : [args: TArgs]
  ): Promise<IEntityHolderResult<TData, TError>> {
    const args = _args[0] as TArgs;

    return this._runFetch(args, false);
  }

  /**
   * Calls `onFetch` silently — keeps existing data visible.
   * Use for pull-to-refresh or background polling.
   */
  async refresh(
    ..._args: TArgs extends void ? [] : [args: TArgs]
  ): Promise<IEntityHolderResult<TData, TError>> {
    const args = _args[0] as TArgs;

    return this._runFetch(args, true);
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  private async _runFetch(
    args: TArgs,
    isRefresh: boolean,
  ): Promise<IEntityHolderResult<TData, TError>> {
    if (!this._onFetch) {
      console.warn(
        "[EntityHolder] load/refresh called but no onFetch was provided in options.",
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

      if (res.data != null) {
        this.setData(res.data);

        return { data: res.data, error: null };
      }

      action(() => {
        this.data = null;
        this.status = "success";
      })();

      return { data: null, error: null };
    } catch (e) {
      const err = toHolderError(e) as TError;

      this.setError(err);

      return { data: null, error: err };
    }
  }
}
