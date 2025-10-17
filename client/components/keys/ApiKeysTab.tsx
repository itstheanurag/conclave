"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { SessionData } from "@/types/session";
import { ApiKeyCreateModal } from "@/components/modals/ApiKeys";
import { ApiKey } from "@/types/dashboard";
import { ApiKeysTable } from "./ApiKeysTable";
import { ApiKeyDetails } from "./ApiKeyDetails";

interface ApiKeysTabProps {
  sessionData?: SessionData;
}

const dummyKeys: ApiKey[] = [
  {
    id: "key_1",
    name: "Frontend Service",
    key: "sk_test_frontend_12345",
    createdAt: new Date().toISOString(),
    lastUsedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
  },
  {
    id: "key_2",
    name: "Backend Worker",
    key: "sk_test_backend_67890",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    lastUsedAt: null,
  },
];

export default function ApiKeysTab({ sessionData }: ApiKeysTabProps) {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<ApiKey | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setKeys(dummyKeys);
      setLoading(false);
    }, 500);
  }, []);
  

  function handleRevoke(id: string) {
    // Simulate revoke
    setKeys((prev) => prev.filter((k) => k.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function handleCreate(newKey: ApiKey) {
    // Simulate create
    setKeys((prev) => [newKey, ...prev]);
    setShowCreate(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Keys</h2>
          <p className="text-base-content/70">
            Create and manage API keys. Keys are shown only once on creation.
          </p>
        </div>

        <Button onClick={() => setShowCreate(true)}>
          <Zap className="w-4 h-4 mr-2" /> New API Key
        </Button>
      </div>

      <ApiKeysTable
        keys={keys}
        loading={loading}
        onSelect={setSelected}
        onRevoke={handleRevoke}
      />

      {showCreate && (
        <ApiKeyCreateModal
          onClose={() => setShowCreate(false)}
          onCreated={() =>
            handleCreate({
              id: `key_${Date.now()}`,
              name: "Newly Created Key",
              key: `sk_test_${Math.random().toString(36).slice(2, 10)}`,
              createdAt: new Date().toISOString(),
              lastUsedAt: null,
            })
          }
        />
      )}

      {selected && (
        <ApiKeyDetails
          keyData={selected}
          onClose={() => setSelected(null)}
          onRevoke={handleRevoke}
        />
      )}
    </div>
  );
}
