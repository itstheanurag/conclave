import { useEffect, useState, useRef, useCallback } from "react";
import { MediasoupClient } from "../lib/mediasoup-client";

interface UseMediasoupOptions {
  roomId: string;
  peerId: string;
  websocketUrl: string;
}

interface Participant {
  id: string;
  name: string;
  stream?: MediaStream;
  isLocal: boolean;
  isScreenShare?: boolean;
}

export const useMediasoup = ({
  roomId,
  peerId,
  websocketUrl,
}: UseMediasoupOptions) => {
  const [mediasoupClient, setMediasoupClient] =
    useState<MediasoupClient | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const [participants, setParticipants] = useState<Map<string, Participant>>(
    new Map()
  );
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const mediasoupClientRef = useRef<MediasoupClient | null>(null);

  useEffect(() => {
    const client = new MediasoupClient({ roomId, peerId, websocketUrl });
    mediasoupClientRef.current = client;
    setMediasoupClient(client);

    client.on("localStream", (stream: MediaStream) => {
      setLocalStream(stream);
    });

    client.on(
      "newConsumer",
      ({ peerId: remotePeerId, producerId, kind, track }) => {
        setRemoteStreams((prev) => {
          const newStream = new MediaStream();
          newStream.addTrack(track);
          return [...prev, newStream];
        });
        setParticipants((prev) => {
          const newParticipants = new Map(prev);
          newParticipants.set(remotePeerId, {
            id: remotePeerId,
            name: `Guest-${remotePeerId.substring(0, 5)}`,
            stream: new MediaStream([track]),
            isLocal: false,
            isScreenShare: kind === "video" && track.label.includes("screen"),
          });
          return newParticipants;
        });
      }
    );

    client.on("consumerClosed", ({ producerId }) => {
      setRemoteStreams((prev) =>
        prev.filter(
          (stream) =>
            !stream.getTracks().some((track) => track.id === producerId)
        )
      );
      setParticipants((prev) => {
        const newParticipants = new Map(prev);
        // Find participant by producerId and remove
        for (const [pId, participant] of newParticipants.entries()) {
          if (
            participant.stream
              ?.getTracks()
              .some((track) => track.id === producerId)
          ) {
            newParticipants.delete(pId);
            break;
          }
        }
        return newParticipants;
      });
    });

    return () => {
      mediasoupClientRef.current?.close();
    };
  }, [roomId, peerId, websocketUrl]);

  const startMedia = useCallback(
    async (enableWebcam: boolean, enableMic: boolean) => {
      if (!mediasoupClientRef.current) return;

      if (enableWebcam) {
        await mediasoupClientRef.current.enableWebcam();
        setIsWebcamEnabled(true);
      }
      if (enableMic) {
        await mediasoupClientRef.current.enableMic();
        setIsMicEnabled(true);
      }
    },
    []
  );

  const stopMedia = useCallback(async () => {
    if (!mediasoupClientRef.current) return;

    await mediasoupClientRef.current.disableWebcam();
    await mediasoupClientRef.current.disableMic();
    setIsWebcamEnabled(false);
    setIsMicEnabled(false);
  }, []);

  const startScreenShare = useCallback(async () => {
    if (!mediasoupClientRef.current) return;

    await mediasoupClientRef.current.enableScreenShare();
    setIsScreenSharing(true);
  }, []);

  const stopScreenShare = useCallback(async () => {
    if (!mediasoupClientRef.current) return;

    await mediasoupClientRef.current.disableScreenShare();
    setIsScreenSharing(false);
  }, []);

  const toggleMic = useCallback(async () => {
    if (!mediasoupClientRef.current) return;

    if (isMicEnabled) {
      await mediasoupClientRef.current.disableMic();
    } else {
      await mediasoupClientRef.current.enableMic();
    }
    setIsMicEnabled((prev) => !prev);
  }, [isMicEnabled]);

  const toggleCamera = useCallback(async () => {
    if (!mediasoupClientRef.current) return;

    if (isWebcamEnabled) {
      await mediasoupClientRef.current.disableWebcam();
    } else {
      await mediasoupClientRef.current.enableWebcam();
    }
    setIsWebcamEnabled((prev) => !prev);
  }, [isWebcamEnabled]);

  return {
    localStream,
    remoteStreams,
    participants,
    isMicEnabled,
    isWebcamEnabled,
    isScreenSharing,
    startMedia,
    stopMedia,
    startScreenShare,
    stopScreenShare,
    toggleMic,
    toggleCamera,
  };
};
