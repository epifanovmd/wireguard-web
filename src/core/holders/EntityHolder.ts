import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

import {
  EntityFetchFn,
  HolderStatus,
  IApiResponse,
  IHolderError,
  isCancelError,
  isCancelResponse,
  toHolderError,
} from "./HolderTypes";

// ─────────────────────────────────────────────────────────────────────────────

export interface IEntityHolderOptions<TData, TArgs = void> {
  /** Вызывается автоматически из `load()` / `refresh()`. */
  onFetch?: EntityFetchFn<TData, TArgs>;
  /** Начальные данные (статус сразу становится 'success'). */
  initialData?: TData;
}

export interface IEntityHolderResult<TData, TError extends IHolderError> {
  data: TData | null;
  error: TError | null;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Холдер для **одной сущности** — детальные страницы, профиль, текущий
 * пользователь и т.п.
 *
 * Возможности:
 * - Полный жизненный цикл: idle → loading → success / error
 * - Тихое фоновое обновление (данные остаются видны, `isRefreshing` = true)
 * - Метод `fromApi()` сам управляет состоянием загрузки, нормализацией ошибок
 *   и сохранением данных
 * - `load()` / `refresh()` для сторов, передающих `onFetch` в опциях
 * - Полная MobX-реактивность (все поля и вычисляемые свойства)
 *
 * @example
 * ```ts
 * // Ручное управление (явный вызов fromApi в методе стора)
 * articleHolder = new EntityHolder<ArticleDto>();
 *
 * async loadArticle(id: string) {
 *   return this.articleHolder.fromApi(() => this._api.getArticle(id));
 * }
 *
 * // Авто-загрузка через onFetch
 * articleHolder = new EntityHolder<ArticleDto, string>({
 *   onFetch: id => this._api.getArticle(id),
 * });
 *
 * async loadArticle(id: string) {
 *   return this.articleHolder.load(id);
 * }
 * ```
 */
export class EntityHolder<
  TData,
  TArgs = void,
  TError extends IHolderError = IHolderError,
> {
  data: TData | null = null;
  status = HolderStatus.Idle;
  error: TError | null = null;

  private readonly _onFetch?: EntityFetchFn<TData, TArgs>;
  private _pendingFetch: { cancel?: () => void } | null = null;

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
      isReady: computed,

      setLoading: action,
      setRefreshing: action,
      setData: action,
      setError: action,
      reset: action,
    });

    this._onFetch = options?.onFetch;

    if (options?.initialData !== undefined) {
      this.data = options.initialData;
      this.status = HolderStatus.Success;
    }
  }

  // ─── Computed ──────────────────────────────────────────────────────────────

  /** Запрос ещё не выполнялся. */
  get isIdle() {
    return this.status === "idle";
  }

  /** Идёт первичная загрузка (данных ещё нет). */
  get isLoading() {
    return this.status === "loading";
  }

  /** Тихое фоновое обновление (старые данные остаются видны). */
  get isRefreshing() {
    return this.status === "refreshing";
  }

  /** True, пока идёт loading ИЛИ refreshing. */
  get isBusy() {
    return this.status === "loading" || this.status === "refreshing";
  }

  /** Последний запрос завершился успешно. */
  get isSuccess() {
    return this.status === "success";
  }

  /** Последний запрос завершился с ошибкой. */
  get isError() {
    return this.status === "error";
  }

  /** Успех, но сервер вернул null / пустой ответ. */
  get isEmpty() {
    return this.isSuccess && this.data === null;
  }

  /** Данные не null (независимо от текущего статуса). */
  get isFilled() {
    return this.data !== null;
  }

  /** Хотя бы один запрос завершён (успешно или с ошибкой). Не idle и не loading. */
  get isReady() {
    return this.isSuccess || this.isError;
  }

  // ─── Ручные сеттеры состояния ─────────────────────────────────────────────

  setLoading() {
    this.status = HolderStatus.Loading;
    this.error = null;
  }

  setRefreshing() {
    this.status = HolderStatus.Refreshing;
    this.error = null;
  }

  setData(data: TData) {
    this.data = data;
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

  /** Очищает данные и сбрасывает статус в idle. */
  reset() {
    this.data = null;
    this.status = HolderStatus.Idle;
    this.error = null;
  }

  // ─── Async-хелперы ────────────────────────────────────────────────────────

  /**
   * Оборачивает **любой** API-вызов, возвращающий `{ data?, error? }`.
   * Автоматически управляет состоянием загрузки, нормализацией ошибок и
   * сохранением данных.
   *
   * Передайте `{ refresh: true }`, чтобы старые данные оставались видны во
   * время перезагрузки.
   *
   * @example
   * ```ts
   * const { data, error } = await this.userHolder.fromApi(
   *   () => this._api.getUser(id),
   * );
   * ```
   */
  async fromApi<TApiError extends IHolderError = TError>(
    fn: () => Promise<IApiResponse<TData, TApiError>>,
    options?: { refresh?: boolean },
  ): Promise<IEntityHolderResult<TData, TApiError>> {
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
        this.setData(res.data);

        return { data: res.data, error: null };
      }

      // Сервер вернул успех без тела (204 / пустые данные)
      runInAction(() => {
        this.data = null;
        this.status = HolderStatus.Success;
      });

      return { data: null, error: null };
    } catch (e) {
      this._pendingFetch = null;

      if (isCancelError(e)) return { data: null, error: null };

      const err = toHolderError(e) as unknown as TApiError;

      this.setError(err as unknown as TError);

      return { data: null, error: err };
    }
  }

  /**
   * Вызывает `onFetch`, переданный в опциях конструктора.
   * Выполняет полную загрузку (спиннер, при ошибке очищает старые данные).
   *
   * @example
   * ```ts
   * await this.userHolder.load(userId);
   * ```
   */
  async load(
    ..._args: TArgs extends void ? [] : [args: TArgs]
  ): Promise<IEntityHolderResult<TData, TError>> {
    const args = _args[0] as TArgs;

    return this._runFetch(args, false);
  }

  /**
   * Вызывает `onFetch` тихо — старые данные остаются видны.
   * Используется для pull-to-refresh или фонового обновления.
   */
  async refresh(
    ..._args: TArgs extends void ? [] : [args: TArgs]
  ): Promise<IEntityHolderResult<TData, TError>> {
    const args = _args[0] as TArgs;

    return this._runFetch(args, true);
  }

  // ─── Приватное ────────────────────────────────────────────────────────────

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

      if (res.data != null) {
        this.setData(res.data);

        return { data: res.data, error: null };
      }

      runInAction(() => {
        this.data = null;
        this.status = HolderStatus.Success;
      });

      return { data: null, error: null };
    } catch (e) {
      this._pendingFetch = null;

      if (isCancelError(e)) return { data: null, error: null };

      const err = toHolderError(e) as TError;

      this.setError(err);

      return { data: null, error: err };
    }
  }
}
