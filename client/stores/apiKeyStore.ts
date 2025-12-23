import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ApiKey } from "@/types/dashboard";

// Re-export for convenience
export type { ApiKey } from "@/types/dashboard";

interface ApiKeyFormData {
  name: string;
  projectId: string;
}

// Dummy data for initial load
const dummyKeys: ApiKey[] = [
  {
    id: "key_1",
    name: "Frontend Service",
    key: "sk_test_frontend_12345",
    createdAt: new Date().toISOString(),
    lastUsedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "key_2",
    name: "Backend Worker",
    key: "sk_test_backend_67890",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    lastUsedAt: null,
  },
];

interface ApiKeyState {
  // State
  keys: ApiKey[];
  loading: boolean;
  selected: ApiKey | null;
  showCreateModal: boolean;
  formData: ApiKeyFormData;
  createdKey: string | null;

  // Actions
  setKeys: (keys: ApiKey[]) => void;
  addKey: (key: ApiKey) => void;
  removeKey: (id: string) => void;
  setLoading: (loading: boolean) => void;
  selectKey: (key: ApiKey | null) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  updateFormData: (data: Partial<ApiKeyFormData>) => void;
  resetFormData: () => void;
  setCreatedKey: (key: string | null) => void;
  loadDummyData: () => void;
}

const initialFormData: ApiKeyFormData = {
  name: "",
  projectId: "",
};

export const useApiKeyStore = create<ApiKeyState>()(
  devtools(
    (set) => ({
      keys: [],
      loading: false,
      selected: null,
      showCreateModal: false,
      formData: initialFormData,
      createdKey: null,

      setKeys: (keys) => set({ keys }),

      addKey: (key) => set((state) => ({ keys: [key, ...state.keys] })),

      removeKey: (id) =>
        set((state) => ({
          keys: state.keys.filter((k) => k.id !== id),
          selected: state.selected?.id === id ? null : state.selected,
        })),

      setLoading: (loading) => set({ loading }),

      selectKey: (key) => set({ selected: key }),

      openCreateModal: () => set({ showCreateModal: true }),

      closeCreateModal: () =>
        set({
          showCreateModal: false,
          formData: initialFormData,
          createdKey: null,
        }),

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      resetFormData: () => set({ formData: initialFormData }),

      setCreatedKey: (key) => set({ createdKey: key }),

      loadDummyData: () => {
        set({ loading: true });
        setTimeout(() => {
          set({ keys: dummyKeys, loading: false });
        }, 500);
      },
    }),
    { name: "api-key-store" }
  )
);
