"use client";
import Link from "next/link";

import React from "react";
import { MeetingSummary } from "@/types";
import { RefreshCcw, Calendar, Users } from "lucide-react";

interface MeetingListProps {
  meetings: MeetingSummary[];
  loading: boolean;
  onRefresh: () => void;
  onSelect: (id: string) => void;
}

export default function MeetingList({
  meetings,
  loading,
  onRefresh,
  onSelect,
}: MeetingListProps) {
  return (
    <div className="card bg-base-200/60 border border-base-300 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-base-content">Meetings</h2>
        <button
          className="btn btn-sm btn-outline flex items-center gap-2"
          onClick={onRefresh}
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-8 text-base-content/70">
          Loading meetings…
        </div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-8 text-base-content/70">
          No meetings yet.
        </div>
      ) : (
        <div className="space-y-3 max-h-[65vh] overflow-y-auto">
          {meetings.map((m) => (
            <div
              key={m.id}
              onClick={() => onSelect(m.id)}
              className="group cursor-pointer rounded-xl border border-transparent hover:border-base-300 bg-base-100 hover:bg-base-100/70 transition-all p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            >
              {/* Left */}
              <div className="flex flex-col">
                <div className="font-medium text-base-content group-hover:text-primary transition">
                  {m.title ?? `Meeting ${m.id}`}
                </div>
                <div className="mt-1 text-sm text-base-content/70 flex items-center gap-2">
                  {m.project && (
                    <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs">
                      {m.project.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-base-content/50">
                    <Calendar size={12} />
                    {new Date(m.createdAt ?? Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3 text-sm text-base-content/60">
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{m.participantsCount ?? 0}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/call/${m.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="btn btn-sm btn-primary"
                  >
                    Join
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(m.id);
                    }}
                    className="btn btn-sm btn-outline"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
