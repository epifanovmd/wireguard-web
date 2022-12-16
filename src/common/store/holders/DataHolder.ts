import isEmpty from "lodash/isEmpty";
import { makeAutoObservable } from "mobx";

enum DataHolderState {
  READY = 0,
  INITIALIZATION = 1,
  LOADING = 2,
  ERROR = 500,
}

interface IDataHolderError {
  type?: string;
  code?: string;
  msg: string;
}

export interface IDataHolderState {
  isLoading: boolean;
  isError: boolean;
  isReady: boolean;
  isFilled: boolean;
  isEmpty: boolean;
}

export class DataHolder<T> implements IDataHolderState {
  public d: T | undefined = undefined as any;
  public error?: IDataHolderError;
  private _state: DataHolderState = DataHolderState.INITIALIZATION;

  constructor(data?: T) {
    if (data) {
      this.setData(data);
    }
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public get isReady() {
    return this._state === DataHolderState.READY;
  }

  public get isLoading() {
    return this._state === DataHolderState.LOADING;
  }

  public get isError() {
    return this._state === DataHolderState.ERROR;
  }

  public get isEmpty() {
    return this.isReady && isEmpty(this.d);
  }

  public get isFilled() {
    return this.isReady && !isEmpty(this.d);
  }

  public setLoading() {
    this._state = DataHolderState.LOADING;

    return this;
  }

  public clear() {
    this.d = undefined;
    this._state = DataHolderState.INITIALIZATION;

    return this;
  }

  public setPending() {
    this._state = DataHolderState.INITIALIZATION;

    return this;
  }

  public setData(data: T) {
    this.d = data;
    this._state = DataHolderState.READY;

    return this;
  }

  public setError(error: IDataHolderError) {
    this.error = error;
    this._state = DataHolderState.ERROR;

    return this;
  }
}
