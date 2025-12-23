import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Project } from "@/types/dashboard";

// Re-export for convenience
export type { Project } from "@/types/dashboard";

type FilterType = "all" | "ongoing" | "behind" | "dueSoon" | "completed";

// Dummy data for initial load
const dummyProjects: Project[] = [
  {
    id: "p1",
    name: "Next.js Dashboard",
    status: "ongoing",
    progress: 65,
    dueDate: "2025-10-25",
    teamMembers: [
      { id: "u1", name: "Komal" },
      { id: "u2", name: "Gaurav" },
    ],
    meetingsCount: 4,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "API Gateway",
    status: "completed",
    progress: 100,
    dueDate: "2025-09-15",
    teamMembers: [{ id: "u3", name: "Raj" }],
    meetingsCount: 2,
    lastUpdated: new Date().toISOString(),
  },
];

interface ProjectState {
  // State
  projects: Project[];
  loading: boolean;
  filter: FilterType;
  selected: Project | null;
  showCreateModal: boolean;
  createFormName: string;

  // Actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setFilter: (filter: FilterType) => void;
  selectProject: (project: Project | null) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  setCreateFormName: (name: string) => void;
  loadDummyData: () => void;

  // Computed (as getter)
  getFilteredProjects: () => Project[];
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set, get) => ({
      projects: [],
      loading: false,
      filter: "all",
      selected: null,
      showCreateModal: false,
      createFormName: "",

      setProjects: (projects) => set({ projects }),

      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          selected: state.selected?.id === id ? null : state.selected,
        })),

      setLoading: (loading) => set({ loading }),

      setFilter: (filter) => set({ filter }),

      selectProject: (project) => set({ selected: project }),

      openCreateModal: () => set({ showCreateModal: true }),

      closeCreateModal: () =>
        set({ showCreateModal: false, createFormName: "" }),

      setCreateFormName: (name) => set({ createFormName: name }),

      loadDummyData: () => {
        set({ loading: true });
        setTimeout(() => {
          set({ projects: dummyProjects, loading: false });
        }, 300);
      },

      getFilteredProjects: () => {
        const { projects, filter } = get();
        switch (filter) {
          case "ongoing":
            return projects.filter((p) => p.status === "ongoing");
          case "completed":
            return projects.filter((p) => p.status === "completed");
          case "behind":
            return projects.filter((p) => p.status === "archived");
          default:
            return projects;
        }
      },
    }),
    { name: "project-store" }
  )
);
