"use client";

import { useAtom } from "jotai";
import { authModeAtom } from "@/atoms/auth";
import SignupForm from "@/components/auth/signup";
import LoginForm from "@/components/auth/signin";
// import ProtectedRoute from "@/components/routes";
// import { useSessionContext } from "@/providers/sesssion";
// import { useRouter } from "next/navigation";

export default function AuthPage() {
  // const { session } = useSessionContext();

  // const router = useRouter();

  // if (session) {
  //   router.replace("/dashboard");
  // }

  const [authMode] = useAtom(authModeAtom);

  return (
    <div className="flex justify-center items-center ">
      {authMode === "login" ? <LoginForm /> : <SignupForm />}
    </div>
  );
}
