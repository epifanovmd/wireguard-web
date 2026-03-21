// ─────────────────────────────────────────────────────────────────────────────
// Holder Types — общие примитивы системы холдеров
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Статус жизненного цикла любого холдера.
 *
 * idle       — запрос ещё не выполнялся (начальное состояние после reset)
 * loading    — идёт первичная/полная загрузка (скелетон, спиннер)
 * refreshing — тихое фоновое обновление (старые данные остаются видны)
 * success    — последний запрос завершился успешно
 * error      — последний запрос завершился с ошибкой
 */
export enum HolderStatus {
  Idle = "idle",
  Loading = "loading",
  Refreshing = "refreshing",
  Success = "success",
  Error = "error",
}

/** Статусы мутации — подмножество без понятия «refreshing». */
export enum MutationStatus {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
  Error = "error",
}

// ─── Отменяемый промис ───────────────────────────────────────────────────────

/**
 * Промис с опциональным методом cancel().
 * Используется в холдерах для отмены предыдущего запроса при race condition.
 */
export type CancellablePromise = Promise<unknown> & { cancel?: () => void };

// ─── Ошибка ──────────────────────────────────────────────────────────────────

/** Нормализованная ошибка, хранящаяся внутри каждого холдера. */
export interface IHolderError {
  message: string;
  status?: number;
  code?: string | number;
  details?: unknown;
}

/**
 * Проверяет, является ли ответ результатом отменённого axios-запроса.
 * ApiService резолвит (не бросает) отменённые запросы с флагом `isCanceled: true`.
 * Используется холдерами, чтобы не затирать состояние при race condition.
 */
export function isCancelResponse(res: unknown): boolean {
  return (
    typeof res === "object" &&
    res !== null &&
    "isCanceled" in res &&
    (res as { isCanceled: unknown }).isCanceled === true
  );
}

/**
 * Проверяет, является ли брошенное значение ошибкой отмены axios.
 * Запасной вариант на случай если промис всё же реджектится.
 */
export function isCancelError(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "__CANCEL__" in e &&
    (e as { __CANCEL__: unknown }).__CANCEL__ === true
  );
}

/**
 * Преобразует любое брошенное значение или строку в `IHolderError`.
 * Используется внутри метода `fromApi` каждого холдера.
 */
export function toHolderError(e: unknown): IHolderError {
  if (e instanceof Error) {
    return {
      message: e.message,
      code: (e as { code?: string | number }).code,
    };
  }
  if (typeof e === "string") return { message: e };

  return { message: "Unknown error", details: e };
}

// ─── Контракт ответа API ─────────────────────────────────────────────────────

/**
 * Форма, которую **каждый** API-вызов должен возвращать, чтобы холдеры могли
 * его обработать.
 */
export interface IApiResponse<
  TData = unknown,
  TError extends IHolderError = IHolderError,
> {
  data?: TData | null;
  error?: TError | null;
}

// ─── Параметры пагинации ─────────────────────────────────────────────────────

/** Offset-параметры, отправляемые на сервер. */
export interface IOffsetParams {
  offset: number;
  limit: number;
}

/** Параметры на основе номера страницы (внутри конвертируются в offset). */
export interface IPageParams {
  page: number; // 1-based
  pageSize: number;
}

/** Форма ответа, которую должен возвращать постраничный API-эндпоинт. */
export interface IPagedResponse<TItem> {
  data: TItem[];
  /** Элементов на текущей странице */
  count?: number;
  /** Всего элементов по всем страницам */
  totalCount?: number;
  offset?: number;
  limit?: number;
}

// ─── Сигнатуры функций загрузки ───────────────────────────────────────────────

/**
 * `onFetch` для EntityHolder — возвращает одну сущность или null.
 */
export type EntityFetchFn<TData, TArgs = void> = (
  args: TArgs,
) => Promise<IApiResponse<TData>>;

/**
 * `onFetch` для CollectionHolder — возвращает массив элементов.
 */
export type CollectionFetchFn<TItem, TArgs = void> = (
  args: TArgs,
) => Promise<IApiResponse<TItem[]>>;

/**
 * `onFetch` для PagedHolder — принимает параметры пагинации + пользовательские аргументы.
 * Должна вернуть элементы текущей страницы и общее количество на сервере.
 */
export type PagedFetchFn<TItem, TArgs = void> = (
  pagination: IOffsetParams,
  args: TArgs,
) => Promise<IApiResponse<IPagedResponse<TItem>>>;

/**
 * `onFetch` для InfiniteHolder — принимает offset/limit + пользовательские аргументы.
 * Должна вернуть очередной срез элементов и флаг наличия следующих страниц.
 */
export type InfiniteFetchFn<TItem, TArgs = void> = (
  pagination: IOffsetParams,
  args: TArgs,
) => Promise<IApiResponse<IPagedResponse<TItem>>>;

/**
 * Функция мутации для MutationHolder.
 */
export type MutationFn<TArgs, TData> = (
  args: TArgs,
) => Promise<IApiResponse<TData>>;
