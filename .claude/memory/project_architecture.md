---
name: Project Architecture
description: Vite build, TanStack routing, MobX state, API layer, Socket.IO, theming, component library, project structure
type: project
---

## Project Structure

```
src/
├── api/                    # REST API client
│   ├── Api.service.ts      # Axios + JWT interceptors
│   ├── api-gen/            # Auto-generated from Swagger (DO NOT EDIT)
│   │   ├── Api.ts          # Generated API methods
│   │   └── data-contracts.ts  # Enums, DTOs
│   └── hooks/
├── core/                   # Auth session, permissions, notifications
│   ├── auth/AuthSessionService.ts, AuthTokenStore.ts
│   ├── holders/            # EntityHolder, MutationHolder, PagedHolder
│   ├── permissions/        # canAccess(), computeEffectivePermissions()
│   └── env.ts              # VITE_* config
├── socket/                 # Socket.IO layer
│   ├── transport/          # socketTransport (reconnect, emit queue, persistent listeners)
│   └── wg/                 # WG socket service + hooks
├── store/                  # MobX stores (IoC singletons)
├── models/                 # View models (computed wrappers over DTOs)
├── components/
│   ├── ui/                 # 97+ Radix + Tailwind components
│   ├── layouts/            # AuthLayout, PageLayout, PageHeader
│   ├── shared/             # ServerActions, PeerActions, QrCodeModal
│   ├── tables/             # Column definitions
│   └── charts/             # Recharts components
├── pages/                  # Route page components
├── routes/                 # TanStack file-based routes
├── hooks/                  # Custom hooks
├── common/                 # Helpers (formatters, download, regex)
├── theme/                  # ThemeProvider (light/dark)
├── styles/                 # Tailwind + CSS variables
├── App.tsx                 # Root: providers + router
├── router.tsx              # TanStack config
└── routeTree.gen.ts        # Auto-generated (DO NOT EDIT)
```

## Build (Vite 6)

Plugins: TanStack Router (auto route generation), Tailwind CSS.
Path aliases: `~@api`, `~@store`, `~@components`, `~@models`, `~@core`, `~@service`, `~@theme`.
Output: `dist/` (SPA). Target: ES2022.

## Routing (TanStack React Router)

File-based из `src/routes/`. `routeTree.gen.ts` генерируется автоматически — **НЕ редактировать**.

```
/ (public)
├── /auth/signIn, /auth/signUp, /auth/recovery-password
├── /reset-password
_private/ (protected — redirect если !auth.isAuthenticated)
├── / (dashboard)
├── /profile, /settings
├── /users, /users/$userId
├── /wireguard (permission check: any WG permission)
│   ├── /servers, /servers/$serverId
│   ├── /peers, /peers/$peerId
│   └── /stats
```

Guards: `beforeLoad()` в route файлах. `_private.tsx` проверяет `auth.isAuthenticated`.

## State Management (MobX)

Stores — IoC singletons: `@IStoreService({ inSingleton: true })`.
Используют `makeAutoObservable()` для реактивности.

**Data holders** (@force-dev/utils):
- `EntityHolder<T>` — загрузка/refresh одной entity, error handling
- `PagedHolder<T>` — пагинация, фильтры, lazy-load
- `MutationHolder<T>` — оптимистичные updates, loading state

## API Layer (Axios)

`src/api/Api.service.ts` — extends auto-generated `Api` class.
- Base URL: `VITE_BASE_URL` (из .env)
- Request interceptor: `Authorization: Bearer {token}`
- Response interceptor: 401 → refresh + retry, 500 → toast

**`src/api/api-gen/`** — auto-generated from Swagger. **НЕ редактировать.** Regenerate: `yarn generate:api`.

## Socket.IO

`src/socket/transport/socketTransport.ts`:
- Auto-reconnect (exponential backoff 3s–30s)
- Token sync при каждом refresh
- Persistent listeners (survive reconnections)
- Emit queue (queue until connected)
- Visibility/online events: reconnect при возврате на вкладку

Events (Server → Client): `wg:server:stats`, `wg:peer:stats`, `wg:stats:overview`, `wg:peer:active`, `wg:server:status`, `wg:peer:status`
Events (Client → Server): `wg:subscribe:overview`, `wg:subscribe:server`, `wg:subscribe:peer`

## Theming

CSS variables: `src/styles/light-theme.css`, `src/styles/dark-theme.css`.
ThemeProvider: localStorage + `prefers-color-scheme`. `.dark` class на `<html>`.

## Component Library

97+ компонентов в `src/components/ui/` на Radix UI + Tailwind.
Button, Card, Input, Modal, Tabs, Table, Select, Popover, Pagination, Spinner, etc.
Form fields интегрированы с React Hook Form.

## Environment

```
VITE_BASE_URL          — API endpoint (https://...)
VITE_SOCKET_BASE_URL   — WebSocket endpoint
VITE_APP_NAME          — App title
```
