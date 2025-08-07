import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useRef } from "react";

import { Button } from "~@components";

import { useWebRTC } from "./hooks";

export const CallPage: FC = observer(() => {
  const localStreamRef = useRef<HTMLVideoElement>(null);
  const remoteStreamRef = useRef<HTMLVideoElement>(null);

  const {
    offer,
    localStream,
    remoteStream,
    handleStartCall,
    handleLeaveCall,
    handleAcceptCall,
    handleRejectCall,
  } = useWebRTC();

  useEffect(() => {
    if (localStreamRef.current) {
      if (localStream) {
        localStreamRef.current.srcObject = localStream;
      } else {
        localStreamRef.current.srcObject = null;
      }
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStreamRef.current) {
      if (remoteStream) {
        remoteStreamRef.current.srcObject = remoteStream;
      } else {
        remoteStreamRef.current.srcObject = null;
      }
    }
  }, [remoteStream]);

  return (
    <div className={"flex flex-col"}>
      <div className="flex justify-center items-center bg-gray-100 m-auto">
        <div className="lg:flex shadow-md rounded-lg overflow-hidden h-[500px] w-[300px] lg:h-[300px] lg:w-[500px]">
          <video
            className="lg:w-[50%] lg:h-[100%] w-[100%] h-[50%] scale-x-[-1] object-cover bg-gray-300 rounded-lg"
            ref={localStreamRef}
            autoPlay
            playsInline
          />
          <video
            className="lg:w-[50%] lg:h-[100%] w-[100%] h-[50%] scale-x-[-1] object-cover bg-gray-300 rounded-lg"
            ref={remoteStreamRef}
            autoPlay
            playsInline
          />
        </div>
      </div>
      <div className={"mt-2"}>
        {!remoteStream && (
          <Button onClick={handleStartCall}>{"Позвонить"}</Button>
        )}
        {offer && (
          <>
            <Button onClick={handleAcceptCall}>{"Принять звонок"}</Button>
            <Button onClick={handleRejectCall}>{"Отклонить звонок"}</Button>
          </>
        )}
        {remoteStream && (
          <Button onClick={handleLeaveCall}>{"Сбросить звонок"}</Button>
        )}
      </div>
    </div>
  );
});
