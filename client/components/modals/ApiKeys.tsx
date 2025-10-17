import { useState } from "react";
import Button from "@/components/ui/Button";

export function ApiKeyCreateModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [newName, setNewName] = useState("");
  const [newProjectId, setNewProjectId] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  async function handleCreate() {
    const res = await fetch("/api/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        projectId: newProjectId || null,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      setCreatedKey(json.revealedKey ?? null);
      await onCreated();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
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
          {createdKey && (
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
          )}
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
