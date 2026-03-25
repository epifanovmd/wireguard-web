---
name: Authentication & Permissions
description: Auth flow, JWT management, token refresh, protected routes, passkeys, frontend permission checking
type: project
---

## Auth Flow

1. **App root** (`__root.tsx`): `auth.restore()` — читает token из storage, загружает user
2. **AuthSessionService**: JWT management
   - Хранит в: cookie + localStorage
   - Auto-refresh 30 секунд до expiry
   - 401 interceptor: refresh + retry request
3. **AuthStore** (MobX): `user`, `roles[]`, `permissions[]`, `isAuthenticated`
4. **Protected routes** (`_private.tsx`): redirect → `/auth/signIn` если !authenticated
5. **Socket**: подключается при `isAuthenticated === true` (AppDataStore наблюдает)

## Token Storage (AuthTokenStore)

- `accessToken` → localStorage + cookie
- `refreshToken` → localStorage
- `set(tokens)`, `clear()`, `getAccessToken()`, `getRefreshToken()`

## AuthSessionService

- `restore()` — попытка загрузить user по сохранённому token
- `signIn(login, password)` → tokens → save → load user
- `signUp(params)` → tokens → save → load user
- `signOut()` → clear tokens → disconnect socket → redirect
- `refreshTokens()` → call API → update stored tokens
- Auto-refresh timer: запускается после signIn, перезапускается после refresh

## 401 Interceptor

Axios response interceptor:
1. Получает 401
2. Вызывает `refreshTokens()`
3. Повторяет original request с новым token
4. Если refresh тоже 401 → `signOut()`

## Permissions на Frontend

**EPermissions enum** (из `api-gen/data-contracts.ts`):
```
*, wg:*, wg:server:view/manage/own, wg:peer:view/manage/own, wg:stats:view, user:view/manage
```

**usePermissions() hook:**
```typescript
const { hasPermission } = usePermissions();
if (hasPermission(EPermissions.WgServerManage)) { /* show button */ }
```

**Wildcard matching:** `*` matches всё, `wg:*` matches `wg:server:view`, etc.
Superadmin: role `ADMIN` OR permission `*`.

**Route-level guards:**
```typescript
// routes/_private/wireguard.tsx
beforeLoad: () => {
  if (!hasAnyWgPermission()) throw redirect({ to: "/" });
}
```

## Passkey Support

`@simplewebauthn/browser` + `usePasskeyAuth()` hook.
- SignIn: "Войти с passkey" button
- Profile: register/manage passkeys
- Flow: challenge → browser assertion → verify API → tokens
