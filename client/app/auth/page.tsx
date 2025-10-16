"use client";

import { useAtom } from "jotai";
import { authModeAtom } from "@/atoms/auth";
import SignupForm from "@/components/auth/signup";
import LoginForm from "@/components/auth/signin";

export default function AuthPage() {
  const [authMode] = useAtom(authModeAtom);

  return (
    <div className="flex justify-center items-center ">
      {authMode === "login" ? <LoginForm /> : <SignupForm />}
    </div>
  );
}
