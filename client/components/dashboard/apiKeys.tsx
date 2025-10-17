"use client";

import React, { useEffect, useState } from "react";
import { Code, Database, Zap } from "lucide-react";
import Button from "../ui/Button";
import { SessionData } from "@/types/session";
import { ApiKey } from "@/types/dashboard";

interface ApiKeysTabProps {
  sessionData?: SessionData;
}

export default function ApiKeysDashboardTab({ sessionData }: ApiKeysTabProps) {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newProjectId, setNewProjectId] = useState<string | "">("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  // Details drawer/modal
  const [selected, setSelected] = useState<ApiKey | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    setLoading(true);
    try {
      // TODO: replace endpoint with your server route
      const res = await fetch("/api/api-keys");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setKeys(json as ApiKey[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!newName) return;
    try {
      // TODO: call your create API and expect the server to return the created key string once
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          projectId: newProjectId || null,
        }),
      });
      if (!res.ok) throw new Error("Create failed");
      const json: ApiKey & { revealedKey?: string } = await res.json();
      // server should send revealedKey (the actual key) one time
      setCreatedKey(json.revealedKey ?? null);
      // update list (server response should include created item without revealedKey)
      await fetchKeys();
      setNewName("");
      setNewProjectId("");
    } catch (e) {
      console.error(e);
    }
  }

  async function handleRevoke(id: string) {
    try {
      const res = await fetch(`/api/api-keys/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Revoke failed");
      await fetchKeys();
      if (selected?.id === id) setSelected(null);
    } catch (e) {
      console.error(e);
    }
  }

  function formatDate(d?: string | null) {
    if (!d) return "—";
    return new Date(d).toLocaleString();
  }

  function maskKey(k?: string | null) {
    if (!k) return "••••••••••";
    return k.length > 8 ? `${k.slice(0, 4)}••••${k.slice(-4)}` : "••••••";
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

        <div className="flex items-center gap-2">
          <Button onClick={() => setShowCreate(true)}>
            <Zap className="w-4 h-4 mr-2" /> New API Key
          </Button>
        </div>
      </div>

      <div className="card bg-base-200 shadow-sm">
        <div className="card-body p-4">
          <div className="overflow-x-auto">
            <table className="table table-compact w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Project</th>
                  <th>Usage</th>
                  <th>Created</th>
                  <th>Last used</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6">
                      Loading…
                    </td>
                  </tr>
                ) : keys.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6">
                      No API keys yet. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  keys.map((k) => (
                    <tr key={k.id} className={k.revoked ? "opacity-60" : ""}>
                      <td>
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{k.name}</div>
                            <div className="text-xs text-base-content/60">
                              {k.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {k.project ? (
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4" />
                            <span className="text-sm">{k.project.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-base-content/60">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="text-sm">{k.usageCount ?? 0} calls</div>
                      </td>
                      <td className="text-sm">{formatDate(k.createdAt)}</td>
                      <td className="text-sm">{formatDate(k.lastUsedAt)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setSelected(k)}
                          >
                            View
                          </button>
                          {!k.revoked && (
                            <button
                              className="btn btn-error btn-sm"
                              onClick={() => handleRevoke(k.id)}
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setShowCreate(false);
              setCreatedKey(null);
            }}
          />
          <div className="bg-base-200 rounded-lg shadow-lg z-10 w-full max-w-xl p-6">
            <h3 className="text-lg font-semibold mb-3">Create API Key</h3>
            <div className="flex flex-col gap-3">
              <input
                className="input input-bordered w-full"
                placeholder="Key name (e.g. CI token)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input
                className="input input-bordered w-full"
                placeholder="Associated project id (optional)"
                value={newProjectId}
                onChange={(e) => setNewProjectId(e.target.value)}
              />
              {createdKey ? (
                <div className="alert alert-info">
                  <div>
                    <div className="font-medium">
                      Save this key now — it will not be shown again
                    </div>
                    <pre className="mt-2 bg-base-100 p-2 rounded text-sm break-all">
                      {createdKey}
                    </pre>
                  </div>
                </div>
              ) : null}
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowCreate(false);
                    setCreatedKey(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details drawer/modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelected(null)}
          />
          <div className="bg-base-200 rounded-lg shadow-lg z-10 w-full max-w-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{selected.name}</h3>
                <p className="text-sm text-base-content/70">{selected.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setSelected(null)}>
                  Close
                </Button>
                {!selected.revoked && (
                  <Button
                    variant="destructive"
                    onClick={() => selected && handleRevoke(selected.id)}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <div className="text-xs text-base-content/60">Key (masked)</div>
                <div className="font-mono">{maskKey(selected.key ?? null)}</div>

                <div className="text-xs text-base-content/60 mt-3">Created</div>
                <div className="text-sm">{formatDate(selected.createdAt)}</div>

                <div className="text-xs text-base-content/60 mt-3">
                  Last used
                </div>
                <div className="text-sm">{formatDate(selected.lastUsedAt)}</div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-base-content/60">
                  Associated project
                </div>
                {selected.project ? (
                  <div className="text-sm">{selected.project.name}</div>
                ) : (
                  <div className="text-sm text-base-content/60">Unassigned</div>
                )}

                <div className="text-xs text-base-content/60 mt-3">Usage</div>
                <div className="text-sm">{selected.usageCount ?? 0} calls</div>

                <div className="text-xs text-base-content/60 mt-3">Notes</div>
                <div className="text-sm text-base-content/70">
                  Usage stats and per-project association should be provided by
                  your API endpoints.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
