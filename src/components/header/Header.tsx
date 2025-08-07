import { useNavigate } from "@tanstack/react-router";
import React, { FC, memo, useCallback } from "react";

import { usePasskeyAuth } from "~@common";
import { useProfileDataStore, useSessionDataStore } from "~@store";

import { AsyncButton, Button } from "../ui";

export const Header: FC = memo(() => {
  const navigate = useNavigate();
  const { clear } = useSessionDataStore();
  const { profile } = useProfileDataStore();
  const { profileId, handleRegister, support } = usePasskeyAuth();
  const _profileId = profile?.id;

  const onLogout = useCallback(() => {
    clear();
    navigate({ to: "/auth/signIn" }).then();
  }, [navigate, clear]);

  return (
    <div
      className={
        "flex shadow-md rounded-md p-4 flex-grow mb-4 mt-4 justify-between bg-white"
      }
    >
      <div>{"Wireguard"}</div>
      <div>
        {support && _profileId && !profileId && (
          <AsyncButton
            type={"primary"}
            onClick={async () => {
              await handleRegister(_profileId);
            }}
            className={"!mr-2"}
          >
            {"Passkey reg"}
          </AsyncButton>
        )}
        <Button onClick={onLogout}>{"Выход"}</Button>
      </div>
    </div>
  );
});
