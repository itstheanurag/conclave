export type ApiKey = {
  id: string;
  name: string;
  key: string | null;
  project?: { id: string; name: string } | null;
  createdAt: string;
  lastUsedAt?: string | null;
  usageCount?: number;
  revoked?: boolean;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  status: "ongoing" | "planned" | "completed" | "archived";
  progress: number; // 0 - 100
  dueDate?: string | null;
  teamMembers?: {
    id: string;
    name: string;
  }[];
  meetingsCount?: number;
  lastUpdated?: string | null;
  priority?: "low" | "medium" | "high";
};
