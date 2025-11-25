import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { client } from "@/lib/auth-client";
import {
  sessionAtom,
  sessionLoadingAtom,
  sessionErrorAtom,
} from "@/atoms/session";
import { SessionData } from "@/types/session";

export function useSession() {
  const [session, setSession] = useAtom(sessionAtom);
  const [loading, setLoading] = useAtom(sessionLoadingAtom);
  const [error, setError] = useAtom(sessionErrorAtom);
  const fetchInitiated = useRef(false);

  useEffect(() => {
    if (fetchInitiated.current) {
      return;
    }
    fetchInitiated.current = true;

    let isMounted = true;

    async function fetchSession() {
      setLoading(true);
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
      } catch (err: any) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSession();

    return () => {
      isMounted = false;
    };
  }, []);

  return { session, loading, error };
}
