import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

import {
  IApiResponse,
  IHolderError,
  isCancelError,
  isCancelResponse,
  MutationFn,
  MutationStatus,
  toHolderError,
} from "./HolderTypes";

// ─────────────────────────────────────────────────────────────────────────────

export interface IMutationHolderOptions<TArgs, TData> {
  /** API-вызов для выполнения. Можно задать здесь или передать инлайн в `execute()`. */
  onMutate?: MutationFn<TArgs, TData>;
}

export interface IMutationHolderResult<
  TData,
  TError extends IHolderError = IHolderError,
> {
  data: TData | null;
  error: TError | null;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Холдер для **одной API-мутации** — создание, обновление, удаление,
 * запуск, остановка и т.п.
 *
 * В отличие от холдеров данных, мутации:
 * - Не имеют состояния «refreshing» (либо выполняется, либо нет)
 * - Опционально хранят последний успешный ответ в `data`
 * - Предоставляют `isLoading` для блокировки кнопок / показа спиннеров
 *
 * Возможности:
 * - `execute(args?)` — выполняет мутацию, сохраняет результат/ошибку
 * - `reset()` — сбрасывает в idle
 * - `onMutate` можно задать в опциях ИЛИ передать инлайн в `execute()`
 * - Полная MobX-реактивность
 *
 * @example
 * ```ts
 * // В сторе
 * createCommentMutation = new MutationHolder<ICreateCommentDto, CommentDto>();
 *
 * async createComment(postId: string, params: ICreateCommentDto) {
 *   return this.createCommentMutation.execute(
 *     params,
 *     args => this._api.createComment(postId, args),
 *   );
 * }
 *
 * // Или с onMutate в опциях:
 * deleteCommentMutation = new MutationHolder<string, void>({
 *   onMutate: id => this._api.deleteComment(id),
 * });
 *
 * async deleteComment(id: string) {
 *   return this.deleteCommentMutation.execute(id);
 * }
 * ```
 */
export class MutationHolder<
  TArgs = void,
  TData = void,
  TError extends IHolderError = IHolderError,
> {
  /** Данные последнего успешного ответа. */
  data: TData | null = null;
  status = MutationStatus.Idle;
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

  // ─── Computed ────────────────────────────────────────────────────────────

  get isIdle() {
    return this.status === MutationStatus.Idle;
  }

  get isLoading() {
    return this.status === MutationStatus.Loading;
  }

  get isSuccess() {
    return this.status === MutationStatus.Success;
  }

  get isError() {
    return this.status === MutationStatus.Error;
  }

  // ─── Действия ────────────────────────────────────────────────────────────

  reset() {
    this.data = null;
    this.status = MutationStatus.Idle;
    this.error = null;
  }

  // ─── Выполнение ──────────────────────────────────────────────────────────

  /**
   * Выполняет мутацию.
   *
   * Можно использовать `onMutate` из опций конструктора или передать
   * функцию инлайн вторым аргументом.
   *
   * @example
   * ```ts
   * // Через onMutate из опций:
   * const { data, error } = await this.deleteMutation.execute(id);
   *
   * // Инлайн (onMutate в опциях не нужен):
   * const { data, error } = await this.createMutation.execute(
   *   params,
   *   args => this._api.createItem(categoryId, args),
   * );
   * ```
   */
  async execute(
    ..._params: TArgs extends void
      ? [args?: never, fn?: MutationFn<TArgs, TData>]
      : [args: TArgs, fn?: MutationFn<TArgs, TData>]
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
      this.status = MutationStatus.Loading;
      this.error = null;
    });

    try {
      const res = await fn(args);

      if (isCancelResponse(res)) return { data: null, error: null };

      if (res.error) {
        runInAction(() => {
          this.status = MutationStatus.Error;
          this.error = res.error as unknown as TError;
        });

        return { data: null, error: res.error as unknown as TError };
      }

      runInAction(() => {
        this.data = (res.data ?? null) as TData | null;
        this.status = MutationStatus.Success;
        this.error = null;
      });

      return { data: (res.data ?? null) as TData | null, error: null };
    } catch (e) {
      if (isCancelError(e)) return { data: null, error: null };

      const err = toHolderError(e) as TError;

      runInAction(() => {
        this.status = MutationStatus.Error;
        this.error = err;
      });

      return { data: null, error: err };
    }
  }

  /**
   * Удобная обёртка — то же, что `execute()`, но принимает функцию без
   * аргументов и напрямую возвращает ответ в формате `{ data?, error? }`.
   *
   * Полезно, когда нужно передать сырой ответ вызывающему коду без
   * дополнительной распаковки.
   */
  async run(
    fn: () => Promise<IApiResponse<TData>>,
  ): Promise<IMutationHolderResult<TData, TError>> {
    runInAction(() => {
      this.status = MutationStatus.Loading;
      this.error = null;
    });

    try {
      const res = await fn();

      if (isCancelResponse(res)) return { data: null, error: null };

      if (res.error) {
        runInAction(() => {
          this.status = MutationStatus.Error;
          this.error = res.error as unknown as TError;
        });

        return { data: null, error: res.error as unknown as TError };
      }

      runInAction(() => {
        this.data = (res.data ?? null) as TData | null;
        this.status = MutationStatus.Success;
      });

      return { data: (res.data ?? null) as TData | null, error: null };
    } catch (e) {
      if (isCancelError(e)) return { data: null, error: null };

      const err = toHolderError(e) as TError;

      runInAction(() => {
        this.status = MutationStatus.Error;
        this.error = err;
      });

      return { data: null, error: err };
    }
  }
}
