import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";

import { Container, Header } from "./components";
import { IRoute, RoutePaths, routes } from "./routes";
import { ISessionDataStore } from "./store";

export const App = observer(() => {
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const { setToken } = useRef(ISessionDataStore.getInstance()).current;
  const navigate = useNavigate();

  useEffect(() => {
    setToken(cookies.access_token);

    if (!cookies.access_token) {
      navigate(RoutePaths.AUTH);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.access_token]);

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
