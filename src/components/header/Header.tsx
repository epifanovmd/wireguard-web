import { useNavigate } from "@tanstack/react-router";
import React, { FC, memo, useCallback } from "react";

import { usePasskeyAuth } from "~@common";
import { useTokenService } from "~@service";
import { useProfileDataStore } from "~@store";

import { AsyncButton, Button } from "../ui";

export const Header: FC = memo(() => {
  const navigate = useNavigate();
  const tokenService = useTokenService();
  const { profile } = useProfileDataStore();
  const { handleRegister, support } = usePasskeyAuth();

  const onLogout = useCallback(() => {
    tokenService.clear();
    navigate({ to: "/auth/signIn" }).then();
  }, [navigate, tokenService]);

  return (
    <div
      className={
        "flex shadow-md rounded-md p-4 flex-grow mb-4 mt-4 justify-between bg-white"
      }
    >
      <div>{"Wireguard"}</div>
      <div>
        {support && profile && (
          <AsyncButton
            type={"primary"}
            onClick={async () => {
              await handleRegister(profile.id);
            }}
            className={"mr-2"}
          >
            {"Passkey reg"}
          </AsyncButton>
        )}
        <Button onClick={onLogout}>{"Выход"}</Button>
      </div>
    </div>
  );
});
