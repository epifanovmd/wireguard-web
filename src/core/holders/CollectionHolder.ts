import { action, makeObservable } from "mobx";

import { BaseListHolder } from "./BaseListHolder";
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
> extends BaseListHolder<TItem, TError> {
  private readonly _onFetch?: CollectionFetchFn<TItem, TArgs>;

  constructor(options?: ICollectionHolderOptions<TItem, TArgs>) {
    super(options?.keyExtractor);

    makeObservable(this, {
      setItems: action,
      reset: action,
    });

    this._onFetch = options?.onFetch;
  }

  // ─── State setters ────────────────────────────────────────────────────────

  setItems(items: TItem[]) {
    this.items = items;
    this.status = HolderStatus.Success;
    this.error = null;
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
   * Удаляет первый элемент, совпадающий с `predicate` или ключом.
   */
  removeItem(predicate: ((item: TItem) => boolean) | string | number) {
    const fn = this._normalizePredicate(predicate);

    this.items = this.items.filter(item => !fn(item));
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
