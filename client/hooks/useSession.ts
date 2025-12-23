import { useEffect, useRef } from "react";
import { client } from "@/lib/auth-client";
import { SessionData } from "@/types/session";
import { useAuthStore } from "@/stores/authStore";

export function useSession() {
  const {
    session,
    sessionLoading: loading,
    sessionError: error,
    setSession,
    setSessionLoading,
    setSessionError,
  } = useAuthStore();

  const fetchInitiated = useRef(false);

  useEffect(() => {
    if (fetchInitiated.current) {
      return;
    }
    fetchInitiated.current = true;

    let isMounted = true;

    async function fetchSession() {
      setSessionLoading(true);
      try {
        const result = await client.getSession();
        if (!isMounted) return;

        const sessionData = (result?.data as SessionData) ?? null;

        if (
          !sessionData ||
          (sessionData.session &&
            new Date(sessionData.session.expiresAt) <= new Date())
        ) {
          setSession(null);
          return;
        }

        setSession(sessionData);
      } catch (err: unknown) {
        if (isMounted) setSessionError(err as Error);
      } finally {
        if (isMounted) setSessionLoading(false);
      }
    }

    fetchSession();

    return () => {
      isMounted = false;
    };
  }, [setSession, setSessionLoading, setSessionError]);

  return { session, loading, error };
}
