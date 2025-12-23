"use client";

import { useRouter } from "next/navigation";
import { registerWithGoogle } from "@/actions";
import { useAuthStore } from "@/stores/authStore";

export function GoogleSignUpButton() {
  const { loadingSignUp, setLoadingSignUp } = useAuthStore();
  const router = useRouter();

  const handleClick = async () => {
    setLoadingSignUp(true);
    const data = await registerWithGoogle();

    if (data) {
      console.log(data);
      router.push("/dashboard");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loadingSignUp}
      className="btn btn-outline w-full"
    >
      {loadingSignUp ? "Signing up..." : "Sign up with Google"}
    </button>
  );
}
