import { action, computed, makeObservable, observable, runInAction } from "mobx";

import {
  IApiResponse,
  IHolderError,
  MutationFn,
  MutationStatus,
  toHolderError,
} from "./HolderTypes";

// ─────────────────────────────────────────────────────────────────────────────

export interface IMutationHolderOptions<TArgs, TData> {
  /** The API call to execute. Can be set here or passed inline to `execute()`. */
  onMutate?: MutationFn<TArgs, TData>;
}

export interface IMutationHolderResult<TData, TError extends IHolderError> {
  data: TData | null;
  error: TError | null;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Holder for a **single API mutation** — create, update, delete, start, stop, etc.
 *
 * Unlike data holders, mutations:
 * - Don't have a "refreshing" state (it's either loading or not)
 * - Optionally store the last successful response in `data`
 * - Expose `isLoading` to disable submit buttons / show spinners
 *
 * Features:
 * - `execute(args?)` — runs the mutation, stores result/error
 * - `reset()` — back to idle
 * - `onMutate` can be set in options OR passed inline to `execute()`
 * - Full MobX observability
 *
 * @example
 * ```ts
 * // In store
 * createPeerMutation = new MutationHolder<IWgPeerCreateRequestDto, WgPeerDto>();
 *
 * async createPeer(serverId: string, params: IWgPeerCreateRequestDto) {
 *   return this.createPeerMutation.execute(
 *     params,
 *     args => this._api.createPeer(serverId, args),
 *   );
 * }
 *
 * // Or with onMutate in options:
 * deletePeerMutation = new MutationHolder<string, void>({
 *   onMutate: id => this._api.deletePeer(id),
 * });
 *
 * async deletePeer(id: string) {
 *   return this.deletePeerMutation.execute(id);
 * }
 * ```
 */
export class MutationHolder<
  TArgs = void,
  TData = void,
  TError extends IHolderError = IHolderError,
> {
  /** Last successful response data. */
  data: TData | null = null;
  status: MutationStatus = "idle";
  error: TError | null = null;

  private readonly _onMutate?: MutationFn<TArgs, TData>;

  constructor(options?: IMutationHolderOptions<TArgs, TData>) {
    makeObservable(this, {
      data: observable.ref,
      status: observable,
      error: observable.ref,

      isIdle: computed,
      isLoading: computed,
      isSuccess: computed,
      isError: computed,

      reset: action,
    });

    this._onMutate = options?.onMutate;
  }

  // ─── Computed ──────────────────────────────────────────────────────────────

  get isIdle() {
    return this.status === "idle";
  }

  get isLoading() {
    return this.status === "loading";
  }

  get isSuccess() {
    return this.status === "success";
  }

  get isError() {
    return this.status === "error";
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  reset() {
    this.data = null;
    this.status = "idle";
    this.error = null;
  }

  // ─── Execute ──────────────────────────────────────────────────────────────

  /**
   * Execute the mutation.
   *
   * You can either use the `onMutate` provided in constructor options,
   * or pass an inline function as the second argument.
   *
   * @example
   * ```ts
   * // Using onMutate from options:
   * const { data, error } = await this.deleteMutation.execute(id);
   *
   * // Inline (no onMutate needed in options):
   * const { data, error } = await this.createMutation.execute(
   *   params,
   *   args => this._api.createPeer(serverId, args),
   * );
   * ```
   */
  async execute(
    ..._params: TArgs extends void
      ? [
          args?: never,
          fn?: MutationFn<TArgs, TData>,
        ]
      : [
          args: TArgs,
          fn?: MutationFn<TArgs, TData>,
        ]
  ): Promise<IMutationHolderResult<TData, TError>> {
    const args = _params[0] as TArgs;
    const fn = _params[1] ?? this._onMutate;

    if (!fn) {
      console.warn(
        "[MutationHolder] execute() called but no mutation function provided. " +
          "Pass it inline or set onMutate in options.",
      );

      return { data: null, error: null };
    }

    runInAction(() => {
      this.status = "loading";
      this.error = null;
    });

    try {
      const res = await fn(args);

      if (res.error) {
        runInAction(() => {
          this.status = "error";
          this.error = res.error as unknown as TError;
        });

        return { data: null, error: res.error as unknown as TError };
      }

      runInAction(() => {
        this.data = (res.data ?? null) as TData | null;
        this.status = "success";
        this.error = null;
      });

      return { data: (res.data ?? null) as TData | null, error: null };
    } catch (e) {
      const err = toHolderError(e) as TError;

      runInAction(() => {
        this.status = "error";
        this.error = err;
      });

      return { data: null, error: err };
    }
  }

  /**
   * Convenience wrapper — same as `execute()` but always returns the API response
   * in the project's `{ data?, error? }` format directly.
   *
   * Useful when you want to forward the raw response to the caller without
   * unwrapping it.
   */
  async run(
    fn: () => Promise<IApiResponse<TData>>,
  ): Promise<IMutationHolderResult<TData, TError>> {
    runInAction(() => {
      this.status = "loading";
      this.error = null;
    });

    try {
      const res = await fn();

      if (res.error) {
        runInAction(() => {
          this.status = "error";
          this.error = res.error as unknown as TError;
        });

        return { data: null, error: res.error as unknown as TError };
      }

      runInAction(() => {
        this.data = (res.data ?? null) as TData | null;
        this.status = "success";
      });

      return { data: (res.data ?? null) as TData | null, error: null };
    } catch (e) {
      const err = toHolderError(e) as TError;

      runInAction(() => {
        this.status = "error";
        this.error = err;
      });

      return { data: null, error: err };
    }
  }
}
