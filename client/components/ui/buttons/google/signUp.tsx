"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { loadingAtom } from "@/atoms";
import { registerWithGoogle } from "@/actions";

export function GoogleSignUpButton() {
  const [loading, setLoading] = useAtom(loadingAtom);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    const data = await registerWithGoogle();

    if (data) {
      console.log(data);
      router.push("/dashboard");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="btn btn-outline w-full"
    >
      {loading ? "Signing up..." : "Sign up with Google"}
    </button>
  );
}
