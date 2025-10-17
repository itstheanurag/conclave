import { SessionData } from "@/types/session";
import { atom } from "jotai";

export const sessionAtom = atom<SessionData | null>(null);
export const isAuthenticatedAtom = atom((get) => !!get(sessionAtom));
export const sessionLoadingAtom = atom<boolean>(false);
export const sessionErrorAtom = atom<Error | null>(null);
