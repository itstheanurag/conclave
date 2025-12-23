"use client";

import SignupForm from "@/components/auth/signup";
import LoginForm from "@/components/auth/signin";
import { useAuthStore } from "@/stores/authStore";

export default function AuthPage() {
  const { authMode } = useAuthStore();

  return (
    <div className="flex justify-center items-center ">
      {authMode === "login" ? <LoginForm /> : <SignupForm />}
    </div>
  );
}
