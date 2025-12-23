"use client";
import { client } from "@/lib/auth-client";
import { toastError, toastLoading, toastSuccess } from "@/lib/toast";
import { useAuthStore } from "@/stores/authStore";

// ─────────────────────────────
// Helpers
// ─────────────────────────────
function handleRememberMe(email: string, rememberMe: boolean) {
  if (rememberMe) {
    localStorage.setItem("rememberedEmail", email);
  } else {
    localStorage.removeItem("rememberedEmail");
  }
}

function clearAuthForm() {
  const { formData, resetFormData, updateFormData } = useAuthStore.getState();
  const { rememberMe } = formData;
  resetFormData();
  updateFormData({ rememberMe });
}

// ─────────────────────────────
// SIGN UP
// ─────────────────────────────
export async function handleEmailSignup() {
  const { formData, setLoadingSignUp } = useAuthStore.getState();
  const { fullName, email, password, rememberMe } = formData;

  const t = toastLoading("Creating account...");
  setLoadingSignUp(true);

  try {
    const result = await client.signUp.email({
      name: fullName,
      email,
      password,
    });

    if (result.error) {
      toastError(result.error.statusText || "Signup failed.", t);
      return;
    }

    toastSuccess("Account created successfully!", t);
    handleRememberMe(email, rememberMe);
    clearAuthForm();
    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Signup failed.";
    toastError(message, t);
    return null;
  } finally {
    setLoadingSignUp(false);
  }
}

// ─────────────────────────────
// LOGIN
// ─────────────────────────────
export async function handleEmailLogin() {
  const { formData, setLoadingSignIn } = useAuthStore.getState();
  const { email, password, rememberMe } = formData;

  const t = toastLoading("Signing in...");
  setLoadingSignIn(true);

  try {
    const result = await client.signIn.email({
      email,
      password,
    });

    if (result.error) {
      toastError(result.error.statusText || "Failed to sign in.", t);
      return null;
    }

    toastSuccess("Signed in successfully!", t);
    handleRememberMe(email, rememberMe);

    clearAuthForm();
    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to sign in.";
    toastError(message, t);
    return null;
  } finally {
    setLoadingSignIn(false);
  }
}

// ─────────────────────────────
// SOCIAL SIGN-IN / REGISTER
// ─────────────────────────────
export async function handleSocialAuth({
  provider,
  mode,
  loadingMessage,
  successMessage,
  errorMessage,
  callbackURL,
}: {
  provider: "google" | "github";
  mode: "signin" | "register";
  loadingMessage: string;
  successMessage: string;
  errorMessage: string;
  callbackURL: string;
}) {
  const { formData, setLoadingSignIn, setLoadingSignUp } =
    useAuthStore.getState();
  const { email, rememberMe } = formData;

  const t = toastLoading(loadingMessage);
  const setLoading = mode === "signin" ? setLoadingSignIn : setLoadingSignUp;

  setLoading(true);

  try {
    const result = await client.signIn.social({
      provider,
      callbackURL,
    });

    if (result?.error) {
      toastError(result.error.statusText || errorMessage, t);
      return null;
    }

    toastSuccess(successMessage, t);
    handleRememberMe(email, rememberMe);
    clearAuthForm();
    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : errorMessage;
    toastError(message, t);
    return null;
  } finally {
    setLoading(false);
  }
}

// ─────────────────────────────
// PUBLIC SOCIAL AUTH ACTIONS
// ─────────────────────────────
export async function signInWithGithub() {
  return await handleSocialAuth({
    provider: "github",
    mode: "signin",
    callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    loadingMessage: "Signing in with GitHub...",
    successMessage: "Signed in successfully!",
    errorMessage: "GitHub sign-in failed.",
  });
}

export async function signInWithGoogle() {
  return await handleSocialAuth({
    provider: "google",
    mode: "signin",
    callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    loadingMessage: "Signing in with Google...",
    successMessage: "Signed in successfully!",
    errorMessage: "Google sign-in failed.",
  });
}

export async function registerWithGoogle() {
  return await handleSocialAuth({
    provider: "google",
    mode: "register",
    callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    loadingMessage: "Registering with Google...",
    successMessage: "Registered successfully!",
    errorMessage: "Google registration failed.",
  });
}

export async function registerWithGithub() {
  return await handleSocialAuth({
    provider: "github",
    mode: "register",
    callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    loadingMessage: "Registering with GitHub...",
    successMessage: "Registered successfully!",
    errorMessage: "GitHub registration failed.",
  });
}

// ─────────────────────────────
// LOGOUT
// ─────────────────────────────
export async function logout() {
  try {
    const result = await client.signOut();
    const { setAuthMode } = useAuthStore.getState();
    setAuthMode("login");
    clearAuthForm();
    return result;
  } catch (err) {
    console.error("Logout failed", err);
    throw err;
  }
}
