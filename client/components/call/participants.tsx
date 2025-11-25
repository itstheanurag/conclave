"use client";
import {
  Users,
  Mic,
  MicOff,
  X,
  MoreVertical,
  UserCog,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MeetingParticipant } from "@/types/mediasoup";

interface SidebarParticipantsProps {
  participants: MeetingParticipant[];
  onClose: () => void;
  onMuteToggle?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export default function SidebarParticipants({
  participants,
  onClose,
  onMuteToggle,
  onRemove,
}: SidebarParticipantsProps) {
  return (
    <div className="w-96 bg-base-200/80 backdrop-blur-sm border-l border-base-300/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-base-300/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6" />
          <h2 className="font-bold text-lg">
            Participants ({participants.length})
          </h2>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {participants.map((p: MeetingParticipant) => (
          <div
            key={p.id}
            className={cn(
              "flex items-center justify-between bg-base-100/50 rounded-lg p-3 transition-all duration-300",
              { "ring-2 ring-primary/50": p.isSpeaking }
            )}
          >
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
                <p className="text-sm font-semibold truncate">{p.name}</p>
                {p.isHost && (
                  <span className="text-xs text-primary font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Host
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="btn btn-ghost btn-circle btn-sm">
                {p.isMuted ? (
                  <MicOff className="w-4 h-4 text-error" />
                ) : (
                  <Mic className="w-4 h-4 text-success" />
                )}
              </button>

              {!p.isHost && onRemove && (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle btn-sm"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-48"
                  >
                    {onMuteToggle && (
                      <li>
                        <a onClick={() => onMuteToggle(p.id)}>
                          {p.isMuted ? <Mic /> : <MicOff />}{" "}
                          {p.isMuted ? "Unmute" : "Mute"} Participant
                        </a>
                      </li>
                    )}
                    <li>
                      <a onClick={() => onRemove(p.id)} className="text-error">
                        <UserCog className="w-4 h-4 mr-2" /> Remove Participant
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
