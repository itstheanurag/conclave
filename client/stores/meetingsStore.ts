import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { MeetingDetails, MeetingSummary } from "@/types";

interface MeetingsState {
  // State
  meetings: MeetingSummary[];
  currentMeetingId: string | null;
  meetingDetails: MeetingDetails | null;
  username: string;
  loading: boolean;

  // Actions
  setMeetings: (meetings: MeetingSummary[]) => void;
  setCurrentMeetingId: (id: string | null) => void;
  setMeetingDetails: (details: MeetingDetails | null) => void;
  setUsername: (username: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useMeetingsStore = create<MeetingsState>()(
  devtools(
    (set) => ({
      meetings: [],
      currentMeetingId: null,
      meetingDetails: null,
      username: "",
      loading: false,

      setMeetings: (meetings) => set({ meetings }),
      setCurrentMeetingId: (id) => set({ currentMeetingId: id }),
      setMeetingDetails: (details) => set({ meetingDetails: details }),
      setUsername: (username) => set({ username }),
      setLoading: (loading) => set({ loading }),
    }),
    { name: "meetings-store" }
  )
);
