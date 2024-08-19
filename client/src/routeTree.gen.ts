/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LayoutImport } from './routes/_layout'
import { Route as ShikijoyAuthCallbackImport } from './routes/shikijoy.auth-callback'
import { Route as LayoutAnimejoyPagesImport } from './routes/_layout/_animejoy-pages'
import { Route as LayoutAnimejoyPagesIndexImport } from './routes/_layout/_animejoy-pages/index'
import { Route as LayoutAnimejoyPagesCategoryImport } from './routes/_layout/_animejoy-pages/$category'
import { Route as LayoutAnimejoyPagesNewsIndexImport } from './routes/_layout/_animejoy-pages/news/index'
import { Route as LayoutAnimejoyPagesCategoryIndexImport } from './routes/_layout/_animejoy-pages/$category/index'
import { Route as LayoutAnimejoyPagesNewsIdIndexImport } from './routes/_layout/_animejoy-pages/news/$id/index'
import { Route as LayoutAnimejoyPagesCategoryShowIdIndexImport } from './routes/_layout/_animejoy-pages/$category/$showId/index'
import { Route as LayoutAnimejoyPagesCategoryPagePageIndexImport } from './routes/_layout/_animejoy-pages/$category/page/$page/index'

// Create/Update Routes

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const ShikijoyAuthCallbackRoute = ShikijoyAuthCallbackImport.update({
  path: '/shikijoy/auth-callback',
  getParentRoute: () => rootRoute,
} as any)

const LayoutAnimejoyPagesRoute = LayoutAnimejoyPagesImport.update({
  id: '/_animejoy-pages',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutAnimejoyPagesIndexRoute = LayoutAnimejoyPagesIndexImport.update({
  path: '/',
  getParentRoute: () => LayoutAnimejoyPagesRoute,
} as any)

const LayoutAnimejoyPagesCategoryRoute =
  LayoutAnimejoyPagesCategoryImport.update({
    path: '/$category',
    getParentRoute: () => LayoutAnimejoyPagesRoute,
  } as any)

const LayoutAnimejoyPagesNewsIndexRoute =
  LayoutAnimejoyPagesNewsIndexImport.update({
    path: '/news/',
    getParentRoute: () => LayoutAnimejoyPagesRoute,
  } as any)

const LayoutAnimejoyPagesCategoryIndexRoute =
  LayoutAnimejoyPagesCategoryIndexImport.update({
    path: '/',
    getParentRoute: () => LayoutAnimejoyPagesCategoryRoute,
  } as any)

const LayoutAnimejoyPagesNewsIdIndexRoute =
  LayoutAnimejoyPagesNewsIdIndexImport.update({
    path: '/news/$id/',
    getParentRoute: () => LayoutAnimejoyPagesRoute,
  } as any)

const LayoutAnimejoyPagesCategoryShowIdIndexRoute =
  LayoutAnimejoyPagesCategoryShowIdIndexImport.update({
    path: '/$showId/',
    getParentRoute: () => LayoutAnimejoyPagesCategoryRoute,
  } as any)

const LayoutAnimejoyPagesCategoryPagePageIndexRoute =
  LayoutAnimejoyPagesCategoryPagePageIndexImport.update({
    path: '/page/$page/',
    getParentRoute: () => LayoutAnimejoyPagesCategoryRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/_layout/_animejoy-pages': {
      id: '/_layout/_animejoy-pages'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutAnimejoyPagesImport
      parentRoute: typeof LayoutImport
    }
    '/shikijoy/auth-callback': {
      id: '/shikijoy/auth-callback'
      path: '/shikijoy/auth-callback'
      fullPath: '/shikijoy/auth-callback'
      preLoaderRoute: typeof ShikijoyAuthCallbackImport
      parentRoute: typeof rootRoute
    }
    '/_layout/_animejoy-pages/$category': {
      id: '/_layout/_animejoy-pages/$category'
      path: '/$category'
      fullPath: '/$category'
      preLoaderRoute: typeof LayoutAnimejoyPagesCategoryImport
      parentRoute: typeof LayoutAnimejoyPagesImport
    }
    '/_layout/_animejoy-pages/': {
      id: '/_layout/_animejoy-pages/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof LayoutAnimejoyPagesIndexImport
      parentRoute: typeof LayoutAnimejoyPagesImport
    }
    '/_layout/_animejoy-pages/$category/': {
      id: '/_layout/_animejoy-pages/$category/'
      path: '/'
      fullPath: '/$category/'
      preLoaderRoute: typeof LayoutAnimejoyPagesCategoryIndexImport
      parentRoute: typeof LayoutAnimejoyPagesCategoryImport
    }
    '/_layout/_animejoy-pages/news/': {
      id: '/_layout/_animejoy-pages/news/'
      path: '/news'
      fullPath: '/news'
      preLoaderRoute: typeof LayoutAnimejoyPagesNewsIndexImport
      parentRoute: typeof LayoutAnimejoyPagesImport
    }
    '/_layout/_animejoy-pages/$category/$showId/': {
      id: '/_layout/_animejoy-pages/$category/$showId/'
      path: '/$showId'
      fullPath: '/$category/$showId'
      preLoaderRoute: typeof LayoutAnimejoyPagesCategoryShowIdIndexImport
      parentRoute: typeof LayoutAnimejoyPagesCategoryImport
    }
    '/_layout/_animejoy-pages/news/$id/': {
      id: '/_layout/_animejoy-pages/news/$id/'
      path: '/news/$id'
      fullPath: '/news/$id'
      preLoaderRoute: typeof LayoutAnimejoyPagesNewsIdIndexImport
      parentRoute: typeof LayoutAnimejoyPagesImport
    }
    '/_layout/_animejoy-pages/$category/page/$page/': {
      id: '/_layout/_animejoy-pages/$category/page/$page/'
      path: '/page/$page'
      fullPath: '/$category/page/$page'
      preLoaderRoute: typeof LayoutAnimejoyPagesCategoryPagePageIndexImport
      parentRoute: typeof LayoutAnimejoyPagesCategoryImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  LayoutRoute: LayoutRoute.addChildren({
    LayoutAnimejoyPagesRoute: LayoutAnimejoyPagesRoute.addChildren({
      LayoutAnimejoyPagesCategoryRoute:
        LayoutAnimejoyPagesCategoryRoute.addChildren({
          LayoutAnimejoyPagesCategoryIndexRoute,
          LayoutAnimejoyPagesCategoryShowIdIndexRoute,
          LayoutAnimejoyPagesCategoryPagePageIndexRoute,
        }),
      LayoutAnimejoyPagesIndexRoute,
      LayoutAnimejoyPagesNewsIndexRoute,
      LayoutAnimejoyPagesNewsIdIndexRoute,
    }),
  }),
  ShikijoyAuthCallbackRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_layout",
        "/shikijoy/auth-callback"
      ]
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/_animejoy-pages"
      ]
    },
    "/_layout/_animejoy-pages": {
      "filePath": "_layout/_animejoy-pages.tsx",
      "parent": "/_layout",
      "children": [
        "/_layout/_animejoy-pages/$category",
        "/_layout/_animejoy-pages/",
        "/_layout/_animejoy-pages/news/",
        "/_layout/_animejoy-pages/news/$id/"
      ]
    },
    "/shikijoy/auth-callback": {
      "filePath": "shikijoy.auth-callback.tsx"
    },
    "/_layout/_animejoy-pages/$category": {
      "filePath": "_layout/_animejoy-pages/$category.tsx",
      "parent": "/_layout/_animejoy-pages",
      "children": [
        "/_layout/_animejoy-pages/$category/",
        "/_layout/_animejoy-pages/$category/$showId/",
        "/_layout/_animejoy-pages/$category/page/$page/"
      ]
    },
    "/_layout/_animejoy-pages/": {
      "filePath": "_layout/_animejoy-pages/index.tsx",
      "parent": "/_layout/_animejoy-pages"
    },
    "/_layout/_animejoy-pages/$category/": {
      "filePath": "_layout/_animejoy-pages/$category/index.tsx",
      "parent": "/_layout/_animejoy-pages/$category"
    },
    "/_layout/_animejoy-pages/news/": {
      "filePath": "_layout/_animejoy-pages/news/index.tsx",
      "parent": "/_layout/_animejoy-pages"
    },
    "/_layout/_animejoy-pages/$category/$showId/": {
      "filePath": "_layout/_animejoy-pages/$category/$showId/index.tsx",
      "parent": "/_layout/_animejoy-pages/$category"
    },
    "/_layout/_animejoy-pages/news/$id/": {
      "filePath": "_layout/_animejoy-pages/news/$id/index.tsx",
      "parent": "/_layout/_animejoy-pages"
    },
    "/_layout/_animejoy-pages/$category/page/$page/": {
      "filePath": "_layout/_animejoy-pages/$category/page/$page/index.tsx",
      "parent": "/_layout/_animejoy-pages/$category"
    }
  }
}
ROUTE_MANIFEST_END */
