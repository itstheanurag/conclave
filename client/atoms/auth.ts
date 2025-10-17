"use client";

import { atom } from "jotai";

const EMAIL_VALIDATION_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const authFormAtom = atom({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  rememberMe: false,
  showPassword: false,
});

export const authModeAtom = atom<"login" | "register">("login");
export const loadingSignUpFormAtom = atom(false);
export const loadingSignInFormAtom = atom(false);

// Derived atoms
export const isRegisterFormValidAtom = atom((get) => {
  const { fullName, email, password, confirmPassword } = get(authFormAtom);
  return (
    fullName.trim() !== "" &&
    EMAIL_VALIDATION_REGEX.test(email) &&
    password.length >= 8 &&
    confirmPassword === password
  );
});

export const isLoginFormValidAtom = atom((get) => {
  const { email, password } = get(authFormAtom);

  // Basic email pattern check

  return (
    EMAIL_VALIDATION_REGEX.test(email) &&
    password.trim() !== "" &&
    password.length >= 8
  );
});
