"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Device, types } from "mediasoup-client";
import { MeetingParticipant } from "@/types/meetings";

type SocketMessage<T = any> = {
  type: string;
  payload: T;
};

const useWebRTC = (roomId: string, userId: string, userName: string) => {
  const [isScreenSharingActive, setIsScreenSharingActive] = useState(false);
  const [device, setDevice] = useState<Device | null>(null);
  const [sendTransport, setSendTransport] = useState<types.Transport | null>(
    null
  );
  const [recvTransport, setRecvTransport] = useState<types.Transport | null>(
    null
  );

  const [screenShareProducer, setScreenShareProducer] =
    useState<types.Producer | null>(null);
  const [participants, setParticipants] = useState<
    Map<string, MeetingParticipant>
  >(new Map());

  const socketRef = useRef<WebSocket | null>(null);
  const producersRef = useRef<Map<string, types.Producer>>(new Map());
  const consumersRef = useRef<Map<string, types.Consumer>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const deviceRef = useRef<Device | null>(null);
  const sendTransportRef = useRef<types.Transport | null>(null);
  const recvTransportRef = useRef<types.Transport | null>(null);

  useEffect(() => {
    setParticipants((prev) => {
      const newParticipants = new Map(prev);
      if (!newParticipants.has(userId)) {
        newParticipants.set(userId, {
          id: userId,
          name: userName,
          isMuted: false,
          isVideoOff: true,
          isHost: true,
        });
      }
      return newParticipants;
    });
  }, [userId, userName]);

  const sendRequest = useCallback(
    async <T = any>(type: string, payload: any): Promise<T> => {
      return new Promise((resolve, reject) => {
        const socket = socketRef.current;
        if (!socket || socket.readyState !== WebSocket.OPEN) {
          return reject(new Error("Socket not connected"));
        }

        const messageId = Math.random().toString(36).substring(7);
        const handler = (event: MessageEvent) => {
          const data: SocketMessage = JSON.parse(event.data);
          if (
            data.type === `${type}-response` &&
            data.payload.messageId === messageId
          ) {
            socket.removeEventListener("message", handler);
            if (data.payload.error) {
              return reject(new Error(data.payload.error));
            }
            resolve(data.payload.data as T);
          }
        };

        socket.addEventListener("message", handler);
        socket.send(
          JSON.stringify({ type, payload: { ...payload, messageId } })
        );
      });
    },
    []
  );

  const consume = useCallback(
    async (
      producerId: string,
      kind: "audio" | "video",
      remoteParticipantId: string,
      remoteParticipantName: string
    ) => {
      if (!deviceRef.current || !recvTransportRef.current) {
        console.error("Device or receive transport not ready for consumption.");
        return;
      }

      const { rtpCapabilities } = deviceRef.current;
      try {
        const data = await sendRequest<{
          id: string;
          producerId: string;
          kind: "audio" | "video";
          rtpParameters: types.RtpParameters;
        }>("consume", {
          rtpCapabilities,
          producerId,
          transportId: recvTransportRef.current.id,
        });

        const { id, rtpParameters } = data;

        const newConsumer = await recvTransportRef.current.consume({
          id,
          producerId,
          kind,
          rtpParameters,
        });

        consumersRef.current.set(newConsumer.id, newConsumer);

        setParticipants((prev) => {
          const newParticipants = new Map(prev);
          let participant = newParticipants.get(remoteParticipantId);

          if (!participant) {
            participant = {
              id: remoteParticipantId,
              name: remoteParticipantName, // Use provided name
              isMuted: false,
              isVideoOff: false,
              isHost: false,
              stream: new MediaStream(),
            };
            newParticipants.set(remoteParticipantId, participant);
          }

          if (!participant.stream) {
            participant.stream = new MediaStream();
          }
          participant.stream.addTrack(newConsumer.track);

          // Update participant's video/audio status based on kind
          if (kind === "video") {
            participant.isVideoOff = false;
          } else if (kind === "audio") {
            participant.isMuted = false;
          }

          newParticipants.set(remoteParticipantId, participant);
          return newParticipants;
        });

        newConsumer.on("transportclose", () => {
          console.log("Consumer transport closed", newConsumer.id);
          newConsumer.close();
          consumersRef.current.delete(newConsumer.id);
          setParticipants((prev) => {
            const newParticipants = new Map(prev);
            const participant = newParticipants.get(remoteParticipantId);
            if (participant && participant.stream) {
              participant.stream.removeTrack(newConsumer.track);
              if (participant.stream.getTracks().length === 0) {
                newParticipants.delete(remoteParticipantId);
              }
            }
            return newParticipants;
          });
        });

        // newConsumer.on("producerclose", () => {
        //   console.log("Consumer producer closed", newConsumer.id);
        //   newConsumer.close();
        //   consumersRef.current.delete(newConsumer.id);
        //   setParticipants((prev) => {
        //     const newParticipants = new Map(prev);
        //     const participant = newParticipants.get(remoteParticipantId);
        //     if (participant && participant.stream) {
        //       participant.stream.removeTrack(newConsumer.track);
        //       if (participant.stream.getTracks().length === 0) {
        //         newParticipants.delete(remoteParticipantId);
        //       }
        //     }
        //     return newParticipants;
        //   });
        // });

        // Inform the server that we have consumed the producer
        await sendRequest("resumeConsumer", { consumerId: newConsumer.id });
      } catch (error) {
        console.error("❌ consume error:", error);
      }
    },
    [sendRequest]
  );

  useEffect(() => {
    const initMediasoup = async () => {
      try {
        const newDevice = new Device();
        deviceRef.current = newDevice;
        setDevice(newDevice);

        socketRef.current = new WebSocket(`ws://localhost:3001/ws/${roomId}`);

        socketRef.current.onopen = async () => {
          console.log("✅ WebSocket connected");

          // Step 1. Get Router RTP Capabilities
          const routerRtpCapabilities =
            await sendRequest<types.RtpCapabilities>(
              "getRouterRtpCapabilities",
              {}
            );
          await newDevice.load({ routerRtpCapabilities });

          // Step 2. Create Send Transport on Server
          const sendTransportInfo = await sendRequest<any>(
            "createWebRtcTransport",
            {
              forceTcp: false,
              rtpCapabilities: newDevice.rtpCapabilities,
              producing: true,
              consuming: false,
            }
          );

          // Step 3. Create Send Transport on Client
          const newSendTransport =
            newDevice.createSendTransport(sendTransportInfo);
          sendTransportRef.current = newSendTransport;
          setSendTransport(newSendTransport);

          newSendTransport.on(
            "connect",
            async ({ dtlsParameters }, callback, errback) => {
              try {
                await sendRequest("connectWebRtcTransport", {
                  transportId: newSendTransport.id,
                  dtlsParameters,
                });
                callback();
              } catch (error) {
                console.error("❌ send transport connect error:", error);
                errback(error as Error);
              }
            }
          );

          newSendTransport.on(
            "produce",
            async ({ kind, rtpParameters, appData }, callback, errback) => {
              try {
                const { id } = await sendRequest<{ id: string }>("produce", {
                  transportId: newSendTransport.id,
                  kind,
                  rtpParameters,
                  appData,
                });
                callback({ id });
              } catch (error) {
                console.error("❌ send transport produce error:", error);
                errback(error as Error);
              }
            }
          );

          // Step 4. Create Receive Transport on Server
          const recvTransportInfo = await sendRequest<any>(
            "createWebRtcTransport",
            {
              forceTcp: false,
              rtpCapabilities: newDevice.rtpCapabilities,
              producing: false,
              consuming: true,
            }
          );

          // Step 5. Create Receive Transport on Client
          const newRecvTransport =
            newDevice.createRecvTransport(recvTransportInfo);
          recvTransportRef.current = newRecvTransport;
          setRecvTransport(newRecvTransport);

          newRecvTransport.on(
            "connect",
            async ({ dtlsParameters }, callback, errback) => {
              try {
                await sendRequest("connectWebRtcTransport", {
                  transportId: newRecvTransport.id,
                  dtlsParameters,
                });
                callback();
              } catch (error) {
                console.error("❌ recv transport connect error:", error);
                errback(error as Error);
              }
            }
          );

          // Step 6. Join the room and get existing producers
          const { producers: existingProducers } = await sendRequest<{
            producers: {
              id: string;
              kind: "audio" | "video";
              participantId: string;
              participantName: string;
            }[];
          }>("joinRoom", {
            roomId,
            rtpCapabilities: newDevice.rtpCapabilities,
          });

          for (const producerInfo of existingProducers) {
            await consume(
              producerInfo.id,
              producerInfo.kind,
              producerInfo.participantId,
              producerInfo.participantName
            );
          }
        };

        socketRef.current.onmessage = async (event: MessageEvent) => {
          const { type, payload }: SocketMessage = JSON.parse(event.data);
          switch (type) {
            case "newProducer":
              console.log(
                "New producer detected:",
                payload.producerId,
                payload.kind,
                payload.participantId,
                payload.participantName
              );
              await consume(
                payload.producerId,
                payload.kind,
                payload.participantId,
                payload.participantName
              );
              break;
            case "producerClosed":
              console.log("Producer closed:", payload.producerId);
              setParticipants((prev) => {
                const newParticipants = new Map(prev);
                const participant = newParticipants.get(payload.participantId);

                if (participant && participant.stream) {
                  // Find the track associated with this producerId and remove it
                  const trackToRemove = participant.stream
                    .getTracks()
                    .find((track) => {
                      const consumer = consumersRef.current.get(track.id); // Assuming track.id is consumer.id
                      return (
                        consumer && consumer.producerId === payload.producerId
                      );
                    });

                  if (trackToRemove) {
                    trackToRemove.stop();
                    participant.stream.removeTrack(trackToRemove);
                    // Also remove the consumer from our map
                    consumersRef.current.forEach((consumer, consumerId) => {
                      if (consumer.producerId === payload.producerId) {
                        consumer.close();
                        consumersRef.current.delete(consumerId);
                      }
                    });
                  }

                  // If no more tracks, remove the stream and potentially update participant status
                  if (participant.stream.getTracks().length === 0) {
                    participant.stream = undefined;
                    // Optionally, set video/audio off if no tracks remain
                    if (trackToRemove?.kind === "video")
                      participant.isVideoOff = true;
                    if (trackToRemove?.kind === "audio")
                      participant.isMuted = true;
                  }
                }
                return newParticipants;
              });
              break;
            default:
              break;
          }
        };

        socketRef.current.onclose = () => {
          console.log("❌ WebSocket disconnected");
          // Handle cleanup on disconnect
        };

        socketRef.current.onerror = (error) => {
          console.error("❌ WebSocket error:", error);
        };
      } catch (error) {
        console.error("❌ init mediasoup error:", error);
      }
    };

    initMediasoup();

    return () => {
      socketRef.current?.close();
      sendTransportRef.current?.close();
      recvTransportRef.current?.close();
      producersRef.current.forEach((p) => p.close());
      consumersRef.current.forEach((c) => c.close());
    };
  }, [roomId, sendRequest, consume]);

  const startMedia = useCallback(
    async (video: boolean, audio: boolean) => {
      if (!deviceRef.current || !sendTransportRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video,
          audio,
        });
        localStreamRef.current = stream;

        setParticipants((prev) => {
          const newParticipants = new Map(prev);
          const localParticipant = newParticipants.get(userId);
          if (localParticipant) {
            localParticipant.stream = stream;
            // We'll update isVideoOff/isMuted based on actual producers being created
            newParticipants.set(userId, localParticipant);
          }
          return newParticipants;
        });

        if (audio) {
          const audioTrack = stream.getAudioTracks()[0];
          if (audioTrack) {
            const audioProducer = await sendTransportRef.current.produce({
              track: audioTrack,
              appData: { kind: "audio" },
            });
            producersRef.current.set(audioProducer.id, audioProducer);
            setParticipants((prev) => {
              const newParticipants = new Map(prev);
              const localParticipant = newParticipants.get(userId);
              if (localParticipant) {
                localParticipant.isMuted = false; // Audio is on
                newParticipants.set(userId, localParticipant);
              }
              return newParticipants;
            });
          }
        }

        if (video) {
          const videoTrack = stream.getVideoTracks()[0];
          if (videoTrack) {
            const videoProducer = await sendTransportRef.current.produce({
              track: videoTrack,
              appData: { kind: "video" },
            });
            producersRef.current.set(videoProducer.id, videoProducer);
            setParticipants((prev) => {
              const newParticipants = new Map(prev);
              const localParticipant = newParticipants.get(userId);
              if (localParticipant) {
                localParticipant.isVideoOff = false; // Video is on
                newParticipants.set(userId, localParticipant);
              }
              return newParticipants;
            });
          }
        }
      } catch (error) {
        console.error("❌ startMedia error:", error);
      }
    },
    [userId]
  );

  const startScreenShare = useCallback(async () => {
    if (!deviceRef.current || !sendTransportRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      // Stop existing camera video track if present before starting screen share
      let cameraVideoProducer: types.Producer | undefined;
      producersRef.current.forEach((p) => {
        if (p.appData.kind === "video") {
          cameraVideoProducer = p;
        }
      });

      if (cameraVideoProducer) {
        cameraVideoProducer.close();
        producersRef.current.delete(cameraVideoProducer.id);
      }

      localStreamRef.current = stream; // This stream now contains only the screen share

      setParticipants((prev) => {
        const newParticipants = new Map(prev);
        const localParticipant = newParticipants.get(userId);
        if (localParticipant) {
          // Only keep audio tracks from original stream if any, add screen share video
          const existingAudioTracks =
            localParticipant.stream?.getAudioTracks() || [];
          const newLocalStream = new MediaStream([
            ...existingAudioTracks,
            ...stream.getVideoTracks(),
          ]);

          localParticipant.stream = newLocalStream; // Update stream for local participant
          localParticipant.isVideoOff = false; // Screen share implies video is on
          newParticipants.set(userId, localParticipant);
        }
        return newParticipants;
      });

      const screenTrack = stream.getVideoTracks()[0];
      if (screenTrack) {
        const screenProducer = await sendTransportRef.current.produce({
          track: screenTrack,
          appData: { kind: "screen" },
        });
        producersRef.current.set(screenProducer.id, screenProducer);
        setScreenShareProducer(screenProducer);
        setIsScreenSharingActive(true);

        screenTrack.onended = () => {
          console.log("Screen share stopped by user");
          stopScreenShare();
        };
      }
    } catch (error) {
      console.error("❌ startScreenShare error:", error);
    }
  }, [userId]);

  const stopMedia = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    producersRef.current.forEach((producer) => {
      if (producer.appData.kind !== "screen") {
        producer.close();
        producersRef.current.delete(producer.id);
      }
    });

    setParticipants((prev) => {
      const newParticipants = new Map(prev);
      const localParticipant = newParticipants.get(userId);
      if (localParticipant) {
        localParticipant.stream = undefined;
        localParticipant.isMuted = true;
        localParticipant.isVideoOff = true;
        newParticipants.set(userId, localParticipant);
      }
      return newParticipants;
    });
  }, [userId]);

  const stopScreenShare = useCallback(() => {
    if (screenShareProducer) {
      screenShareProducer.close();
      producersRef.current.delete(screenShareProducer.id);
      setScreenShareProducer(null);
      setIsScreenSharingActive(false);
    }

    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        if (track.kind === "video" && track.label.includes("screen")) {
          track.stop();
        }
      });
      // Potentially need to re-add camera stream if it was active before screen share
    }

    setParticipants((prev) => {
      const newParticipants = new Map(prev);
      const localParticipant = newParticipants.get(userId);
      if (localParticipant) {
        // Remove screen share stream, but keep camera if it was active
        if (localParticipant.stream) {
          const cameraTracks = localParticipant.stream
            .getVideoTracks()
            .filter((track) => !track.label.includes("screen"));
          if (cameraTracks.length > 0) {
            // Keep camera stream
          } else {
            localParticipant.stream = undefined;
            localParticipant.isVideoOff = true;
          }
        }
        newParticipants.set(userId, localParticipant);
      }
      return newParticipants;
    });
  }, [screenShareProducer, userId]);

  const toggleMic = useCallback(() => {
    const audioProducer = Array.from(producersRef.current.values()).find(
      (p) => p.appData.kind === "audio"
    );
    if (audioProducer) {
      if (audioProducer.paused) {
        audioProducer.resume();
        setParticipants((prev) => {
          const newParticipants = new Map(prev);
          const localParticipant = newParticipants.get(userId);
          if (localParticipant) {
            localParticipant.isMuted = false;
            newParticipants.set(userId, localParticipant);
          }
          return newParticipants;
        });
      } else {
        audioProducer.pause();
        setParticipants((prev) => {
          const newParticipants = new Map(prev);
          const localParticipant = newParticipants.get(userId);
          if (localParticipant) {
            localParticipant.isMuted = true;
            newParticipants.set(userId, localParticipant);
          }
          return newParticipants;
        });
      }
    }
  }, [userId]);

  const toggleCamera = useCallback(() => {
    const videoProducer = Array.from(producersRef.current.values()).find(
      (p) => p.appData.kind === "video"
    );
    if (videoProducer) {
      if (videoProducer.paused) {
        videoProducer.resume();
        setParticipants((prev) => {
          const newParticipants = new Map(prev);
          const localParticipant = newParticipants.get(userId);
          if (localParticipant) {
            localParticipant.isVideoOff = false;
            newParticipants.set(userId, localParticipant);
          }
          return newParticipants;
        });
      } else {
        videoProducer.pause();
        setParticipants((prev) => {
          const newParticipants = new Map(prev);
          const localParticipant = newParticipants.get(userId);
          if (localParticipant) {
            localParticipant.isVideoOff = true;
            newParticipants.set(userId, localParticipant);
          }
          return newParticipants;
        });
      }
    }
  }, [userId]);

  return {
    participants: Array.from(participants.values()),
    startMedia,
    startScreenShare,
    stopMedia,
    stopScreenShare,
    isScreenSharingActive,
    toggleMic,
    toggleCamera,
  };
};
export default useWebRTC;
