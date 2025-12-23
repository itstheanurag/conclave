export type MeetingSummary = {
  id: string;
  title?: string;
  createdAt?: string;
  project?: { id: string; name: string } | null;
  participantsCount?: number;
  active?: boolean;
};

export type Message = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

export type Recording = {
  id: string;
  title: string; // Display title for the recording (e.g., "Weekly Sync Meeting")
  url?: string; // Optional — if available for download/playback
  createdAt: string; // ISO date string
  duration: string; // Human-readable duration (e.g., "45m" or "1h 12m")
  size?: number; // Optional — file size in MB
  durationSeconds?: number; // Optional — raw seconds
};

export type Participant = {
  id: string;
  name: string;
  role?: string;
  joinedAt?: string;
};

export type MeetingDetails = {
  id: string;
  title?: string;
  createdAt?: string;
  project?: { id: string; name: string } | null;
  participants?: Participant[];
  messages?: Message[];
  transcript?: {
    id: string;
    text: string;
    language?: string;
    createdAt: string;
  } | null;
  recordings?: Recording[];
  meta?: Record<string, any>;
};
