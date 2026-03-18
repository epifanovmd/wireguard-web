import { Play, RotateCcw, Square, Trash2 } from "lucide-react";
import { FC } from "react";

import { ServerModel } from "~@models";

import { IconButton } from "../../ui2";

export interface ServerActionCellProps {
  server: ServerModel;
  /** Effective status (from live socket or model) */
  effectiveStatus: string;
  loading: string | undefined;
  onAction: (
    id: string,
    action: "start" | "stop" | "restart" | "delete",
  ) => void;
}

export const ServerActionCell: FC<ServerActionCellProps> = ({
  server,
  effectiveStatus,
  loading,
  onAction,
}) => {
  const isDown = effectiveStatus === "down" || effectiveStatus === "error";

  return (
    <div
      className="flex items-center justify-end gap-0.5"
      onClick={e => e.stopPropagation()}
    >
      {isDown ? (
        <IconButton
          title="Start"
          disabled={loading === "start"}
          onClick={() => onAction(server.data.id, "start")}
        >
          <Play size={15} className="text-success" />
        </IconButton>
      ) : (
        <IconButton
          title="Stop"
          disabled={loading === "stop"}
          onClick={() => onAction(server.data.id, "stop")}
        >
          <Square size={15} className="text-warning" />
        </IconButton>
      )}
      <IconButton
        title="Restart"
        disabled={loading === "restart"}
        onClick={() => onAction(server.data.id, "restart")}
      >
        <RotateCcw size={15} />
      </IconButton>
      <IconButton
        title="Delete"
        disabled={loading === "delete"}
        onClick={() => onAction(server.data.id, "delete")}
      >
        <Trash2 size={15} className="text-destructive" />
      </IconButton>
    </div>
  );
};
