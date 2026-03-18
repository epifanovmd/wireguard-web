import { FC } from "react";

import { ServerModel } from "~@models";

import { useWgServer } from "../../../socket";
import { ServerNameCell } from "./ServerNameCell";

export const ServerNameLiveCell: FC<{ server: ServerModel }> = ({ server }) => {
  const { status: liveStatus } = useWgServer(server.data.id);

  return <ServerNameCell server={server} liveStatus={liveStatus?.status} />;
};
