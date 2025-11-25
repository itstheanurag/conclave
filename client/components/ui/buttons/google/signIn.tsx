"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { loadingAtom } from "@/atoms";
import { signInWithGoogle } from "@/actions";

export function GoogleSignInButton() {
  const [loading, setLoading] = useAtom(loadingAtom);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    try {
      const data = await signInWithGoogle();

      if(data) {
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="btn btn-outline w-full"
    >
      {loading ? "Signing in..." : "Sign in with Google"}
    </button>
  );
}
