"use client";
import { Grid3x3, Maximize2, MonitorUp } from "lucide-react";

interface Participant {
  id: number;
  name: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isHost: boolean;
}

interface VideoGridProps {
  participants: Participant[];
  isScreenSharing: boolean;
  viewMode: string;
  setViewMode: (mode: string) => void;
}

export default function VideoGrid({
  participants,
  isScreenSharing,
  viewMode,
  setViewMode,
}: VideoGridProps) {
  const mainParticipants = participants.slice(0, 4);
  const thumbnailParticipants = participants.slice(4);

  return (
    <div className="flex-1 flex flex-col p-4 gap-3">
      {/* Main Video Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {mainParticipants.map((p) => (
          <div
            key={p.id}
            className="relative bg-base-200 rounded-box overflow-hidden flex items-center justify-center"
          >
            {p.isVideoOff ? (
              <div className="avatar placeholder">
                <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-32 h-32 flex items-center justify-center text-4xl font-bold">
                  {p.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-base-300 to-base-100"></div>
            )}
            {p.isHost && (
              <div className="badge badge-primary badge-sm absolute top-2 right-2">
                Host
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Thumbnails */}
      {thumbnailParticipants.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {thumbnailParticipants.map((p) => (
            <div
              key={p.id}
              className="card card-compact w-32 h-24 bg-base-200 flex-shrink-0 cursor-pointer hover:ring-2 ring-primary transition"
            >
              <figure className="relative h-full">
                {p.isVideoOff ? (
                  <div className="avatar placeholder">
                    <div className="bg-gradient-to-br from-success to-info text-success-content rounded-full w-12 h-12 flex items-center justify-center text-sm font-bold">
                      {p.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-base-300 to-base-100"></div>
                )}
              </figure>
            </div>
          ))}
        </div>
      )}

      {/* Screen Share Indicator */}
      {isScreenSharing && (
        <div className="alert alert-error absolute bottom-4 left-4 w-auto">
          <MonitorUp className="w-4 h-4" />
          <span className="text-sm font-medium">You're presenting</span>
        </div>
      )}

      {/* View Mode Toggle */}
      <button
        onClick={() => setViewMode(viewMode === "speaker" ? "grid" : "speaker")}
        className="btn btn-circle btn-sm absolute top-4 right-4 bg-base-100/80"
      >
        {viewMode === "speaker" ? (
          <Grid3x3 className="w-4 h-4" />
        ) : (
          <Maximize2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
