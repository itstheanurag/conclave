"use client";
import React from "react";
import { User } from "lucide-react";
import { Participant } from "@/types";

interface MeetingParticipantsProps {
  participants: Participant[];
}

export default function MeetingParticipants({
  participants,
}: MeetingParticipantsProps) {
  if (!participants || participants.length === 0) {
    return (
      <div className="bg-base-100 rounded p-3">
        <div className="text-sm text-base-content/60 mb-2">Participants</div>
        <p className="text-base-content/70 text-sm">
          No participants joined yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded p-3 space-y-3">
      <div className="text-sm text-base-content/60 mb-1">Participants</div>

      <div className="space-y-2">
        {participants.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between bg-base-200 p-2 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-base-content/70" />
              <span className="font-medium">{p.name}</span>
            </div>

            <div className="text-xs text-base-content/60">
              {p.role ?? "Member"}
              {p.joinedAt && (
                <> • {new Date(p.joinedAt).toLocaleTimeString()}</>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
