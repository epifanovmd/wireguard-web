import { EPermissions } from "@api/api-gen/data-contracts";
import { ServerModel } from "@models";
import { usePermissions } from "@store";
import { observer } from "mobx-react-lite";

import { useWgServer } from "../../../socket";
import { ServerActions } from "./ServerActions";

export interface IServerActionsLiveStatusProps {
  server: ServerModel;
  onAction: (
    id: string,
    action: "start" | "stop" | "restart" | "delete",
  ) => Promise<void>;
}

export const ServerActionsLiveStatus = observer<IServerActionsLiveStatusProps>(
  ({ server, onAction }) => {
    const { status: liveStatus } = useWgServer(server.data.id);
    const { hasPermission } = usePermissions();

    return (
      <ServerActions
        status={liveStatus?.status ?? server.data.status}
        canManage={hasPermission(EPermissions.WgServerManage)}
        canControl={hasPermission(EPermissions.WgServerManage)}
        onStart={() => onAction(server.data.id, "start")}
        onStop={() => onAction(server.data.id, "stop")}
        onRestart={() => onAction(server.data.id, "restart")}
        onDelete={() => onAction(server.data.id, "delete")}
      />
    );
  },
);
