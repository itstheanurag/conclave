import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  isMe: boolean;
  time: string;
}

interface CallState {
  // State
  roomId: string | null;
  userId: string;
  messages: ChatMessage[];
  showChat: boolean;
  showParticipants: boolean;
  currentMessage: string;

  // Actions
  setRoomId: (id: string | null) => void;
  setUserId: (id: string) => void;
  addMessage: (msg: ChatMessage) => void;
  setCurrentMessage: (msg: string) => void;
  toggleChat: () => void;
  toggleParticipants: () => void;
  closeChat: () => void;
  closeParticipants: () => void;
  reset: () => void;
}

const initialState = {
  roomId: null,
  userId: "",
  messages: [],
  showChat: false,
  showParticipants: false,
  currentMessage: "",
};

export const useCallStore = create<CallState>()(
  devtools(
    (set) => ({
      ...initialState,

      setRoomId: (id) => set({ roomId: id }),

      setUserId: (id) => set({ userId: id }),

      addMessage: (msg) =>
        set((state) => ({
          messages: [...state.messages, msg],
        })),

      setCurrentMessage: (msg) => set({ currentMessage: msg }),

      toggleChat: () =>
        set((state) => ({
          showChat: !state.showChat,
          showParticipants: state.showChat ? state.showParticipants : false,
        })),

      toggleParticipants: () =>
        set((state) => ({
          showParticipants: !state.showParticipants,
          showChat: state.showParticipants ? state.showChat : false,
        })),

      closeChat: () => set({ showChat: false }),

      closeParticipants: () => set({ showParticipants: false }),

      reset: () => set(initialState),
    }),
    { name: "call-store" }
  )
);
