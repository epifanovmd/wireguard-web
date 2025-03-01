/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthImport } from './routes/auth'
import { Route as PrivateImport } from './routes/_private'

// Create Virtual Routes

const ResetPasswordLazyImport = createFileRoute('/reset-password')()
const PrivateIndexLazyImport = createFileRoute('/_private/')()
const AuthSignUpLazyImport = createFileRoute('/auth/signUp')()
const AuthSignInLazyImport = createFileRoute('/auth/signIn')()
const AuthRecoveryPasswordLazyImport = createFileRoute(
  '/auth/recovery-password',
)()
const PrivateCallLazyImport = createFileRoute('/_private/call')()

// Create/Update Routes

const ResetPasswordLazyRoute = ResetPasswordLazyImport.update({
  path: '/reset-password',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/reset-password.lazy').then((d) => d.Route),
)

const AuthRoute = AuthImport.update({
  path: '/auth',
  getParentRoute: () => rootRoute,
} as any)

const PrivateRoute = PrivateImport.update({
  id: '/_private',
  getParentRoute: () => rootRoute,
} as any)

const PrivateIndexLazyRoute = PrivateIndexLazyImport.update({
  path: '/',
  getParentRoute: () => PrivateRoute,
} as any).lazy(() =>
  import('./routes/_private/index.lazy').then((d) => d.Route),
)

const AuthSignUpLazyRoute = AuthSignUpLazyImport.update({
  path: '/signUp',
  getParentRoute: () => AuthRoute,
} as any).lazy(() => import('./routes/auth/signUp.lazy').then((d) => d.Route))

const AuthSignInLazyRoute = AuthSignInLazyImport.update({
  path: '/signIn',
  getParentRoute: () => AuthRoute,
} as any).lazy(() => import('./routes/auth/signIn.lazy').then((d) => d.Route))

const AuthRecoveryPasswordLazyRoute = AuthRecoveryPasswordLazyImport.update({
  path: '/recovery-password',
  getParentRoute: () => AuthRoute,
} as any).lazy(() =>
  import('./routes/auth/recovery-password.lazy').then((d) => d.Route),
)

const PrivateCallLazyRoute = PrivateCallLazyImport.update({
  path: '/call',
  getParentRoute: () => PrivateRoute,
} as any).lazy(() => import('./routes/_private/call.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_private': {
      id: '/_private'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PrivateImport
      parentRoute: typeof rootRoute
    }
    '/auth': {
      id: '/auth'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/reset-password': {
      id: '/reset-password'
      path: '/reset-password'
      fullPath: '/reset-password'
      preLoaderRoute: typeof ResetPasswordLazyImport
      parentRoute: typeof rootRoute
    }
    '/_private/call': {
      id: '/_private/call'
      path: '/call'
      fullPath: '/call'
      preLoaderRoute: typeof PrivateCallLazyImport
      parentRoute: typeof PrivateImport
    }
    '/auth/recovery-password': {
      id: '/auth/recovery-password'
      path: '/recovery-password'
      fullPath: '/auth/recovery-password'
      preLoaderRoute: typeof AuthRecoveryPasswordLazyImport
      parentRoute: typeof AuthImport
    }
    '/auth/signIn': {
      id: '/auth/signIn'
      path: '/signIn'
      fullPath: '/auth/signIn'
      preLoaderRoute: typeof AuthSignInLazyImport
      parentRoute: typeof AuthImport
    }
    '/auth/signUp': {
      id: '/auth/signUp'
      path: '/signUp'
      fullPath: '/auth/signUp'
      preLoaderRoute: typeof AuthSignUpLazyImport
      parentRoute: typeof AuthImport
    }
    '/_private/': {
      id: '/_private/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof PrivateIndexLazyImport
      parentRoute: typeof PrivateImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  PrivateRoute: PrivateRoute.addChildren({
    PrivateCallLazyRoute,
    PrivateIndexLazyRoute,
  }),
  AuthRoute: AuthRoute.addChildren({
    AuthRecoveryPasswordLazyRoute,
    AuthSignInLazyRoute,
    AuthSignUpLazyRoute,
  }),
  ResetPasswordLazyRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_private",
        "/auth",
        "/reset-password"
      ]
    },
    "/_private": {
      "filePath": "_private.tsx",
      "children": [
        "/_private/call",
        "/_private/"
      ]
    },
    "/auth": {
      "filePath": "auth.tsx",
      "children": [
        "/auth/recovery-password",
        "/auth/signIn",
        "/auth/signUp"
      ]
    },
    "/reset-password": {
      "filePath": "reset-password.lazy.tsx"
    },
    "/_private/call": {
      "filePath": "_private/call.lazy.tsx",
      "parent": "/_private"
    },
    "/auth/recovery-password": {
      "filePath": "auth/recovery-password.lazy.tsx",
      "parent": "/auth"
    },
    "/auth/signIn": {
      "filePath": "auth/signIn.lazy.tsx",
      "parent": "/auth"
    },
    "/auth/signUp": {
      "filePath": "auth/signUp.lazy.tsx",
      "parent": "/auth"
    },
    "/_private/": {
      "filePath": "_private/index.lazy.tsx",
      "parent": "/_private"
    }
  }
}
ROUTE_MANIFEST_END */
