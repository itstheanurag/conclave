"use client";

import { useEffect } from "react";
import { Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { SessionData } from "@/types/session";
import { ApiKeyCreateModal } from "@/components/modals/CreateApiKeyModal";
import { ApiKeysTable } from "./ApiKeysTable";
import { ApiKeyDetails } from "./ApiKeyDetails";
import { useApiKeyStore } from "@/stores/apiKeyStore";

interface ApiKeysTabProps {
  sessionData?: SessionData;
}

export default function ApiKeysTab({ sessionData }: ApiKeysTabProps) {
  const {
    keys,
    loading,
    selected,
    showCreateModal,
    setLoading,
    selectKey,
    openCreateModal,
    closeCreateModal,
    addKey,
    removeKey,
    loadDummyData,
  } = useApiKeyStore();

  useEffect(() => {
    loadDummyData();
  }, [loadDummyData]);

  function handleRevoke(id: string) {
    removeKey(id);
  }

  function handleCreate() {
    const newKey = {
      id: `key_${Date.now()}`,
      name: "Newly Created Key",
      key: `sk_test_${Math.random().toString(36).slice(2, 10)}`,
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
    };
    addKey(newKey);
    closeCreateModal();
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

        <Button onClick={openCreateModal}>
          <Zap className="w-4 h-4 mr-2" /> New API Key
        </Button>
      </div>

      <ApiKeysTable
        keys={keys}
        loading={loading}
        onSelect={selectKey}
        onRevoke={handleRevoke}
      />

      {showCreateModal && (
        <ApiKeyCreateModal
          onClose={closeCreateModal}
          onCreated={handleCreate}
        />
      )}

      {selected && (
        <ApiKeyDetails
          keyData={selected}
          onClose={() => selectKey(null)}
          onRevoke={handleRevoke}
        />
      )}
    </div>
  );
}
