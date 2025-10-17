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
