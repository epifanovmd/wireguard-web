import { Header } from "@components";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import React, { memo } from "react";

const Component = memo(() => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
});

export const Route = createFileRoute("/_public")({
  component: Component,
});
