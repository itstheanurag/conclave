import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UIState {
  // State
  menuOpen: boolean;
  currentTheme: string;

  // Actions
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
  setCurrentTheme: (theme: string) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        menuOpen: false,
        currentTheme: "dark",

        setMenuOpen: (open) => set({ menuOpen: open }),

        toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })),

        setCurrentTheme: (theme) => set({ currentTheme: theme }),
      }),
      { name: "ui-storage" }
    ),
    { name: "ui-store" }
  )
);
