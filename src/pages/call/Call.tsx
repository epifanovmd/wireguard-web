import { observer } from "mobx-react-lite";
import React, { FC, PropsWithChildren } from "react";

import { Button } from "~@components";

import { useWebRTC } from "./hooks";

interface IProps {}

export const CallPage: FC<PropsWithChildren<IProps>> = observer(() => {
  const { localStreamRef, remoteStreamRef, startCall } = useWebRTC();

  return (
    <div>
      <div className={"relative"}>
        <div className={"flex shadow-md rounded-lg overflow-hidden"}>
          <video
            className={"flex-grow basis-0 min-w-0 scale-x-[-1]"}
            ref={localStreamRef}
            autoPlay
            playsInline
          />
          <video
            className={"flex-grow basis-0 min-w-0 scale-x-[-1]"}
            ref={remoteStreamRef}
            autoPlay
            playsInline
          />
        </div>
      </div>
      <div className={"mt-2"}>
        <Button onClick={startCall}>{"Позвонить"}</Button>
      </div>
    </div>
  );
});
