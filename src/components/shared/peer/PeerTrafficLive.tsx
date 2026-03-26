import { formatter } from "@common";
import { PeerModel } from "@models";
import { ArrowDown, ArrowUp } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { usePeerLive } from "../../../hooks/usePeerLive";

export const PeerSpeedLive: FC<{ row: PeerModel }> = observer(({ row }) => {
  const { stats } = usePeerLive(row.data.id);

  if (!stats) {
    return <span className="text-xs italic text-muted-foreground">—</span>;
  }

  return (
    <div className="flex flex-col gap-0.5 text-xs whitespace-nowrap">
      <span className="flex items-center gap-1 text-info">
        <ArrowDown size={10} />
        {formatter.speed(stats.rxSpeedBps)}
      </span>
      <span className="flex items-center gap-1 text-success">
        <ArrowUp size={10} />
        {formatter.speed(stats.txSpeedBps)}
      </span>
    </div>
  );
});

export const PeerBytesLive: FC<{ row: PeerModel }> = observer(({ row }) => {
  const { stats } = usePeerLive(row.data.id);

  if (!stats) {
    return <span className="text-xs italic text-muted-foreground">—</span>;
  }

  return (
    <div className="flex flex-col gap-0.5 text-xs whitespace-nowrap">
      <span className="flex items-center gap-1 text-info">
        <ArrowDown size={10} />
        {formatter.bytes(stats.rxBytes)}
      </span>
      <span className="flex items-center gap-1 text-success">
        <ArrowUp size={10} />
        {formatter.bytes(stats.txBytes)}
      </span>
    </div>
  );
});
