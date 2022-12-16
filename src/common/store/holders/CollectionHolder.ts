import { makeAutoObservable } from "mobx";

export enum CollectionLoadState {
  initializing = "initializing",
  ready = "ready",
  loading = "loading",
  error = "error",
}

interface IDataHolderError {
  type?: string;
  code?: string;
  msg: string;
}

type Collection<T> = T[];

export class CollectionHolder<T> {
  public error?: IDataHolderError;
  public d: Collection<T> = [];

  private _state: CollectionLoadState = CollectionLoadState.initializing;

  constructor(data?: Collection<T>) {
    if (data) {
      this.setData(data);
    }
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public get isLoadingAllowed(): boolean {
    return (
      this._state === CollectionLoadState.ready ||
      this._state === CollectionLoadState.error
    );
  }

  public get isLoading() {
    return this._state === CollectionLoadState.loading;
  }

  public get isReady() {
    return this._state === CollectionLoadState.ready;
  }

  public get isError() {
    return this._state === CollectionLoadState.error;
  }

  public get isEmpty() {
    return !this.d.length;
  }

  public setData(data: Collection<T>) {
    this.d = data;
    this._setState(CollectionLoadState.ready);

    return this;
  }

  public clear() {
    this.d = [];
    this._setState(CollectionLoadState.initializing);

    return this;
  }

  public setError(error: IDataHolderError) {
    this.error = error;
    this._setState(CollectionLoadState.error);

    return this;
  }

  public setLoading(clear: boolean = true) {
    if (clear) {
      this.d = [];
    }
    this._setState(CollectionLoadState.loading);

    return this;
  }

  public setReady() {
    this._setState(CollectionLoadState.ready);

    return this;
  }

  private _setState(state: CollectionLoadState) {
    this._state = state;
  }
}
