import { disposer } from "@force-dev/utils";
import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

import { ConfirmModalProvider, Container } from "~@components";
import { useSessionDataStore } from "~@store";

const Component = observer(() => {
  const { initialize } = useSessionDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    const dispose = initialize(() => {
      navigate({
        to: "/auth/login",
      }).then();
    });

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
