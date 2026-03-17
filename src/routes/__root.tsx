import { createRootRoute, Outlet } from "@tanstack/react-router";
import React, { memo } from "react";

const Component = memo(() => {
  return <Outlet />;
});

export const Route = createRootRoute({
  component: Component,
  pendingMinMs: 0,
  pendingMs: 0,
});
