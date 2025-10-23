"use client";

import { useState, useEffect, useRef } from "react";
import { Device, types } from "mediasoup-client";

type SocketMessage<T = any> = {
  type: string;
  payload: T;
};

const useWebRTC = (roomId: string) => {
  const [device, setDevice] = useState<Device | null>(null);
  const [transport, setTransport] = useState<types.Transport | null>(null);
  const [producer, setProducer] = useState<types.Producer | null>(null);
  const [consumer, setConsumer] = useState<types.Consumer | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [screenShareProducer, setScreenShareProducer] =
    useState<types.Producer | null>(null);

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const newDevice = new Device();
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

          // Step 2. Create Transport on Server
          const transportInfo = await sendRequest<any>(
            "createWebRtcTransport",
            {
              forceTcp: false,
              rtpCapabilities: newDevice.rtpCapabilities,
            }
          );

          // Step 3. Create Send Transport on Client
          const sendTransport = newDevice.createSendTransport(transportInfo);
          setTransport(sendTransport);

          sendTransport.on(
            "connect",
            async ({ dtlsParameters }, callback, errback) => {
              try {
                await sendRequest("connectWebRtcTransport", {
                  transportId: sendTransport.id,
                  dtlsParameters,
                });
                callback();
              } catch (error) {
                console.error("❌ connect error:", error);
                errback(error as Error);
              }
            }
          );

          sendTransport.on(
            "produce",
            async ({ kind, rtpParameters }, callback, errback) => {
              try {
                const { id } = await sendRequest<{ id: string }>("produce", {
                  transportId: sendTransport.id,
                  kind,
                  rtpParameters,
                });
                callback({ id });
              } catch (error) {
                console.error("❌ produce error:", error);
                errback(error as Error);
              }
            }
          );
        };

        socketRef.current.onmessage = async (event: MessageEvent) => {
          const { type, payload }: SocketMessage = JSON.parse(event.data);
          switch (type) {
            case "newProducer":
              await consume(payload.producerId);
              break;
            default:
              break;
          }
        };
      } catch (error) {
        console.error("❌ init error:", error);
      }
    };

    init();

    return () => {
      socketRef.current?.close();
    };
  }, [roomId]);

  /**
   * Helper: Send request and await response with same type
   */
  const sendRequest = <T = any>(type: string, payload: any): Promise<T> => {
    return new Promise((resolve, reject) => {
      const socket = socketRef.current;
      if (!socket || socket.readyState !== WebSocket.OPEN)
        return reject(new Error("Socket not connected"));

      const handler = (event: MessageEvent) => {
        const data: SocketMessage = JSON.parse(event.data);
        if (data.type === type) {
          socket.removeEventListener("message", handler);
          resolve(data.payload as T);
        }
      };

      socket.addEventListener("message", handler);
      socket.send(JSON.stringify({ type, payload }));
    });
  };

  /**
   * Start user camera/mic
   */
  const startMedia = async (video: boolean, audio: boolean) => {
    if (!device || !transport) return;
    const stream = await navigator.mediaDevices.getUserMedia({ video, audio });
    setLocalStream(stream);

    const track = video
      ? stream.getVideoTracks()[0]
      : stream.getAudioTracks()[0];
    if (!track) return;

    const newProducer = await transport.produce({ track });
    setProducer(newProducer);
  };

  /**
   * Consume remote producer
   */
  const consume = async (producerId: string) => {
    if (!device || !transport) return;

    const { rtpCapabilities } = device;
    const data = await sendRequest<{
      id: string;
      producerId: string;
      kind: "audio" | "video";
      rtpParameters: types.RtpParameters;
    }>("consume", {
      rtpCapabilities,
      producerId,
      transportId: transport.id,
    });

    const { id, kind, rtpParameters } = data;

    const newConsumer = await transport.consume({
      id,
      producerId,
      kind,
      rtpParameters,
    });

    setConsumer(newConsumer);

    const stream = new MediaStream();
    stream.addTrack(newConsumer.track);
    setRemoteStream(stream);
  };

  /**
   * Start screen share
   */
  const startScreenShare = async () => {
    if (!device || !transport) return;
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    setLocalStream(stream);

    const track = stream.getVideoTracks()[0];
    if (!track) return;

    const newProducer = await transport.produce({ track });
    setScreenShareProducer(newProducer);
  };

  /**
   * Stop all media
   */
  const stopMedia = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (producer) {
      producer.close();
      setProducer(null);
    }
  };

  /**
   * Stop screen share
   */
  const stopScreenShare = () => {
    if (screenShareProducer) {
      screenShareProducer.close();
      setScreenShareProducer(null);
    }
  };

  return {
    localStream,
    remoteStream,
    startMedia,
    startScreenShare,
    stopMedia,
    stopScreenShare,
  };
};

export default useWebRTC;
