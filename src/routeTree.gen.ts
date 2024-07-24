/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PublicImport } from './routes/_public'
import { Route as PrivateImport } from './routes/_private'
import { Route as PrivateIndexImport } from './routes/_private/index'
import { Route as PublicAuthIndexImport } from './routes/_public/auth/index'
import { Route as PublicAboutIndexImport } from './routes/_public/about/index'

// Create/Update Routes

const PublicRoute = PublicImport.update({
  id: '/_public',
  getParentRoute: () => rootRoute,
} as any)

const PrivateRoute = PrivateImport.update({
  id: '/_private',
  getParentRoute: () => rootRoute,
} as any)

const PrivateIndexRoute = PrivateIndexImport.update({
  path: '/',
  getParentRoute: () => PrivateRoute,
} as any)

const PublicAuthIndexRoute = PublicAuthIndexImport.update({
  path: '/auth/',
  getParentRoute: () => PublicRoute,
} as any)

const PublicAboutIndexRoute = PublicAboutIndexImport.update({
  path: '/about/',
  getParentRoute: () => PublicRoute,
} as any)

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
    '/_public': {
      id: '/_public'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PublicImport
      parentRoute: typeof rootRoute
    }
    '/_private/': {
      id: '/_private/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof PrivateIndexImport
      parentRoute: typeof PrivateImport
    }
    '/_public/about/': {
      id: '/_public/about/'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof PublicAboutIndexImport
      parentRoute: typeof PublicImport
    }
    '/_public/auth/': {
      id: '/_public/auth/'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof PublicAuthIndexImport
      parentRoute: typeof PublicImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  PrivateRoute: PrivateRoute.addChildren({ PrivateIndexRoute }),
  PublicRoute: PublicRoute.addChildren({
    PublicAboutIndexRoute,
    PublicAuthIndexRoute,
  }),
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_private",
        "/_public"
      ]
    },
    "/_private": {
      "filePath": "_private.tsx",
      "children": [
        "/_private/"
      ]
    },
    "/_public": {
      "filePath": "_public.tsx",
      "children": [
        "/_public/about/",
        "/_public/auth/"
      ]
    },
    "/_private/": {
      "filePath": "_private/index.tsx",
      "parent": "/_private"
    },
    "/_public/about/": {
      "filePath": "_public/about/index.tsx",
      "parent": "/_public"
    },
    "/_public/auth/": {
      "filePath": "_public/auth/index.tsx",
      "parent": "/_public"
    }
  }
}
ROUTE_MANIFEST_END */
