import { memo } from "react";

import { ServerModel } from "~@models";

import { useWgServer } from "../../../socket";
import { ServerActions } from "./ServerActions";

export interface IServerActionsLiveStatusProps {
  server: ServerModel;
  onAction: (
    id: string,
    action: "start" | "stop" | "restart" | "delete",
  ) => Promise<void>;
}

export const ServerActionsLiveStatus = memo<IServerActionsLiveStatusProps>(
  ({
    server,
    onAction,
  }: {
    server: ServerModel;
    onAction: (
      id: string,
      action: "start" | "stop" | "restart" | "delete",
    ) => Promise<void>;
  }) => {
    const { status: liveStatus } = useWgServer(server.data.id);

    return (
      <ServerActions
        status={liveStatus?.status ?? server.data.status}
        onStart={() => onAction(server.data.id, "start")}
        onStop={() => onAction(server.data.id, "stop")}
        onRestart={() => onAction(server.data.id, "restart")}
        onDelete={() => onAction(server.data.id, "delete")}
      />
    );
  },
);
