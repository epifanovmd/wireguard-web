import { useEffect, useRef } from "react";

import { ISocketService, useCallSocket } from "~@service";

const peer = new RTCPeerConnection({
  iceServers: [
    { urls: ["stun:stun.l.google.com:19302", "stun:freestun.net:3478"] },
  ],
});

const getMediaStreams = async () => {
  // Получаем стрим со звуком и видео
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
    video: true,
  });

  // Клонируем стрим и удаляем аудиотреки для получения видео без звука
  const mutedStream = new MediaStream(stream.getVideoTracks());

  return {
    stream,
    mutedStream,
  };
};

export const useWebRTC = () => {
  const { socket } = useCallSocket();
  const localStreamRef = useRef<HTMLVideoElement>(null);
  const remoteStreamRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    getMediaStreams().then(({ stream, mutedStream }) => {
      if (localStreamRef.current) {
        localStreamRef.current.srcObject = mutedStream;
      }

      stream.getTracks().forEach(track => {
        peer.addTrack(track, stream);
      });

      receivedCall(peer, socket).then();
      console.log("receivedCall start");
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCall = async (pc: RTCPeerConnection, socket: ISocketService) => {
    // Обработка ICE-кандидатов
    pc.onicecandidate = event => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          from: "A",
          to: "B",
          candidate: event.candidate,
        });
      }
    };

    // Обработка входящих медиа-треков
    pc.ontrack = event => {
      const remoteStream = event.streams[0];

      if (remoteStreamRef.current) {
        remoteStreamRef.current.srcObject = remoteStream;
      }
    };

    // Создание и отправка предложения
    try {
      const offer = await pc.createOffer();

      await pc.setLocalDescription(offer);

      socket.emit("offer", { from: "A", to: "B", offer });
    } catch (error) {
      console.error("Ошибка при создании предложения:", error);
    }

    // Получение ответа
    socket.on("answer", async ({ answer }) => {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error("Ошибка при установке удаленного описания:", error);
      }
    });

    // Получение ICE-кандидатов
    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("Ошибка при добавлении ICE-кандидата:", error);
      }
    });
  };

  const receivedCall = async (
    pc: RTCPeerConnection,
    socket: ISocketService,
  ) => {
    // Обработка ICE-кандидатов
    pc.onicecandidate = event => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          from: "A",
          to: "B",
          candidate: event.candidate,
        });
      }
    };

    // Обработка входящих медиа-треков
    pc.ontrack = event => {
      const remoteStream = event.streams[0];

      if (remoteStreamRef.current) {
        remoteStreamRef.current.srcObject = remoteStream;
      }
    };

    // Получение предложения и отправка ответа
    socket.on("offer", async ({ offer }) => {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();

        await pc.setLocalDescription(answer);
        socket.emit("answer", { from: "A", to: "B", answer });
      } catch (error) {
        console.error("Ошибка при обработке предложения:", error);
      }
    });

    // Получение ICE-кандидатов
    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("Ошибка при добавлении ICE-кандидата:", error);
      }
    });
  };

  return {
    localStreamRef,
    remoteStreamRef,
    startCall: () => startCall(peer, socket),
  };
};
