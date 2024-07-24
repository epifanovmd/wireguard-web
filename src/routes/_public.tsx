import { Header } from "@components";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/_public")({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  ),
});
