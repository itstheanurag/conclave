"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: string;
  redirectIfUnauthenticated?: string;
}

export default function ProtectedRoute({
  children,
  redirectIfAuthenticated,
  redirectIfUnauthenticated,
}: ProtectedRouteProps) {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (session && redirectIfAuthenticated) {
      router.replace(redirectIfAuthenticated);
    } else if (!session && redirectIfUnauthenticated) {
      router.replace(redirectIfUnauthenticated);
    }
  }, [
    session,
    loading,
    router,
    redirectIfAuthenticated,
    redirectIfUnauthenticated,
  ]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (
    (session && !redirectIfAuthenticated) ||
    (!session && !redirectIfUnauthenticated)
  ) {
    return <>{children}</>;
  }

  return null;
}
