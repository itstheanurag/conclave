"use client";

import Button from "@/components/ui/Button";
import { formatDate, maskKey } from "@/lib";
import { ApiKey } from "@/types/dashboard";

interface ApiKeyDetailsProps {
  keyData: ApiKey;
  onClose: () => void;
  onRevoke: (id: string) => void;
}

export function ApiKeyDetails({
  keyData,
  onClose,
  onRevoke,
}: ApiKeyDetailsProps) {
  const { id, name, project, key, createdAt, lastUsedAt, usageCount, revoked } =
    keyData;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal content */}
      <div className="bg-base-200 rounded-lg shadow-lg z-10 w-full max-w-2xl p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-base-content/70 break-all">{id}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            {!revoked && (
              <Button variant="destructive" onClick={() => onRevoke(id)}>
                Revoke
              </Button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Left side */}
          <div className="space-y-3">
            <div>
              <div className="text-xs text-base-content/60">Key (masked)</div>
              <div className="font-mono">{maskKey(key ?? null)}</div>
            </div>

            <div>
              <div className="text-xs text-base-content/60">Created</div>
              <div className="text-sm">{formatDate(createdAt)}</div>
            </div>

            <div>
              <div className="text-xs text-base-content/60">Last used</div>
              <div className="text-sm">{formatDate(lastUsedAt)}</div>
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-3">
            <div>
              <div className="text-xs text-base-content/60">
                Associated project
              </div>
              {project ? (
                <div className="text-sm">{project.name}</div>
              ) : (
                <div className="text-sm text-base-content/60">Unassigned</div>
              )}
            </div>

            <div>
              <div className="text-xs text-base-content/60">Usage</div>
              <div className="text-sm">{usageCount ?? 0} calls</div>
            </div>

            <div>
              <div className="text-xs text-base-content/60">Notes</div>
              <div className="text-sm text-base-content/70">
                Usage stats and per-project association should be provided by
                your API endpoints.
              </div>
            </div>
          </div>
        </div>

        {/* Footer for revoked status */}
        {revoked && (
          <div className="alert alert-warning mt-6">
            <span>This API key has been revoked and is no longer active.</span>
          </div>
        )}
      </div>
    </div>
  );
}
