"use client";
import React from "react";
import { Play, Download } from "lucide-react";
import { Recording } from "@/types/meetings";

interface MeetingRecordingsProps {
  recordings: Recording[];
}

export default function MeetingRecordings({
  recordings,
}: MeetingRecordingsProps) {
  if (!recordings || recordings.length === 0) {
    return (
      <div className="bg-base-100 rounded p-3">
        <div className="text-sm text-base-content/60 mb-2">Recordings</div>
        <p className="text-base-content/70 text-sm">
          No recordings available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded p-3 space-y-3">
      <div className="text-sm text-base-content/60 mb-1">Recordings</div>

      <div className="divide-y divide-base-300">
        {recordings.map((rec) => (
          <div
            key={rec.id}
            className="flex items-center justify-between py-2 hover:bg-base-200 px-2 rounded-lg transition"
          >
            <div>
              <div className="font-medium">{rec.title}</div>
              <div className="text-xs text-base-content/60">
                {new Date(rec.createdAt).toLocaleString()} • {rec.duration}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="btn btn-ghost btn-sm">
                <Play className="w-4 h-4 mr-1" /> Play
              </button>
              {rec.url && (
                <a href={rec.url} download className="btn btn-ghost btn-sm">
                  <Download className="w-4 h-4 mr-1" /> Download
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
