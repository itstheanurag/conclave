import { formatDate } from "@/lib";
import { ApiKey } from "@/types/dashboard";
import { Code, Database } from "lucide-react";

interface ApiKeysTableProps {
  keys: ApiKey[];
  loading: boolean;
  onSelect: (key: ApiKey) => void;
  onRevoke: (id: string) => void;
}

export function ApiKeysTable({
  keys,
  loading,
  onSelect,
  onRevoke,
}: ApiKeysTableProps) {
  return (
    <div className="card bg-base-200 shadow-sm">
      <div className="card-body p-4 overflow-x-auto">
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
                  <td className="text-sm">{k.usageCount ?? 0} calls</td>
                  <td className="text-sm">{formatDate(k.createdAt)}</td>
                  <td className="text-sm">{formatDate(k.lastUsedAt)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => onSelect(k)}
                      >
                        View
                      </button>
                      {!k.revoked && (
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => onRevoke(k.id)}
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
  );
}
