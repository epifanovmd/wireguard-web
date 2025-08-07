import { useLoading } from "@force-dev/react";
import { Switch } from "antd";
import { observer } from "mobx-react-lite";
import React, { FC, PropsWithChildren, useCallback, useEffect } from "react";

import { useProfileDataStore, useServerDataStore } from "~@store";

export interface IServerActionsProps {
  serverId?: string;
}

export const ServerActions: FC<PropsWithChildren<IServerActionsProps>> =
  observer(({ serverId }) => {
    const [loading, start, stop] = useLoading();
    const { getStatus, startServer, stopServer, enabled } =
      useServerDataStore();
    const { isAdmin } = useProfileDataStore();

    useEffect(() => {
      if (serverId) {
        getStatus(serverId).then();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serverId]);

    const onToggle = useCallback(
      async (checked: boolean) => {
        if (serverId) {
          start();

          if (checked) {
            await startServer(serverId);
          } else {
            await stopServer(serverId);
          }

          stop();
        }
      },
      [serverId, start, startServer, stop, stopServer],
    );

    if (!serverId || !isAdmin) {
      return null;
    }

    return (
      <Switch
        value={enabled}
        loading={loading}
        disabled={!serverId || !isAdmin}
        onChange={onToggle}
        checkedChildren={"Вкл"}
        unCheckedChildren={"Выкл"}
      />
    );
  });
