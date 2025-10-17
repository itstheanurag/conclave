"use client";
import { client } from "@/lib/auth-client";
import { toastError, toastLoading, toastSuccess } from "@/lib/toast";
import {
  authFormAtom,
  authModeAtom,
  loadingSignUpFormAtom,
  loadingSignInFormAtom,
} from "@/atoms";
import { store } from "@/lib";

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
  const { rememberMe } = store.get(authFormAtom);
  store.set(authFormAtom, {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe,
    showPassword: false,
  });
}

// ─────────────────────────────
// SIGN UP
// ─────────────────────────────
export async function handleEmailSignup() {
  const { fullName, email, password, rememberMe } = store.get(authFormAtom);

  const t = toastLoading("Creating account...");
  store.set(loadingSignUpFormAtom, true);

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
  } catch (err: any) {
    toastError(err.message || "Signup failed.", t);
    return null;
  } finally {
    store.set(loadingSignUpFormAtom, false);
  }
}

// ─────────────────────────────
// LOGIN
// ─────────────────────────────
export async function handleEmailLogin() {
  const { email, password, rememberMe } = store.get(authFormAtom);

  const t = toastLoading("Signing in...");
  store.set(loadingSignInFormAtom, true);

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

    if (result?.data?.token) {
      document.cookie = `better-auth.session=${result.data.token}; path=/; Secure; SameSite=Lax`;
      localStorage.setItem("user", JSON.stringify(result.data.user));
    }

    clearAuthForm();
    return result;
  } catch (err: any) {
    toastError(err.message || "Failed to sign in.", t);
    return null;
  } finally {
    store.set(loadingSignInFormAtom, false);
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
  const { email, rememberMe } = store.get(authFormAtom);

  const t = toastLoading(loadingMessage);
  const loadingAtom =
    mode === "signin" ? loadingSignInFormAtom : loadingSignUpFormAtom;

  store.set(loadingAtom, true);

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
  } catch (err: any) {
    toastError(err.message || errorMessage, t);
    return null;
  } finally {
    store.set(loadingAtom, false);
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
    document.cookie = `better-auth.session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Lax`;
    localStorage.removeItem("user");
    store.set(authModeAtom, "login");
    clearAuthForm();
    return result;
  } catch (err) {
    console.error("Logout failed", err);
    throw err;
  }
}
