import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type TabId =
  | "overview"
  | "meetings"
  | "apikeys"
  | "projects"
  | "settings"
  | "schedule"
  | "teams"
  | "discussions"
  | "analytics";

interface DashboardState {
  // State
  activeTab: TabId;
  sidebarCollapsed: boolean;

  // Actions
  setActiveTab: (tab: TabId) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    persist(
      (set) => ({
        activeTab: "overview",
        sidebarCollapsed: false,

        setActiveTab: (tab) => set({ activeTab: tab }),

        toggleSidebar: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

        setSidebarCollapsed: (collapsed) =>
          set({ sidebarCollapsed: collapsed }),
      }),
      { name: "dashboard-storage" }
    ),
    { name: "dashboard-store" }
  )
);
