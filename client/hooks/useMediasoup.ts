import { useEffect, useRef, useCallback } from "react";
import { MediasoupClient } from "../lib/mediasoup-client";
import { MediasoupClientOptions } from "../types/mediasoup";
import { useMediaStore } from "@/stores/mediaStore";

export const useMediasoup = ({
  roomId,
  peerId,
  websocketUrl,
}: MediasoupClientOptions) => {
  const clientRef = useRef<MediasoupClient | null>(null);

  // Get state and actions from Zustand store
  const {
    participants,
    localStream,
    isMicEnabled,
    isWebcamEnabled,
    isScreenSharing,
    isDeviceLoaded,
    setPeerId,
    setLocalStream,
    addRemoteStream,
    updateParticipantStream,
    removeTrackFromParticipant,
    addParticipant,
    removeParticipant,
    setMicEnabled,
    setWebcamEnabled,
    setScreenSharing,
    setDeviceLoaded,
    initializeLocalParticipant,
    reset,
  } = useMediaStore();

  /* -----------------------------------------------------
   * STEP 0 — Initialize peerId and local participant
   * ----------------------------------------------------- */
  useEffect(() => {
    setPeerId(peerId);
    initializeLocalParticipant();
  }, [peerId, setPeerId, initializeLocalParticipant]);

  /* -----------------------------------------------------
   * STEP 1 — Create MediasoupClient & listen to events
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
        updateParticipantStream(peerId, track);
      });
    });

    /* --- remote producer became available --- */
    client.on("newConsumer", ({ peerId: remoteId, kind, track }) => {
      const isScreen =
        kind === "video" && track.label.toLowerCase().includes("screen");

      addRemoteStream(new MediaStream([track]));
      updateParticipantStream(remoteId, track, isScreen);
    });

    /* --- remote producer closed --- */
    client.on("consumerClosed", ({ producerId }) => {
      removeTrackFromParticipant(producerId);
    });

    /* --- participants from server (joinRoomResponse) --- */
    client.on("newParticipant", ({ peerId: pId, name, isHost }) => {
      addParticipant({
        id: pId,
        name,
        stream: new MediaStream(),
        isLocal: false,
        isScreenShare: false,
        isMuted: false,
        isVideoOff: true,
        isHost,
      });
    });

    client.on("participantLeft", ({ peerId: leftPeerId }) => {
      removeParticipant(leftPeerId);
    });

    client.on("deviceLoaded", () => {
      console.log("Device loaded, ready to produce media");
      setDeviceLoaded(true);
    });

    return () => {
      client.close();
      reset();
    };
  }, [
    roomId,
    peerId,
    websocketUrl,
    setLocalStream,
    addRemoteStream,
    updateParticipantStream,
    removeTrackFromParticipant,
    addParticipant,
    removeParticipant,
    setDeviceLoaded,
    reset,
  ]);

  /* -----------------------------------------------------
   * STEP 2 — Media controls
   * ----------------------------------------------------- */

  const startMedia = useCallback(
    async (cam: boolean, mic: boolean) => {
      const client = clientRef.current;
      if (!client) return;

      if (cam) {
        await client.enableWebcam();
        setWebcamEnabled(true);
      }
      if (mic) {
        await client.enableMic();
        setMicEnabled(true);
      }
    },
    [setWebcamEnabled, setMicEnabled]
  );

  const stopMedia = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;

    await client.disableWebcam();
    await client.disableMic();

    setWebcamEnabled(false);
    setMicEnabled(false);
  }, [setWebcamEnabled, setMicEnabled]);

  const toggleMic = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;

    if (isMicEnabled) {
      await client.disableMic();
      setMicEnabled(false);
    } else {
      await client.enableMic();
      setMicEnabled(true);
    }
  }, [isMicEnabled, setMicEnabled]);

  const toggleCamera = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;

    if (isWebcamEnabled) {
      await client.disableWebcam();
      setWebcamEnabled(false);
    } else {
      await client.enableWebcam();
      setWebcamEnabled(true);
    }
  }, [isWebcamEnabled, setWebcamEnabled]);

  const startScreenShare = useCallback(async () => {
    await clientRef.current?.enableScreenShare();
    setScreenSharing(true);
  }, [setScreenSharing]);

  const stopScreenShare = useCallback(async () => {
    await clientRef.current?.disableScreenShare();
    setScreenSharing(false);
  }, [setScreenSharing]);

  /* -----------------------------------------------------
   * Return state & actions
   * ----------------------------------------------------- */
  return {
    localStream,
    participants,

    isMicEnabled,
    isWebcamEnabled,
    isScreenSharing,
    isDeviceLoaded,

    startMedia,
    stopMedia,
    toggleMic,
    toggleCamera,
    startScreenShare,
    stopScreenShare,
  };
};
