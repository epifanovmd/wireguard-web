import { useNavigate } from "@tanstack/react-router";
import React, { FC, memo, useCallback } from "react";

import { useTokenService } from "~@service";

import { Button } from "../ui";

export const Header: FC = memo(() => {
  const navigate = useNavigate();
  const tokenService = useTokenService();

  const onLogout = useCallback(() => {
    tokenService.clear();
    navigate({ to: "/auth/signIn" }).then();
  }, [navigate, tokenService]);

  return (
    <div
      className={
        "flex shadow-md rounded-xl p-4 flex-grow mb-4 mt-4 justify-between"
      }
    >
      <div>{"Wireguard"}</div>
      <Button onClick={onLogout}>{"Выход"}</Button>
    </div>
  );
});
