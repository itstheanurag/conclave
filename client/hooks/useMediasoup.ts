import { useEffect, useState, useRef, useCallback } from "react";
import { MediasoupClient } from "../lib/mediasoup-client";
import { MediasoupClientOptions, Participant } from "@/types/mediasoup";

export const useMediasoup = ({
  roomId,
  peerId,
  websocketUrl,
}: MediasoupClientOptions) => {

  const [participants, setParticipants] = useState<Map<string, Participant>>(
    new Map()
  );

  const isWebcamEnabledRef = useRef(false);
  const isMicEnabledRef = useRef(false);

  const mediasoupClientRef = useRef<MediasoupClient | null>(null);

  // ---------- Add / Update Participant ----------
  const updateParticipant = useCallback(
    (pId: string, track: MediaStreamTrack | null, screenShare = false) => {
      setParticipants((prev) => {
        const updated = new Map(prev);

        let participant = updated.get(pId);
        if (!participant) {
          participant = {
            id: pId,
            name: pId === peerId ? "You" : `Guest-${pId.substring(0, 5)}`,
            stream: new MediaStream(),
            isLocal: pId === peerId,
            isScreenShare: false,
          };
        }

        // add track
        if (track) {
          // remove old track of same kind (audio/video)
          const old = participant.stream
            .getTracks()
            .find((t) => t.kind === track.kind);
          if (old) participant.stream.removeTrack(old);

          participant.stream.addTrack(track);

          if (screenShare) participant.isScreenShare = true;
        }

        updated.set(pId, participant);
        return updated;
      });
    },
    [peerId]
  );

  // ---------- Remove Track / Participant ----------
  const removeTrack = useCallback((producerId: string) => {
    setParticipants((prev) => {
      const updated = new Map(prev);

      for (const [id, p] of updated.entries()) {
        const track = p.stream.getTracks().find((t) => t.id === producerId);
        if (track) {
          p.stream.removeTrack(track);

          // if no tracks left, remove participant
          if (p.stream.getTracks().length === 0) {
            updated.delete(id);
          }
        }
      }
      return updated;
    });
  }, []);

  // ---------- Setup mediasoup client ----------
  useEffect(() => {
    const client = new MediasoupClient({ roomId, peerId, websocketUrl });
    mediasoupClientRef.current = client;

    // local stream
    client.on("localStream", (stream) => {
      if (!stream) return;

      for (const track of stream.getTracks()) {
        updateParticipant(peerId, track);
      }
    });

    client.on("newConsumer", ({ peerId: remotePeerId, kind, track }) => {
      const isScreen = kind === "video" && track.label.includes("screen");
      updateParticipant(remotePeerId, track, isScreen);
    });

    client.on("consumerClosed", ({ producerId }) => {
      removeTrack(producerId);
    });

    return () => {
      client.close();
    };
  }, [roomId, peerId, websocketUrl, updateParticipant, removeTrack]);

  // ---------- MEDIA CONTROL ----------
  const toggleMic = useCallback(async () => {
    const client = mediasoupClientRef.current;
    if (!client) return;

    if (isMicEnabledRef.current) {
      await client.disableMic();
      isMicEnabledRef.current = false;
    } else {
      await client.enableMic();
      isMicEnabledRef.current = true;
    }
  }, []);

  const toggleCamera = useCallback(async () => {
    const client = mediasoupClientRef.current;
    if (!client) return;

    if (isWebcamEnabledRef.current) {
      await client.disableWebcam();
      isWebcamEnabledRef.current = false;
    } else {
      await client.enableWebcam();
      isWebcamEnabledRef.current = true;
    }
  }, []);

  const startScreenShare = useCallback(async () => {
    const client = mediasoupClientRef.current;
    if (!client) return;

    await client.enableScreenShare();
  }, []);

  const stopScreenShare = useCallback(async () => {
    const client = mediasoupClientRef.current;
    if (!client) return;

    await client.disableScreenShare();
  }, []);

  return {
    participants,
    toggleMic,
    toggleCamera,
    startScreenShare,
    stopScreenShare,
  };
};
