"use client";
import { useAtom } from "jotai";
import { authModeAtom } from "@/atoms/auth";
import SignupForm from "./forms/signup";
import LoginForm from "./forms/signin";
export default function AuthPage() {
  const [authMode] = useAtom(authModeAtom);

  return (
    <div className="flex justify-center items-center ">
      {authMode === "login" ? <LoginForm /> : <SignupForm />}
    </div>
  );
}
