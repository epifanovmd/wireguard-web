import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
  defaultPendingMinMs: 300,
  defaultPendingMs: 100,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
