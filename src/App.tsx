import { observer } from "mobx-react-lite";
import React, { useCallback } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { Container, Header } from "./components";
import { IRoute, routes } from "./routes";
import { useSession } from "./store";

export const App = observer(() => {
  useSession();

  const renderRoutes = useCallback(
    (_routes: IRoute[]) =>
      _routes.map(route => {
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
    [],
  );

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
