import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ModalState {
  // State
  createMeetingOpen: boolean;
  themeModalOpen: boolean;

  // Actions
  openCreateMeeting: () => void;
  closeCreateMeeting: () => void;
  openThemeModal: () => void;
  closeThemeModal: () => void;
  closeAll: () => void;
}

export const useModalStore = create<ModalState>()(
  devtools(
    (set) => ({
      createMeetingOpen: false,
      themeModalOpen: false,

      openCreateMeeting: () => set({ createMeetingOpen: true }),
      closeCreateMeeting: () => set({ createMeetingOpen: false }),

      openThemeModal: () => set({ themeModalOpen: true }),
      closeThemeModal: () => set({ themeModalOpen: false }),

      closeAll: () =>
        set({
          createMeetingOpen: false,
          themeModalOpen: false,
        }),
    }),
    { name: "modal-store" }
  )
);
