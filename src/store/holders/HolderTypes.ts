// ─────────────────────────────────────────────────────────────────────────────
// Holder Types — shared primitives for the *Holder system
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lifecycle status of any holder.
 *
 * idle       — not yet requested (initial state after reset)
 * loading    — first/full load in progress (spinner, skeleton)
 * refreshing — silent background reload (data stays visible)
 * success    — last request succeeded
 * error      — last request failed
 */
export type HolderStatus =
  | "idle"
  | "loading"
  | "refreshing"
  | "success"
  | "error";

/** Mutation-only subset (no "refreshing" concept for mutations). */
export type MutationStatus = "idle" | "loading" | "success" | "error";

// ─── Error ───────────────────────────────────────────────────────────────────

/** Normalized error stored inside every holder. */
export interface IHolderError {
  message: string;
  status?: number;
  code?: string | number;
  details?: unknown;
}

/**
 * Converts any thrown value or string into an IHolderError.
 * Used internally by every holder's `fromApi` wrapper.
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

// ─── API response contract ────────────────────────────────────────────────────

/**
 * The shape that **every** API call must return so holders can consume it.
 * Matches what `@force-dev/utils ApiResponse` produces as well as the
 * project's own `ApiService` responses.
 */
export interface IApiResponse<
  TData = unknown,
  TError extends IHolderError = IHolderError,
> {
  data?: TData | null;
  error?: TError | null;
}

// ─── Pagination params ────────────────────────────────────────────────────────

/** Offset-based params sent to the server. */
export interface IOffsetParams {
  offset: number;
  limit: number;
}

/** Page-number-based params (converted to offset internally). */
export interface IPageParams {
  page: number; // 1-based
  pageSize: number;
}

/** Shape that a paginated API endpoint must return. */
export interface IPagedResponse<TItem> {
  data: TItem[];
  /** Items on the current page */
  count?: number;
  /** Total items across ALL pages */
  totalCount?: number;
  offset?: number;
  limit?: number;
}

// ─── Fetch function signatures ────────────────────────────────────────────────

/**
 * onFetch for EntityHolder — returns a single item or null.
 */
export type EntityFetchFn<TData, TArgs = void> = (
  args: TArgs,
) => Promise<IApiResponse<TData>>;

/**
 * onFetch for CollectionHolder — returns an array.
 */
export type CollectionFetchFn<TItem, TArgs = void> = (
  args: TArgs,
) => Promise<IApiResponse<TItem[]>>;

/**
 * onFetch for PagedHolder — receives paging params + custom args.
 * Must return items for the requested page + the server's total count.
 */
export type PagedFetchFn<TItem, TArgs = void> = (
  pagination: IOffsetParams,
  args: TArgs,
) => Promise<IApiResponse<IPagedResponse<TItem>>>;

/**
 * onFetch for InfiniteHolder — receives offset/limit + custom args.
 * Must return the next slice of items + whether more pages exist.
 */
export type InfiniteFetchFn<TItem, TArgs = void> = (
  pagination: IOffsetParams,
  args: TArgs,
) => Promise<IApiResponse<IPagedResponse<TItem>>>;

/**
 * execute function for MutationHolder.
 */
export type MutationFn<TArgs, TData> = (
  args: TArgs,
) => Promise<IApiResponse<TData>>;
