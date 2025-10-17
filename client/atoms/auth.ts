"use client";

import { atom } from "jotai";

export const fullNameAtom = atom("");
export const emailAtom = atom("");
export const passwordAtom = atom("");
export const confirmPasswordAtom = atom("");

export const authModeAtom = atom<"login" | "register">("login");

export const userAtom = atom<{
  id: string;
  email: string;
  name: string;
} | null>(null);

export const rememberMeAtom = atom(false);

export const loadingAtom = atom(false);

export const passwordsMatchAtom = atom(
  (get) => get(passwordAtom) === get(confirmPasswordAtom)
);

export const loginAtom = atom(
  (get) => ({
    email: get(emailAtom),
    password: get(passwordAtom),
  }),
  (get, set, update: { email?: string; password?: string }) => {
    if (update.email !== undefined) set(emailAtom, update.email);
    if (update.password !== undefined) set(passwordAtom, update.password);
  }
);

export const isRegisterFormValidAtom = atom((get) => {
  const name = get(fullNameAtom);
  const email = get(emailAtom);
  const pass = get(passwordAtom);
  const confirm = get(confirmPasswordAtom);

  return (
    name.trim() !== "" &&
    email.trim() !== "" &&
    pass.length >= 8 &&
    confirm === pass
  );
});

// Derived atom for login form validity
export const isLoginFormValidAtom = atom((get) => {
  const email = get(emailAtom);
  const pass = get(passwordAtom);
  return email.trim() !== "" && pass.trim() !== "";
});
