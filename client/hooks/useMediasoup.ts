import { useEffect, useState, useRef, useCallback } from "react";
import { MediasoupClient } from "../lib/mediasoup-client";
import { MediasoupClientOptions, MeetingParticipant } from "../types/mediasoup";

export const useMediasoup = ({
  roomId,
  peerId,
  websocketUrl,
}: MediasoupClientOptions) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

  const [participants, setParticipants] = useState<
    Map<string, MeetingParticipant>
  >(new Map());

  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const clientRef = useRef<MediasoupClient | null>(null);

  /* -----------------------------------------------------
   * Participant helpers
   * ----------------------------------------------------- */
  const updateParticipant = useCallback(
    (pId: string, track: MediaStreamTrack, screenShare = false) => {
      setParticipants((prev) => {
        const updated = new Map(prev);

        let participant = updated.get(pId);

        if (!participant) {
          participant = {
            id: pId,
            name: pId === peerId ? "You" : `Guest-${pId.slice(0, 5)}`,
            stream: new MediaStream(),
            isLocal: pId === peerId,
            isScreenShare: false,
            isMuted: false,
            isVideoOff: false,
            isHost: false,
          };
        }

        // Remove existing track of the same kind
        const oldTrack = participant
          .stream!.getTracks()
          .find((t) => t.kind === track.kind);

        if (oldTrack) participant.stream!.removeTrack(oldTrack);

        participant.stream!.addTrack(track);

        if (screenShare) participant.isScreenShare = true;

        updated.set(pId, participant);
        return updated;
      });
    },
    [peerId]
  );

  const removeTrack = useCallback((producerIdToRemove: string) => {
    setParticipants((prev) => {
      const updated = new Map(prev);

      for (const [pid, p] of updated.entries()) {
        if (!p.stream) continue;

        // Find and remove track whose id matches producerId (used as key in MediasoupClient)
        const track = p.stream
          .getTracks()
          .find((t) => t.id === producerIdToRemove);

        if (track) {
          p.stream.removeTrack(track);

          // If participant has no more tracks and isn't local, remove them
          if (p.stream.getTracks().length === 0 && !p.isLocal) {
            updated.delete(pid);
          } else {
            updated.set(pid, p);
          }
        }
      }

      return updated;
    });
  }, []);

  /* -----------------------------------------------------
   * Setup mediasoup client
   * ----------------------------------------------------- */
  useEffect(() => {
    const client = new MediasoupClient({
      roomId,
      peerId,
      websocketUrl,
    });

    clientRef.current = client;

    /* ---------------------- Local Stream ---------------------- */

    client.on("localStream", (stream) => {
      if (!stream) return;

      setLocalStream(stream);

      stream.getTracks().forEach((track) => {
        updateParticipant(peerId, track);
      });
    });

    /* ---------------------- New Consumer ---------------------- */

    client.on(
      "newConsumer",
      ({ peerId: remoteId, producerId, kind, track }) => {
        // If the browser marks the track label with "screen", mark as screenShare
        const isScreen =
          kind === "video" && track.label.toLowerCase().includes("screen");

        // Keep a raw MediaStream list for UI uses like grids
        setRemoteStreams((prev) => [...prev, new MediaStream([track])]);

        updateParticipant(remoteId, track, isScreen);
      }
    );

    /* ---------------------- Consumer Closed ---------------------- */

    client.on("consumerClosed", ({ producerId }) => {
      removeTrack(producerId);
    });

    return () => {
      client.close();
    };
  }, [roomId, peerId, websocketUrl, updateParticipant, removeTrack]);

  /* -----------------------------------------------------
   * Media controls
   * ----------------------------------------------------- */

  const startMedia = useCallback(async (cam: boolean, mic: boolean) => {
    const client = clientRef.current;
    if (!client) return;

    if (cam) {
      await client.enableWebcam();
      setIsWebcamEnabled(true);
    }

    if (mic) {
      await client.enableMic();
      setIsMicEnabled(true);
    }
  }, []);

  const stopMedia = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;

    await client.disableWebcam();
    await client.disableMic();

    setIsWebcamEnabled(false);
    setIsMicEnabled(false);
  }, []);

  const toggleMic = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;

    if (isMicEnabled) {
      await client.disableMic();
      setIsMicEnabled(false);
    } else {
      await client.enableMic();
      setIsMicEnabled(true);
    }
  }, [isMicEnabled]);

  const toggleCamera = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;

    if (isWebcamEnabled) {
      await client.disableWebcam();
      setIsWebcamEnabled(false);
    } else {
      await client.enableWebcam();
      setIsWebcamEnabled(true);
    }
  }, [isWebcamEnabled]);

  const startScreenShare = useCallback(async () => {
    await clientRef.current?.enableScreenShare();
    setIsScreenSharing(true);
  }, []);

  const stopScreenShare = useCallback(async () => {
    await clientRef.current?.disableScreenShare();
    setIsScreenSharing(false);
  }, []);

  return {
    localStream,
    remoteStreams,
    participants,

    // UI state
    isMicEnabled,
    isWebcamEnabled,
    isScreenSharing,

    // Methods
    startMedia,
    stopMedia,
    toggleMic,
    toggleCamera,
    startScreenShare,
    stopScreenShare,
  };
};
