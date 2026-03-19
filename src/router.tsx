import { createRouter } from "@tanstack/react-router";

import { Spinner } from "~@components/ui2";

import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
  defaultPendingMinMs: 300,
  defaultPendingMs: 100,
  defaultPendingComponent: () => (
    <div className="flex h-screen w-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  ),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
