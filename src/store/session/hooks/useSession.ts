import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import { RoutePaths } from "../../../routes";
import { useSessionDataStore } from "../SessionData.store";

export const useSession = () => {
  const { setToken } = useSessionDataStore();
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const navigate = useNavigate();

  useEffect(() => {
    setToken(cookies.access_token);

    if (!cookies.access_token) {
      navigate(RoutePaths.AUTH);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.access_token]);
};
