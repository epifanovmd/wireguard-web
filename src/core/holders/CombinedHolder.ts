import { computed, makeObservable } from "mobx";

import { IHolderError } from "./HolderTypes";

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Минимальный интерфейс, которому должен соответствовать холдер, чтобы
 * использоваться внутри CombinedHolder.
 * Совместим с EntityHolder, CollectionHolder, PagedHolder, InfiniteHolder и
 * MutationHolder (у которого нет `isRefreshing`/`isBusy`).
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
 * Агрегирует реактивный статус нескольких холдеров в один объект.
 *
 * Полезен для страниц, которые выполняют несколько параллельных API-запросов
 * и нуждаются в едином состоянии загрузки/ошибки для управления UI.
 *
 * Правила:
 * - `isLoading`    — true, если **любой** холдер загружается
 * - `isRefreshing` — true, если **любой** холдер обновляется
 * - `isBusy`       — true, если **любой** холдер занят (loading ИЛИ refreshing)
 * - `isError`      — true, если **любой** холдер в состоянии ошибки
 * - `isSuccess`    — true только если **все** холдеры в состоянии success
 * - `errors`       — не-null ошибки из всех холдеров
 * - `firstError`   — первая не-null ошибка (удобно для toast/alert)
 *
 * @example
 * ```ts
 * pageHolder = new CombinedHolder([this.profileHolder, this.settingsHolder]);
 *
 * // В VM:
 * isLoading: store.pageHolder.isLoading,
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

  /** True, если любой холдер в состоянии `loading`. */
  get isLoading(): boolean {
    return this._holders.some(h => h.isLoading);
  }

  /** True, если любой холдер в состоянии `refreshing`. */
  get isRefreshing(): boolean {
    return this._holders.some(h => h.isRefreshing ?? false);
  }

  /** True, если любой холдер загружается или обновляется. */
  get isBusy(): boolean {
    return this._holders.some(h => h.isBusy ?? h.isLoading);
  }

  /** True, если любой холдер в состоянии `error`. */
  get isError(): boolean {
    return this._holders.some(h => h.isError);
  }

  /** True только если все холдеры в состоянии `success`. */
  get isSuccess(): boolean {
    return this._holders.every(h => h.isSuccess);
  }

  /** Все не-null ошибки из всех холдеров. */
  get errors(): IHolderError[] {
    return this._holders
      .map(h => h.error)
      .filter((e): e is IHolderError => e !== null);
  }

  /** Первая не-null ошибка, или null. */
  get firstError(): IHolderError | null {
    return this.errors[0] ?? null;
  }
}
