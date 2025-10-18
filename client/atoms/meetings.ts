import { MeetingDetails, MeetingSummary, Participant } from "@/types";
import { atom } from "jotai";

export const meetingsAtom = atom<MeetingSummary[]>([]);

export const currentMeetingAtom = atom<string | null>(null);

export const usernameAtom = atom<string>("");
export const participantsAtom = atom<Participant[]>([]);


export const meetingDetailsAtom = atom<MeetingDetails | null>(null);
