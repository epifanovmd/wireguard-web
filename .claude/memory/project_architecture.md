---
name: Project Architecture
description: Vite build, TanStack routing, MobX state, API layer, Socket.IO, theming, component library, project structure
type: project
---

## Project Structure

```
src/
├── api/                    # REST API client
│   ├── Api.service.ts      # Axios instance, interceptors, instancePromise, QueryRace
│   ├── Api.types.ts        # ApiError, ApiServiceResponse, IApiService
│   ├── QueryRace.ts        # Cancels duplicate in-flight requests
│   ├── api-gen/            # Auto-generated from Swagger (DO NOT EDIT)
│   │   ├── Api.ts          # Generated API methods (extends HttpClient)
│   │   ├── data-contracts.ts  # Enums, DTOs, Params types
│   │   └── http-client.ts  # Abstract HttpClient, ApiResponse, types
│   └── hooks/useApi.ts
├── utils/                  # Shared utilities (NO business logic)
│   ├── typeGuards, lambdaValue, enumValues, string, pluralizeHelper
│   ├── deepKeys, flatten, timeoutManager, formatter/
│   └── regex, noop, downloadBlob, pluralize
├── hooks/                  # Custom hooks (shared + app-specific)
│   ├── usePasskyAuth, mergeRefs, useBoolean, useMergeCallback
│   └── usePeerLive, usePeersSelectOptions, useServersSelectOptions, etc.
├── di/                     # IoC: container, createServiceDecorator, iocHook, disposer, types
├── core/                   # Core services
│   ├── auth/               # AuthTokenStore (localStorage), AuthSessionService (refresh dedup)
│   ├── permissions/        # hasPermission (wildcard), isAdminRole, canAccess
│   ├── notifications/      # NotificationService, ToastProvider
│   ├── theme/              # ThemeProvider (light/dark), ThemeContext, useTheme
│   └── env.ts              # BASE_URL, SOCKET_BASE_URL from import.meta.env
├── socket/                 # Socket.IO layer
│   ├── transport/          # SocketTransport (reconnect, EmitQueue, PersistentListeners)
│   ├── wg/                 # WgSocketService + hooks
│   ├── events/             # Typed server/client events
│   └── hooks/              # useSocketStatus
├── store/                  # MobX stores (IoC singletons)
│   ├── holders/            # EntityHolder, PagedHolder, InfiniteHolder, CollectionHolder,
│   │                       # MutationHolder, PollingHolder, CombinedHolder, HolderTypes
│   └── models/             # DataModelBase, createEnumModelBase
├── models/                 # DataModelBase subclasses (computed wrappers over DTOs)
├── components/
│   ├── slots/              # createSlot, useSlotProps (compound components)
│   ├── ui/                 # 97+ Radix + Tailwind components
│   ├── layouts/            # AuthLayout, PageLayout, PageHeader
│   ├── shared/             # ServerActions, PeerActions, QrCodeModal
│   ├── tables/             # Column definitions
│   └── charts/             # Recharts components
├── pages/                  # Route page components
├── routes/                 # TanStack file-based routes
├── hooks/                  # Custom hooks
├── styles/                 # Tailwind + CSS variables
├── App.tsx                 # Root: providers + router
├── router.tsx              # TanStack config
└── routeTree.gen.ts        # Auto-generated (DO NOT EDIT)
```

## Build (Vite 6)

Plugins: TanStack Router (auto route generation), Tailwind CSS.
Path aliases: `@api`, `@store`, `@components`, `@models`, `@core`, `@utils`, `@hooks`, `@di`, `@socket` (без `~` префикса).
Output: `dist/` (SPA). Target: ES2022.

## IoC (src/di/)

Internal DI infrastructure (replaced @force-dev/utils). Uses inversify under the hood.

- `createServiceDecorator<IService>()` — creates type + decorator
- Class: `@IService({ inSingleton: true })`
- Constructor injection: `@IService() private svc: IService`
- React hook: `iocHook(IService)` → `useService()`

**Never import from @force-dev.** All infrastructure is local (`@utils`, `@hooks`, `@di`, `@store`).

## Routing (TanStack React Router)

File-based из `src/routes/`. `routeTree.gen.ts` генерируется автоматически — **НЕ редактировать**.

Guards: `beforeLoad()` в route файлах. `_private.tsx` проверяет `auth.isAuthenticated`.

## State Management (MobX)

Stores — IoC singletons: `@IStoreService({ inSingleton: true })`.
Используют `makeAutoObservable()` для реактивности.

**Data holders** (src/store/holders/):
- `EntityHolder<T, TArgs>` — загрузка/refresh одной entity
- `PagedHolder<T, TArgs>` — серверная пагинация (goToPage/nextPage/prevPage)
- `InfiniteHolder<T, TArgs>` — бесконечная прокрутка (loadMore)
- `CollectionHolder<T, TArgs>` — плоский список
- `MutationHolder<TArgs, TData>` — write операции (execute/run)
- `PollingHolder<T, TArgs>` — авто-поллинг (startPolling/stopPolling)
- `CombinedHolder` — агрегирует статусы нескольких holders

## API Layer

`src/api/Api.service.ts` — implements abstract `instancePromise()` from generated HttpClient.

- **http-client.ts** (generated) — abstract HttpClient, `ApiResponse<R, E>` = `{ data?, error? }`
- **ApiServiceResponse<R>** — extends with `status`, `axiosError`, `axiosResponse`, `isCanceled`
- Request interceptor: `ensureFreshToken()` + `Authorization: Bearer`
- Response interceptor: wraps to ApiResponse, 401 → refresh + retry, network/server → toast
- `QueryRace` — cancels previous request to same endpoint

**`src/api/api-gen/`** — auto-generated from Swagger. **НЕ редактировать.** Regenerate: `yarn generate:api`.
Templates: `scripts/api-templates/`. Options: `extractRequestParams: true`, `extractRequestBody: true`, `modular: true`.

## Socket.IO

`src/socket/transport/socketTransport.ts`:
- Auto-reconnect (3s–30s backoff)
- Token sync via MobX reaction
- PersistentListeners (survive reconnections)
- EmitQueue (buffer until connected)
- Visibility/online events: reconnect при возврате на вкладку

Events (Server → Client): `wg:server:stats`, `wg:peer:stats`, `wg:stats:overview`, `wg:peer:active`, `wg:server:status`, `wg:peer:status`
Events (Client → Server): `wg:subscribe:overview`, `wg:subscribe:server`, `wg:subscribe:peer`

## Permissions

`src/core/permissions/` — pure functions:
- `hasPermission(perms, required)` — wildcard hierarchy ("chat:view" → "chat:*" → "*")
- `canAccess(roles, perms, required)` — admin bypass OR permission check
- `computeEffectivePermissions(rolePerms, directPerms)` — union + dedup

## Theming

CSS variables: `src/styles/light-theme.css`, `src/styles/dark-theme.css`.
ThemeProvider (`src/core/theme/`): localStorage + `prefers-color-scheme`. `.dark` class на `<html>`.

## Environment

```
VITE_BASE_URL          — API endpoint
VITE_SOCKET_BASE_URL   — WebSocket endpoint
VITE_APP_NAME          — App title
```
