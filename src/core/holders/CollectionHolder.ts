import { action, computed, makeObservable, observable } from "mobx";

import {
  CollectionFetchFn,
  HolderStatus,
  IApiResponse,
  IHolderError,
  isCancelError,
  isCancelResponse,
  toHolderError,
} from "./HolderTypes";

// ─────────────────────────────────────────────────────────────────────────────

export interface ICollectionHolderOptions<TItem, TArgs = void> {
  /** Вызывается автоматически из `load()` / `refresh()`. */
  onFetch?: CollectionFetchFn<TItem, TArgs>;
  /** Извлекатель ключа для CRUD-хелперов (обновление/удаление по id). */
  keyExtractor?: (item: TItem) => string | number;
}

export interface ICollectionHolderResult<TItem, TError extends IHolderError> {
  data: TItem[] | null;
  error: TError | null;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Холдер для **плоского списка** элементов без серверной пагинации.
 * Подходит для небольших наборов данных, выпадающих списков, справочников и т.п.
 *
 * Возможности:
 * - Полный жизненный цикл + тихое обновление
 * - Встроенные CRUD-хелперы: `appendItem`, `prependItem`, `updateItem`, `removeItem`
 * - Метод `fromApi()` с поддержкой извлекателя (для вложенных форм `{ data: [...] }`)
 * - `load()` / `refresh()` для авто-загрузки через опции
 *
 * @example
 * ```ts
 * categoriesHolder = new CollectionHolder<CategoryDto>({
 *   onFetch: () => this._api.getCategories(),
 * });
 *
 * async load() {
 *   await this.categoriesHolder.load();
 * }
 *
 * // С вложенным ответом:
 * await this.categoriesHolder.fromApi(
 *   () => this._api.getCategories(),
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
  status = HolderStatus.Idle;
  error: TError | null = null;

  private readonly _onFetch?: CollectionFetchFn<TItem, TArgs>;
  private readonly _keyExtractor?: (item: TItem) => string | number;
  private _pendingFetch: { cancel?: () => void } | null = null;

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
    this.status = HolderStatus.Loading;
    this.error = null;
  }

  setRefreshing() {
    this.status = HolderStatus.Refreshing;
    this.error = null;
  }

  setItems(items: TItem[]) {
    this.items = items;
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

  reset() {
    this.items = [];
    this.status = HolderStatus.Idle;
    this.error = null;
  }

  // ─── CRUD-хелперы ─────────────────────────────────────────────────────────

  /** Добавляет элемент в начало списка. */
  prependItem(item: TItem) {
    this.items = [item, ...this.items];
  }

  /** Добавляет элемент в конец списка. */
  appendItem(item: TItem) {
    this.items = [...this.items, item];
  }

  /**
   * Заменяет первый элемент, совпадающий с `predicate`.
   * Если настроен `keyExtractor`, можно передать ключ элемента напрямую.
   */
  updateItem(
    predicate: ((item: TItem) => boolean) | string | number,
    updated: TItem,
  ) {
    const fn = this._normalizePredicate(predicate);

    this.items = this.items.map(item => (fn(item) ? updated : item));
  }

  /**
   * Удаляет первый элемент, совпадающий с `predicate` или ключом.
   */
  removeItem(predicate: ((item: TItem) => boolean) | string | number) {
    const fn = this._normalizePredicate(predicate);

    this.items = this.items.filter(item => !fn(item));
  }

  /**
   * Обновляет элемент, если совпадение найдено; иначе добавляет в конец.
   * Требует настроенного `keyExtractor` или функции-предиката.
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

  // ─── Async-хелперы ────────────────────────────────────────────────────────

  /**
   * Оборачивает API-вызов, автоматически управляя состоянием загрузки.
   *
   * Поддерживает как плоский ответ `TItem[]`, так и вложенный — через
   * необязательный `extractor`, например `res => res.data ?? []`.
   *
   * @example
   * ```ts
   * // Плоский ответ: API возвращает TItem[] напрямую
   * await this.holder.fromApi(() => this._api.getItems());
   *
   * // Вложенный ответ: API возвращает { data: TItem[], count: number }
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

      if (isCancelResponse(res)) return { data: null, error: null };

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
      this._pendingFetch = null;

      if (isCancelError(e)) return { data: null, error: null };

      const err = toHolderError(e) as unknown as TApiError;

      this.setError(err as unknown as TError);

      return { data: null, error: err };
    }
  }

  /**
   * Вызывает `onFetch` из опций конструктора (полная загрузка).
   */
  async load(
    ..._args: TArgs extends void ? [] : [args: TArgs]
  ): Promise<ICollectionHolderResult<TItem, TError>> {
    return this._runFetch(_args[0] as TArgs, false);
  }

  /**
   * Вызывает `onFetch` тихо — старые элементы остаются видны.
   */
  async refresh(
    ..._args: TArgs extends void ? [] : [args: TArgs]
  ): Promise<ICollectionHolderResult<TItem, TError>> {
    return this._runFetch(_args[0] as TArgs, true);
  }

  // ─── Приватное ────────────────────────────────────────────────────────────

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

    this._pendingFetch?.cancel?.();

    if (isRefresh) {
      this.setRefreshing();
    } else {
      this.setLoading();
    }

    const promise = this._onFetch(args);

    this._pendingFetch = promise as any;

    try {
      const res = await promise;

      this._pendingFetch = null;

      if (isCancelResponse(res)) return { data: null, error: null };

      if (res.error) {
        this.setError(res.error as unknown as TError);

        return { data: null, error: res.error as unknown as TError };
      }

      const items = (res.data ?? []) as TItem[];

      this.setItems(items);

      return { data: items, error: null };
    } catch (e) {
      this._pendingFetch = null;

      if (isCancelError(e)) return { data: null, error: null };

      const err = toHolderError(e) as TError;

      this.setError(err);

      return { data: null, error: err };
    }
  }
}
