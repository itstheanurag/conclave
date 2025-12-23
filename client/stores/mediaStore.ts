import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { MeetingParticipant } from "@/types/mediasoup";

interface MediaState {
  // State
  participants: Map<string, MeetingParticipant>;
  localStream: MediaStream | null;
  remoteStreams: MediaStream[];
  isMicEnabled: boolean;
  isWebcamEnabled: boolean;
  isScreenSharing: boolean;
  isDeviceLoaded: boolean;
  peerId: string;

  // Actions
  setPeerId: (id: string) => void;
  setParticipants: (participants: Map<string, MeetingParticipant>) => void;
  addParticipant: (participant: MeetingParticipant) => void;
  updateParticipant: (id: string, updates: Partial<MeetingParticipant>) => void;
  updateParticipantStream: (
    id: string,
    track: MediaStreamTrack,
    isScreenShare?: boolean
  ) => void;
  removeParticipant: (id: string) => void;
  removeTrackFromParticipant: (producerId: string) => void;
  setLocalStream: (stream: MediaStream | null) => void;
  addRemoteStream: (stream: MediaStream) => void;
  setMicEnabled: (enabled: boolean) => void;
  setWebcamEnabled: (enabled: boolean) => void;
  setScreenSharing: (enabled: boolean) => void;
  setDeviceLoaded: (loaded: boolean) => void;
  initializeLocalParticipant: () => void;
  reset: () => void;
}

const initialState = {
  participants: new Map<string, MeetingParticipant>(),
  localStream: null,
  remoteStreams: [],
  isMicEnabled: false,
  isWebcamEnabled: false,
  isScreenSharing: false,
  isDeviceLoaded: false,
  peerId: "",
};

export const useMediaStore = create<MediaState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setPeerId: (id) => set({ peerId: id }),

      setParticipants: (participants) => set({ participants }),

      addParticipant: (participant) =>
        set((state) => {
          const newParticipants = new Map(state.participants);
          newParticipants.set(participant.id, participant);
          return { participants: newParticipants };
        }),

      updateParticipant: (id, updates) =>
        set((state) => {
          const newParticipants = new Map(state.participants);
          const existing = newParticipants.get(id);
          if (existing) {
            newParticipants.set(id, { ...existing, ...updates });
          }
          return { participants: newParticipants };
        }),

      updateParticipantStream: (id, track, isScreenShare = false) =>
        set((state) => {
          const newParticipants = new Map(state.participants);
          const { peerId } = state;

          let participant = newParticipants.get(id);
          if (!participant) {
            participant = {
              id,
              name: id === peerId ? "You" : `Guest-${id.slice(0, 5)}`,
              stream: new MediaStream(),
              isLocal: id === peerId,
              isScreenShare: false,
              isMuted: false,
              isVideoOff: false,
              isHost: false,
            };
          } else {
            // Clone participant to trigger React re-render
            participant = { ...participant };
          }

          // Get existing tracks (excluding old track of same kind)
          const existingTracks =
            participant.stream
              ?.getTracks()
              .filter((t) => t.kind !== track.kind) ?? [];

          // Create a NEW MediaStream with all tracks (so React detects the change)
          participant.stream = new MediaStream([...existingTracks, track]);

          if (track.kind === "video" && !isScreenShare) {
            participant.isVideoOff = false;
          }

          if (isScreenShare) {
            participant.isScreenShare = true;
          }

          newParticipants.set(id, participant);
          return { participants: newParticipants };
        }),

      removeParticipant: (id) =>
        set((state) => {
          const newParticipants = new Map(state.participants);
          newParticipants.delete(id);
          return { participants: newParticipants };
        }),

      removeTrackFromParticipant: (producerId) =>
        set((state) => {
          const newParticipants = new Map(state.participants);

          for (const [pid, p] of newParticipants.entries()) {
            if (!p.stream) continue;

            const track = p.stream.getTracks().find((t) => t.id === producerId);
            if (track) {
              const newParticipant = { ...p };
              newParticipant.stream?.removeTrack(track);

              if (track.kind === "video") {
                newParticipant.isVideoOff = true;
              }

              if (
                newParticipant.stream?.getTracks().length === 0 &&
                !newParticipant.isLocal
              ) {
                newParticipants.delete(pid);
              } else {
                newParticipants.set(pid, newParticipant);
              }
              break;
            }
          }

          return { participants: newParticipants };
        }),

      setLocalStream: (stream) => set({ localStream: stream }),

      addRemoteStream: (stream) =>
        set((state) => ({
          remoteStreams: [...state.remoteStreams, stream],
        })),

      setMicEnabled: (enabled) => set({ isMicEnabled: enabled }),

      setWebcamEnabled: (enabled) => set({ isWebcamEnabled: enabled }),

      setScreenSharing: (enabled) => set({ isScreenSharing: enabled }),

      setDeviceLoaded: (loaded) => set({ isDeviceLoaded: loaded }),

      initializeLocalParticipant: () =>
        set((state) => {
          const { peerId, participants } = state;
          if (!peerId || participants.has(peerId)) return state;

          const newParticipants = new Map(participants);
          newParticipants.set(peerId, {
            id: peerId,
            name: "You",
            stream: new MediaStream(),
            isLocal: true,
            isScreenShare: false,
            isMuted: true,
            isVideoOff: true,
            isHost: true,
          });
          return { participants: newParticipants };
        }),

      reset: () => set(initialState),
    }),
    { name: "media-store" }
  )
);
