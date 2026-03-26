import { action, computed, makeObservable, observable } from "mobx";

import { CancellablePromise, HolderStatus, IHolderError } from "./HolderTypes";

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Базовый класс для всех холдеров.
 * Управляет статусом жизненного цикла, ошибкой и отменой текущего запроса.
 */
export abstract class BaseHolder<TError extends IHolderError = IHolderError> {
  status = HolderStatus.Idle;
  error: TError | null = null;

  protected _pendingFetch: CancellablePromise | null = null;

  constructor() {
    makeObservable(this, {
      status: observable,
      error: observable.ref,

      isIdle: computed,
      isLoading: computed,
      isRefreshing: computed,
      isBusy: computed,
      isSuccess: computed,
      isError: computed,

      setLoading: action,
      setRefreshing: action,
      setError: action,
    });
  }

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

  setLoading() {
    this.status = HolderStatus.Loading;
    this.error = null;
  }

  setRefreshing() {
    this.status = HolderStatus.Refreshing;
    this.error = null;
  }

  setError(error: TError | IHolderError | string) {
    this.status = HolderStatus.Error;
    this.error =
      typeof error === "string"
        ? ({ message: error } as TError)
        : (error as TError);
  }
}
