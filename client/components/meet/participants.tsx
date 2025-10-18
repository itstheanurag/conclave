"use client";
import { Users, Mic, MicOff, X } from "lucide-react";

interface Participant {
  id: number;
  name: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isHost: boolean;
}

interface SidebarParticipantsProps {
  participants: Participant[];
  onClose: () => void;
  onMuteToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

export default function SidebarParticipants({
  participants,
  onClose,
  onMuteToggle,
  onRemove,
}: SidebarParticipantsProps) {
  return (
    <div className="w-80 bg-base-200 border-l border-base-300 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-base-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h2 className="font-semibold">
            Participants ({participants.length})
          </h2>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {participants.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between bg-base-100 rounded-md p-2 hover:bg-base-200 transition"
          >
            {/* Name & Host Badge */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="avatar placeholder">
                <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
                  {p.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-medium truncate">
                  {p.name}{" "}
                  {p.isHost && (
                    <span className="text-primary text-xs ml-1">(Host)</span>
                  )}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onMuteToggle(p.id)}
                className="btn btn-sm btn-outline gap-1"
              >
                {p.isMuted ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {p.isMuted ? "Unmute" : "Mute"}
                </span>
              </button>

              {!p.isHost && (
                <button
                  onClick={() => onRemove(p.id)}
                  className="btn btn-sm btn-error gap-1"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
