import { MeetingSummary, MeetingDetails } from "@/types";

export const initialParticipants = [
  {
    id: 1,
    name: "You",
    isMuted: false,
    isVideoOff: false,
    isHost: true,
    isSpeaking: false,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    isMuted: false,
    isVideoOff: true,
    isHost: false,
    isSpeaking: true,
  },
  {
    id: 3,
    name: "Mike Chen",
    isMuted: true,
    isVideoOff: false,
    isHost: false,
    isSpeaking: false,
  },
  {
    id: 4,
    name: "Emily Davis",
    isMuted: false,
    isVideoOff: true,
    isHost: false,
    isSpeaking: false,
  },
  {
    id: 5,
    name: "James Wilson",
    isMuted: false,
    isVideoOff: true,
    isHost: false,
    isSpeaking: false,
  },
];

export const initialMessages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    text: "Hey everyone! Can you hear me?",
    time: "10:23 AM",
    isMe: false,
  },
  {
    id: 2,
    sender: "You",
    text: "Yes, loud and clear!",
    time: "10:23 AM",
    isMe: true,
  },
  {
    id: 3,
    sender: "Mike Chen",
    text: "Ready to start when you are",
    time: "10:24 AM",
    isMe: false,
  },
];

export const mockMeetings: MeetingSummary[] = [
  {
    id: "m1",
    title: "Weekly Sync",
    createdAt: "2025-10-10T09:00:00Z",
    project: { id: "p1", name: "Team Alpha" },
    participantsCount: 5,
    active: true,
  },
  {
    id: "m2",
    title: "Design Review",
    createdAt: "2025-10-12T11:30:00Z",
    project: { id: "p2", name: "UI/UX Revamp" },
    participantsCount: 3,
    active: false,
  },
  {
    id: "m3",
    title: "Client Presentation",
    createdAt: "2025-10-14T15:00:00Z",
    project: { id: "p3", name: "Acme Corp" },
    participantsCount: 6,
    active: false,
  },
];

export const mockMeetingDetails: Record<string, MeetingDetails> = {
  m1: {
    id: "m1",
    title: "Weekly Sync",
    createdAt: "2025-10-10T09:00:00Z",
    project: { id: "p1", name: "Team Alpha" },
    participants: [
      {
        id: "u1",
        name: "Gaurav Kumar",
        role: "Host",
        joinedAt: "2025-10-10T09:01:00Z",
      },
      { id: "u2", name: "Komal Singh", role: "Participant" },
      { id: "u3", name: "Arjun Mehta", role: "Participant" },
      { id: "u4", name: "Nina Patel", role: "Note Taker" },
      { id: "u5", name: "Ravi Sharma", role: "Observer" },
    ],
    messages: [
      {
        id: "msg1",
        author: "Gaurav Kumar",
        text: "Let's start with the project updates.",
        createdAt: "2025-10-10T09:05:00Z",
      },
      {
        id: "msg2",
        author: "Komal Singh",
        text: "UI improvements are complete.",
        createdAt: "2025-10-10T09:07:00Z",
      },
    ],
    transcript: {
      id: "t1",
      text: "Meeting started with project updates. Discussion focused on UI enhancements and deployment timelines.",
      language: "en",
      createdAt: "2025-10-10T10:00:00Z",
    },
    recordings: [
      {
        id: "r1",
        title: "Weekly Sync Recording",
        url: "https://example.com/recordings/weekly-sync.mp4",
        createdAt: "2025-10-10T10:00:00Z",
        duration: "48m",
        durationSeconds: 2880,
        size: 350,
      },
    ],
    meta: { notes: "Follow up with QA team next week." },
  },

  m2: {
    id: "m2",
    title: "Design Review",
    createdAt: "2025-10-12T11:30:00Z",
    project: { id: "p2", name: "UI/UX Revamp" },
    participants: [
      { id: "u1", name: "Komal Singh", role: "Host" },
      { id: "u2", name: "Ravi Sharma", role: "Designer" },
      { id: "u3", name: "Gaurav Kumar", role: "Reviewer" },
    ],
    messages: [
      {
        id: "msg3",
        author: "Komal Singh",
        text: "Please check the new color palette proposal.",
        createdAt: "2025-10-12T11:35:00Z",
      },
      {
        id: "msg4",
        author: "Ravi Sharma",
        text: "It looks better than the old one. More accessible.",
        createdAt: "2025-10-12T11:40:00Z",
      },
    ],
    transcript: {
      id: "t2",
      text: "Design feedback meeting. Discussed color contrast and component spacing.",
      language: "en",
      createdAt: "2025-10-12T12:00:00Z",
    },
    recordings: [
      {
        id: "r2",
        title: "Design Review Recording",
        url: "https://example.com/recordings/design-review.mp4",
        createdAt: "2025-10-12T12:00:00Z",
        duration: "32m",
        size: 240,
      },
    ],
  },
};
