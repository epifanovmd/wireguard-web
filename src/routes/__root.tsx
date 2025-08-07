import { disposer } from "@force-dev/utils";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

import { ConfirmModalProvider, Container } from "~@components";
import { useAppDataStore } from "~@store";

const Component = observer(() => {
  const { initialize } = useAppDataStore();

  useEffect(() => {
    const dispose = initialize();

    return () => {
      disposer(dispose);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <ConfirmModalProvider>
        <Outlet />
      </ConfirmModalProvider>
    </Container>
  );
});

export const Route = createRootRoute({
  component: Component,
  pendingMinMs: 0,
  pendingMs: 0,
});
