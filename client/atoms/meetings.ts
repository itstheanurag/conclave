import { atom } from "jotai";

export const meetingsAtom = atom<string[]>([]);
export const currentMeetingAtom = atom<string | null>(null);
export const usernameAtom = atom<string>("");

export const participantsAtom = atom<string[]>([]);
