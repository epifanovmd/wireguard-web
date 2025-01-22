import { useCallback, useEffect, useRef, useState } from "react";

import { useCallSocket } from "~@service";

const config: RTCConfiguration = {
  iceServers: [
    { urls: ["stun:stun.l.google.com:19302", "stun:freestun.net:3478"] },
  ],
};

export const useWebRTC = () => {
  const { socket } = useCallSocket();
  const peer = useRef(new RTCPeerConnection(config));
  const [offer, setOffer] = useState<RTCSessionDescriptionInit | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    onReceivedCall();
    console.log("receivedCall start");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startLocalStream = useCallback(async () => {
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

    return { stream, mutedStream };
  }, []);

  const startCall = useCallback(async () => {
    return new Promise<MediaStream>((resolve, reject) => {
      try {
        const iceCandidatesQueue: RTCIceCandidate[] = [];

        // Обработка ICE-кандидатов
        peer.current.onicecandidate = event => {
          if (event.candidate) {
            iceCandidatesQueue.push(event.candidate);
          }
        };

        peer.current.createOffer().then(async offer => {
          await peer.current.setLocalDescription(offer);

          socket.emit("offer", { from: "A", to: "B", offer });

          // Получение ответа
          socket.on("answer", async ({ answer }) => {
            // Обработка входящих медиа-треков
            peer.current.ontrack = event => {
              resolve(event.streams[0]);
            };

            // Получение ICE-кандидатов
            socket.on("ice-candidate", ({ candidate }) => {
              peer.current
                .addIceCandidate(new RTCIceCandidate(candidate))
                .catch();
            });

            iceCandidatesQueue.forEach(candidate => {
              socket.emit("ice-candidate", {
                from: "A",
                to: "B",
                candidate,
              });
            });

            await peer.current.setRemoteDescription(
              new RTCSessionDescription(answer),
            );
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }, [socket]);

  const onAcceptCall = useCallback(
    async (offer: RTCSessionDescriptionInit) => {
      return new Promise<MediaStream>((resolve, reject) => {
        try {
          // Обработка ICE-кандидатов
          peer.current.onicecandidate = event => {
            if (event.candidate) {
              socket.emit("ice-candidate", {
                from: "A",
                to: "B",
                candidate: event.candidate,
              });
            }
          };

          // Обработка входящих медиа-треков
          peer.current.ontrack = event => {
            resolve(event.streams[0]);
          };

          peer.current
            .setRemoteDescription(new RTCSessionDescription(offer))
            .then(async () => {
              const answer = await peer.current.createAnswer();

              await peer.current.setLocalDescription(answer);

              // Получение ICE-кандидатов
              socket.on("ice-candidate", ({ candidate }) => {
                peer.current
                  .addIceCandidate(new RTCIceCandidate(candidate))
                  .catch();
              });

              socket.emit("answer", { from: "A", to: "B", answer });
            });
        } catch (error) {
          reject(error);
        }
      });
    },
    [socket],
  );

  const onReceivedCall = useCallback(() => {
    peer.current.oniceconnectionstatechange = () => {
      console.log(
        "ICE connection state changed:",
        peer.current.iceConnectionState,
      );
      if (peer.current.iceConnectionState === "connected") {
        setOffer(null);
      } else if (
        peer.current.iceConnectionState === "disconnected" ||
        peer.current.iceConnectionState === "closed" ||
        peer.current.iceConnectionState === "failed"
      ) {
        setOffer(null);
        setLocalStream(null);
        setRemoteStream(null);
      }
    };

    // Получение предложения и отправка ответа
    socket.on("offer", async ({ offer }) => {
      setOffer(offer);
    });
  }, [socket]);

  const handleStartCall = useCallback(async () => {
    if (peer.current.iceConnectionState === "closed") {
      peer.current = new RTCPeerConnection(config);
    }
    const { stream, mutedStream } = await startLocalStream();

    stream.getTracks().forEach(track => {
      peer.current.addTrack(track, stream);
    });
    setLocalStream(mutedStream);
    setRemoteStream(await startCall());
  }, [startCall, startLocalStream]);

  const handleAcceptCall = useCallback(async () => {
    if (offer) {
      setOffer(null);
      if (peer.current.iceConnectionState === "closed") {
        peer.current = new RTCPeerConnection(config);
      }
      const { stream, mutedStream } = await startLocalStream();

      stream.getTracks().forEach(track => {
        peer.current.addTrack(track, stream);
      });
      setLocalStream(mutedStream);
      setRemoteStream(await onAcceptCall(offer));
    }
  }, [offer, onAcceptCall, startLocalStream]);

  const handleLeaveCall = useCallback(async () => {
    localStream?.getTracks().forEach(track => track.stop());
    peer.current.close();
    setOffer(null);
    setTimeout(() => {
      setLocalStream(null);
    }, 0);
    setRemoteStream(null);
  }, [localStream]);

  const handleRejectCall = useCallback(async () => {
    setOffer(null);
  }, []);

  return {
    localStream,
    remoteStream,
    peer,
    offer,
    handleStartCall,
    handleLeaveCall,
    handleAcceptCall,
    handleRejectCall,
  };
};
