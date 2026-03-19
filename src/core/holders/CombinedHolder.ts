import { computed, makeObservable } from "mobx";

import { IHolderError } from "./HolderTypes";

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Minimal interface any holder must satisfy to be used inside CombinedHolder.
 * Matches EntityHolder, CollectionHolder, PagedHolder, InfiniteHolder, and
 * MutationHolder (which has no `isRefreshing`/`isBusy`).
 */
export interface IHolderLike {
  isLoading: boolean;
  isRefreshing?: boolean;
  isBusy?: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: IHolderError | null;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Aggregates the reactive status of multiple holders into a single object.
 *
 * Useful for pages that perform several parallel API requests and need one
 * unified loading/error state to drive the UI.
 *
 * Rules:
 * - `isLoading`    — true if **any** holder is loading
 * - `isRefreshing` — true if **any** holder is refreshing
 * - `isBusy`       — true if **any** holder is busy (loading OR refreshing)
 * - `isError`      — true if **any** holder has an error
 * - `isSuccess`    — true only when **all** holders are in success state
 * - `errors`       — non-null errors from all holders
 * - `firstError`   — first non-null error (convenient for toast/alert)
 *
 * @example
 * ```ts
 * pageHolder = new CombinedHolder([this.serverHolder, this.statusHolder]);
 *
 * // In VM:
 * isLoading: serverStore.pageHolder.isLoading,
 * ```
 */
export class CombinedHolder {
  private readonly _holders: IHolderLike[];

  constructor(holders: IHolderLike[]) {
    this._holders = holders;

    makeObservable(this, {
      isLoading: computed,
      isRefreshing: computed,
      isBusy: computed,
      isError: computed,
      isSuccess: computed,
      errors: computed,
      firstError: computed,
    });
  }

  /** True if any holder is in the `loading` state. */
  get isLoading(): boolean {
    return this._holders.some(h => h.isLoading);
  }

  /** True if any holder is in the `refreshing` state. */
  get isRefreshing(): boolean {
    return this._holders.some(h => h.isRefreshing ?? false);
  }

  /** True if any holder is loading or refreshing. */
  get isBusy(): boolean {
    return this._holders.some(h => h.isBusy ?? h.isLoading);
  }

  /** True if any holder is in the `error` state. */
  get isError(): boolean {
    return this._holders.some(h => h.isError);
  }

  /** True only when all holders are in the `success` state. */
  get isSuccess(): boolean {
    return this._holders.every(h => h.isSuccess);
  }

  /** All non-null errors across all holders. */
  get errors(): IHolderError[] {
    return this._holders
      .map(h => h.error)
      .filter((e): e is IHolderError => e !== null);
  }

  /** The first non-null error, or null. */
  get firstError(): IHolderError | null {
    return this.errors[0] ?? null;
  }
}
