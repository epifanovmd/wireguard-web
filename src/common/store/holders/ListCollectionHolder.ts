import debounce from "lodash/debounce";
import { makeAutoObservable } from "mobx";

export enum ListCollectionLoadState {
  initializing = "initializing",
  ready = "ready",
  loading = "loading",
  refreshing = "refreshing",
  loadingMore = "loadingMore",
  error = "error",
}

interface IDataHolderError {
  type?: string;
  code?: string;
  msg: string;
}

type Collection<T> = T[];

// eslint-disable-next-line symbol-description
const ITEM_KEY = Symbol();

type KeyExtractor<T> = (item: T) => string | number;

interface IListEvents {
  performLoad(): void;
  performRefresh(): void;
  performLoadMore(): void;
}

export interface RefreshArgs {
  offset: number;
  limit: number;
}

interface IOptions<Data, Args = any> {
  keyExtractor: KeyExtractor<Data>;
  onFetchData: (args: RefreshArgs & Args) => Promise<Data[]>;
  fetchDebounceWait?: number;
  pageSize?: number;
  reverse?: boolean;
}

interface IUpdateOptions {
  replace?: boolean;
}

export class ListCollectionHolder<Data, Args = any> implements IListEvents {
  public error?: IDataHolderError;
  public d: Collection<Data> = [];
  _isEndReached: boolean = false;
  private _state: ListCollectionLoadState =
    ListCollectionLoadState.initializing;

  private _opts!: IOptions<Data, Args>;
  private _lastRefreshArgs?: RefreshArgs;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public get isLoadingAllowed(): boolean {
    return (
      this._state === ListCollectionLoadState.ready ||
      this._state === ListCollectionLoadState.error
    );
  }

  public get isLoading() {
    return this._state === ListCollectionLoadState.loading;
  }

  public get isLoadingMoreAllowed(): boolean {
    return (
      (this._state === ListCollectionLoadState.ready ||
        this._state === ListCollectionLoadState.error) &&
      !this._isEndReached
    );
  }

  public get isLoadingMore() {
    return this._state === ListCollectionLoadState.loadingMore;
  }

  public get isReady() {
    return this._state === ListCollectionLoadState.ready;
  }

  public get isError() {
    return this._state === ListCollectionLoadState.error;
  }

  public get isEmpty() {
    return !this.d.length;
  }

  public initialize(opts: IOptions<Data, Args>): void {
    this._opts = {
      ...opts,
    };

    this._setState(ListCollectionLoadState.ready);
  }

  public updateData(data: Collection<Data>, opts?: IUpdateOptions) {
    let merge = false;

    switch (this._state) {
      case ListCollectionLoadState.loadingMore:
      case ListCollectionLoadState.ready:
        merge = true;
        break;
      case ListCollectionLoadState.refreshing:
      case ListCollectionLoadState.loading:
      default:
        merge = false;
        break;
    }

    if (opts && opts.replace) {
      merge = false;
    }

    this.d = merge ? this._mergeData(this.d, data) : data;

    this._isEndReached =
      this._lastPageSize > 0 && data.length < this._lastPageSize;
    this._setState(ListCollectionLoadState.ready);

    return this;
  }

  public clear() {
    this.d = [];
    this.error = undefined;
    this._isEndReached = false;
    this._lastRefreshArgs = undefined;
    this._setState(ListCollectionLoadState.ready);
  }

  public setError(error: IDataHolderError) {
    this.error = error;
    this._setState(ListCollectionLoadState.error);

    return this;
  }

  public setLoading(clear: boolean = true) {
    if (clear) {
      this.d = [];
    }
    this._setState(ListCollectionLoadState.loading);

    return this;
  }

  public setRefreshing() {
    this._setState(ListCollectionLoadState.refreshing);

    return this;
  }

  public setLoadingMore() {
    this._setState(ListCollectionLoadState.loadingMore);

    return this;
  }

  public keyExtractor(item: Data) {
    let cachedKey = (item as any)[ITEM_KEY];

    if (!cachedKey) {
      cachedKey = this._opts.keyExtractor(item);
      (item as any)[ITEM_KEY] = cachedKey;
    }

    return cachedKey;
  }

  public performLoadMore(args?: Args) {
    if (this.isLoadingMoreAllowed) {
      this.setLoadingMore();

      return this._raiseOnFetchData(false, args) ?? Promise.resolve([]);
    }

    return Promise.resolve([]);
  }

  public performRefresh(args?: Args) {
    this._isEndReached = false;

    if (this.isLoadingAllowed) {
      if (this.isEmpty) {
        this.setLoading();
      } else {
        this.setRefreshing();
      }

      return this._raiseOnFetchData(true, args) ?? Promise.resolve([]);
    }

    return Promise.resolve([]);
  }

  public performLoad(args?: Args) {
    if (this.isLoadingAllowed) {
      this.clear();
      this.setLoading();

      return this._raiseOnFetchData(false, args) ?? Promise.resolve([]);
    }

    return Promise.resolve([]);
  }

  private _setState(state: ListCollectionLoadState) {
    this._state = state;
  }

  private get _refreshArgs(): RefreshArgs {
    return {
      offset: this.d.length,
      limit: this._opts.pageSize || 0,
    };
  }

  private get _lastPageSize(): number {
    return (this._opts.pageSize || 0) > 0 &&
      this._lastRefreshArgs &&
      this._lastRefreshArgs.limit > 0
      ? this._lastRefreshArgs.limit
      : 0;
  }

  private _mergeData(
    source: Collection<Data>,
    merge: Collection<Data>,
  ): Collection<Data> {
    if (merge.length === 0) {
      return source;
    }

    const result = [...source];

    merge.forEach(d => {
      const index = result.findIndex(
        i => this.keyExtractor(i) === this.keyExtractor(d),
      );

      if (index === -1) {
        if (this._opts.reverse) {
          result.unshift(d);
        } else {
          result.push(d);
        }
      } else {
        result[index] = d;
      }
    });

    return result;
  }

  private _raiseOnFetchData(resetArgs?: boolean, args: Args = {} as Args) {
    return debounce(() => {
      if (resetArgs) {
        this._lastRefreshArgs = {
          offset: 0,
          limit: this._opts.pageSize || 0,
        };
      } else {
        this._lastRefreshArgs = this._refreshArgs;
      }
      const refreshArgs: RefreshArgs & Args = {
        ...args,
        ...this._lastRefreshArgs,
      };

      return this._opts.onFetchData(refreshArgs);
    }, this._opts.fetchDebounceWait)();
  }
}
