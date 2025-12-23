"use client";

import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/actions";
import { useAuthStore } from "@/stores/authStore";

export function GoogleSignInButton() {
  const { loadingSignIn, setLoadingSignIn } = useAuthStore();
  const router = useRouter();

  const handleClick = async () => {
    setLoadingSignIn(true);
    try {
      const data = await signInWithGoogle();

      if (data) {
        router.push("/dashboard");
      }
    } finally {
      setLoadingSignIn(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loadingSignIn}
      className="btn btn-outline w-full"
    >
      {loadingSignIn ? "Signing in..." : "Sign in with Google"}
    </button>
  );
}
