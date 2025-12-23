import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { SessionData } from "@/types/session";

const EMAIL_VALIDATION_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AuthFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
  showPassword: boolean;
}

type AuthMode = "login" | "register";

interface AuthState {
  // Form state
  formData: AuthFormData;
  authMode: AuthMode;
  loadingSignUp: boolean;
  loadingSignIn: boolean;

  // Session state
  session: SessionData | null;
  sessionLoading: boolean;
  sessionError: Error | null;

  // Form actions
  updateFormData: (data: Partial<AuthFormData>) => void;
  resetFormData: () => void;
  setAuthMode: (mode: AuthMode) => void;
  toggleShowPassword: () => void;
  setLoadingSignUp: (loading: boolean) => void;
  setLoadingSignIn: (loading: boolean) => void;

  // Session actions
  setSession: (session: SessionData | null) => void;
  setSessionLoading: (loading: boolean) => void;
  setSessionError: (error: Error | null) => void;
  clearSession: () => void;

  // Computed getters
  isLoginFormValid: () => boolean;
  isRegisterFormValid: () => boolean;
  isAuthenticated: () => boolean;
}

const initialFormData: AuthFormData = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  rememberMe: false,
  showPassword: false,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      // Initial state
      formData: initialFormData,
      authMode: "login",
      loadingSignUp: false,
      loadingSignIn: false,
      session: null,
      sessionLoading: false,
      sessionError: null,

      // Form actions
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      resetFormData: () => set({ formData: initialFormData }),

      setAuthMode: (mode) => set({ authMode: mode }),

      toggleShowPassword: () =>
        set((state) => ({
          formData: {
            ...state.formData,
            showPassword: !state.formData.showPassword,
          },
        })),

      setLoadingSignUp: (loading) => set({ loadingSignUp: loading }),

      setLoadingSignIn: (loading) => set({ loadingSignIn: loading }),

      // Session actions
      setSession: (session) => set({ session }),

      setSessionLoading: (loading) => set({ sessionLoading: loading }),

      setSessionError: (error) => set({ sessionError: error }),

      clearSession: () =>
        set({
          session: null,
          sessionError: null,
        }),

      // Computed getters
      isLoginFormValid: () => {
        const { email, password } = get().formData;
        return (
          EMAIL_VALIDATION_REGEX.test(email) &&
          password.trim() !== "" &&
          password.length >= 8
        );
      },

      isRegisterFormValid: () => {
        const { fullName, email, password, confirmPassword } = get().formData;
        return (
          fullName.trim() !== "" &&
          EMAIL_VALIDATION_REGEX.test(email) &&
          password.length >= 8 &&
          confirmPassword === password
        );
      },

      isAuthenticated: () => !!get().session,
    }),
    { name: "auth-store" }
  )
);
