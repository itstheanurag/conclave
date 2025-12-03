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
  const [isDeviceLoaded, setIsDeviceLoaded] = useState(false);

  const clientRef = useRef<MediasoupClient | null>(null);

  /* -----------------------------------------------------
   * STEP 0 — Ensure local participant always exists
   * ----------------------------------------------------- */
  useEffect(() => {
    setParticipants((prev) => {
      const updated = new Map(prev);
      if (!updated.has(peerId)) {
        updated.set(peerId, {
          id: peerId,
          name: "You",
          stream: new MediaStream(),
          isLocal: true,
          isScreenShare: false,
          isMuted: true,
          isVideoOff: true,
          isHost: true,
        });
      }
      return updated;
    });
  }, [peerId]);

  /* -----------------------------------------------------
   * STEP 1 — Helper: update / add track
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
        } else {
          participant = { ...participant };
        }

        // Remove old track (same kind)
        const oldTrack = participant.stream
          ?.getTracks()
          .find((t) => t.kind === track.kind);
        if (oldTrack) participant.stream?.removeTrack(oldTrack);

        // Add new track
        participant.stream?.addTrack(track);

        if (track.kind === "video" && !screenShare) {
          participant.isVideoOff = false;
        }

        if (screenShare) participant.isScreenShare = true;

        updated.set(pId, participant);
        return updated;
      });
    },
    [peerId]
  );

  /* -----------------------------------------------------
   * STEP 2 — Remove consumer track
   * ----------------------------------------------------- */
  const removeTrack = useCallback((producerIdToRemove: string) => {
    setParticipants((prev) => {
      const updated = new Map(prev);

      for (const [pid, p] of updated.entries()) {
        if (!p.stream) continue;

        const track = p.stream
          .getTracks()
          .find((t) => t.id === producerIdToRemove);

        if (track) {
          const newP = { ...p }; // Clone
          newP.stream?.removeTrack(track);

          if (track.kind === "video") {
            newP.isVideoOff = true;
          }

          if (newP.stream?.getTracks().length === 0 && !newP.isLocal) {
            updated.delete(pid);
          } else {
            updated.set(pid, newP);
          }
        }
      }

      return updated;
    });
  }, []);

  /* -----------------------------------------------------
   * STEP 3 — Create MediasoupClient & listen to events
   * ----------------------------------------------------- */
  useEffect(() => {
    const client = new MediasoupClient({
      roomId,
      peerId,
      websocketUrl,
    });

    clientRef.current = client;

    /* --- local media available --- */
    client.on("localStream", (stream) => {
      if (!stream) return;
      setLocalStream(stream);
      stream.getTracks().forEach((track) => {
        updateParticipant(peerId, track);
      });
    });

    /* --- remote producer became available --- */
    client.on("newConsumer", ({ peerId: remoteId, kind, track }) => {
      const isScreen =
        kind === "video" && track.label.toLowerCase().includes("screen");

      setRemoteStreams((prev) => [...prev, new MediaStream([track])]);

      updateParticipant(remoteId, track, isScreen);
    });

    /* --- remote producer closed --- */
    client.on("consumerClosed", ({ producerId }) => {
      removeTrack(producerId);
    });

    /* --- participants from server (joinRoomResponse) --- */
    client.on("newParticipant", ({ peerId: pId, name, isHost }) => {
      setParticipants((prev) => {
        const updated = new Map(prev);
        if (!updated.has(pId)) {
          updated.set(pId, {
            id: pId,
            name,
            stream: new MediaStream(),
            isLocal: false,
            isScreenShare: false,
            isMuted: false,
            isVideoOff: true,
            isHost,
          });
        }
        return updated;
      });
    });

    client.on("participantLeft", ({ peerId }) => {
      setParticipants((prev) => {
        const updated = new Map(prev);
        updated.delete(peerId);
        return updated;
      });
    });

    client.on("deviceLoaded", () => {
      console.log("Device loaded, ready to produce media");
      setIsDeviceLoaded(true);
    });

    return () => {
      client.close();
    };
  }, [roomId, peerId, websocketUrl, updateParticipant, removeTrack]);

  /* -----------------------------------------------------
   * STEP 4 — Media controls
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

  /* -----------------------------------------------------
   * Return state & actions
   * ----------------------------------------------------- */
  return {
    localStream,
    remoteStreams,
    participants,

    isMicEnabled,
    isWebcamEnabled,
    isScreenSharing,

    startMedia,
    stopMedia,
    toggleMic,
    toggleCamera,
    startScreenShare,
    stopScreenShare,
    isDeviceLoaded,
  };
};
