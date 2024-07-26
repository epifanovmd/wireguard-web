import { Container } from "@components";
import { delayPromise, disposer } from "@force-dev/utils";
import { ISessionDataStore, useSessionDataStore } from "@store";
import {
  createRootRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

const Component = observer(() => {
  const { initialize } = useSessionDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    const dispose = initialize(() => {
      navigate({
        to: "/auth",
      });
    });

    return () => {
      disposer(dispose);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Outlet />
    </Container>
  );
});

export const Route = createRootRoute({
  beforeLoad: () => {
    const { isReady, isAuthorized, restore } = ISessionDataStore.getInstance();

    if (!isReady) {
      restore().then(accessToken => {
        if (!accessToken) {
          throw redirect({ to: "/auth" });
        }
      });
    } else if (!isAuthorized) {
      throw redirect({ to: "/auth" });
    }
  },
  component: Component,
  pendingMinMs: 0,
  pendingMs: 0,
});
