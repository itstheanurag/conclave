"use client";

import {
  fullNameAtom,
  emailAtom,
  passwordAtom,
  confirmPasswordAtom,
  rememberMeAtom,
  loadingAtom,
  loginAtom,
} from "@/atoms";
import { client } from "@/lib/auth-client";
import { toastError, toastLoading, toastSuccess } from "@/lib/toast";
import { getDefaultStore } from "jotai";

// ─────────────────────────────
// Store (for accessing jotai atoms outside React)
// ─────────────────────────────
const store = getDefaultStore();

// ─────────────────────────────
// LOGIN / REGISTER UPDATERS
// ─────────────────────────────
export const updateLogin = (update: { email?: string; password?: string }) => {
  if (update.email !== undefined) store.set(emailAtom, update.email);
  if (update.password !== undefined) store.set(passwordAtom, update.password);
};

export const updateRegister = (update: {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}) => {
  if (update.fullName !== undefined) store.set(fullNameAtom, update.fullName);
  if (update.email !== undefined) store.set(emailAtom, update.email);
  if (update.password !== undefined) store.set(passwordAtom, update.password);
  if (update.confirmPassword !== undefined)
    store.set(confirmPasswordAtom, update.confirmPassword);
};

// ─────────────────────────────
// AUTH ACTIONS
// ─────────────────────────────

// helper for rememberMe and email persistence
function handleRememberMe(email: string, rememberMe: boolean) {
  if (rememberMe) {
    localStorage.setItem("rememberedEmail", email);
  } else {
    localStorage.removeItem("rememberedEmail");
  }
}

export async function handleEmailSignup() {
  const fullName = store.get(fullNameAtom);
  const email = store.get(emailAtom);
  const password = store.get(passwordAtom);
  const rememberMe = store.get(rememberMeAtom);

  const t = toastLoading("Creating account...");
  store.set(loadingAtom, true);

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

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    return result;
  } catch (err: any) {
    toastError(err.message || "Signup failed.", t);
    return null;
  } finally {
    store.set(loadingAtom, false);
  }
}

export async function handleEmailLogin() {
  const login = store.get(loginAtom);
  const rememberMe = store.get(rememberMeAtom);

  const t = toastLoading("Signing in...");
  store.set(loadingAtom, true);

  try {
    const result = await client.signIn.email({
      email: login.email,
      password: login.password,
    });

    if (result.error) {
      toastError(result.error.statusText || "Failed to sign in.", t);
      return null;
    }

    toastSuccess("Signed in successfully!", t);

    // Remember email if checkbox checked
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", login.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    return result;
  } catch (err: any) {
    toastError(err.message || "Failed to sign in.", t);

    return null;
  } finally {
    store.set(loadingAtom, false);
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
  const email = store.get(emailAtom);
  const rememberMe = store.get(rememberMeAtom);

  const t = toastLoading(loadingMessage);
  store.set(loadingAtom, true);

  try {
    const result = await client.signIn.social({
      provider,
      //   callbackURL,
    });

    if (result?.error) {
      toastError(result.error.statusText || errorMessage, t);
      return null;
    }

    toastSuccess(successMessage, t);
    handleRememberMe(email, rememberMe);
    return result;
  } catch (err: any) {
    toastError(err.message || errorMessage, t);
    return null;
  } finally {
    store.set(loadingAtom, false);
  }
}
// ────────────────
// PUBLIC ACTIONS
// ────────────────

export async function signInWithGithub() {
  return handleSocialAuth({
    provider: "github",
    mode: "signin",
    callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    loadingMessage: "Signing in with GitHub...",
    successMessage: "Signed in successfully!",
    errorMessage: "GitHub sign-in failed.",
  });
}

export async function signInWithGoogle() {
  return handleSocialAuth({
    provider: "google",
    mode: "signin",
    callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    loadingMessage: "Signing in with Google...",
    successMessage: "Signed in successfully!",
    errorMessage: "Google sign-in failed.",
  });
}

export async function registerWithGoogle() {
  return handleSocialAuth({
    provider: "google",
    mode: "register",
    callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    loadingMessage: "Registering with Google...",
    successMessage: "Registered successfully!",
    errorMessage: "Google registration failed.",
  });
}

export async function registerWithGithub() {
  return handleSocialAuth({
    provider: "github",
    mode: "register",
    callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    loadingMessage: "Registering with GitHub...",
    successMessage: "Registered successfully!",
    errorMessage: "GitHub registration failed.",
  });
}
