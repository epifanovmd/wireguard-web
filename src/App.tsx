import { disposer } from "@force-dev/utils";
import { observer } from "mobx-react-lite";
import React, { useCallback, useLayoutEffect } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";

import { Container, Header } from "./components";
import { IRoute, RoutePaths, routes } from "./routes";
import { useSessionDataStore } from "./store";

export const App = observer(() => {
  const { restore, initialize, isAuthorized, isReady } = useSessionDataStore();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const dispose = initialize(() => {
      navigate(RoutePaths.AUTH);
    });

    restore().then(accessToken => {
      if (!accessToken) {
        navigate(RoutePaths.AUTH);
      }
    });

    return () => {
      disposer(dispose);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderRoutes = useCallback(
    (_routes: IRoute[]) =>
      _routes.map(route => {
        if (!isAuthorized && route.private) {
          return undefined;
        }
        const Component = route.component;
        const Child = route.children?.[0].component;

        return (
          <Route
            path={route.path}
            key={route.path}
            element={
              <>
                <Component />
                <Outlet />
              </>
            }
          >
            {Child && <Route index={true} element={<Child />} />}
            {renderRoutes(route.children || [])}
          </Route>
        );
      }),
    [isAuthorized],
  );

  if (!isReady) {
    return null;
  }

  return (
    <Container>
      <Header />

      <Routes>
        {renderRoutes(routes)}
        <Route path={"*"} element={<Navigate to={"/"} />} />
      </Routes>
    </Container>
  );
});
