"use client";
import { Grid3x3, Maximize2, MonitorUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Participant {
  id: number;
  name: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isHost: boolean;
  isSpeaking?: boolean;
}

interface VideoGridProps {
  participants: Participant[];
  isScreenSharing: boolean;
  viewMode: "speaker" | "grid";
  setViewMode: (mode: "speaker" | "grid") => void;
}

const ParticipantAvatar = ({ name }: { name: string }) => (
  <div className="avatar placeholder">
    <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-24 h-24 flex items-center justify-center text-3xl font-bold">
      {name
        .split(" ")
        .map((n) => n[0])
        .join("")}
    </div>
  </div>
);

const ParticipantVideo = ({
  participant,
  isThumbnail = false,
}: {
  participant: Participant;
  isThumbnail?: boolean;
}) => (
  <div
    className={cn(
      "relative bg-base-200 rounded-lg overflow-hidden flex items-center justify-center transition-all duration-300",
      {
        "ring-4 ring-primary shadow-lg": participant.isSpeaking,
        "w-full h-full": !isThumbnail,
        "w-40 h-24 cursor-pointer": isThumbnail,
      }
    )}
  >
    {participant.isVideoOff ? (
      <ParticipantAvatar name={participant.name} />
    ) : (
      <div className="w-full h-full bg-gradient-to-br from-base-300 to-base-100">
        {/* Video element would go here */}
      </div>
    )}
    <div className="absolute bottom-2 left-2 bg-base-300/50 backdrop-blur-sm text-white px-2 py-1 rounded-md text-sm">
      {participant.name}
    </div>
    {participant.isHost && (
      <div className="badge badge-primary badge-sm absolute top-2 right-2">
        Host
      </div>
    )}
  </div>
);

const SpeakerView = ({
  participants,
}: {
  participants: Participant[];
}) => {
  const speaker =
    participants.find((p) => p.isSpeaking) || participants.find((p) => p.isHost) || participants[0];
  const otherParticipants = participants.filter((p) => p.id !== speaker.id);

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex-1 relative">
        <ParticipantVideo participant={speaker} />
      </div>
      {otherParticipants.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {otherParticipants.map((p) => (
            <ParticipantVideo key={p.id} participant={p} isThumbnail />
          ))}
        </div>
      )}
    </div>
  );
};

const GridView = ({ participants }: { participants: Participant[] }) => {
  const getGridCols = (count: number) => {
    if (count <= 2) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 9) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <div className={cn("flex-1 grid gap-4 p-4", getGridCols(participants.length))}>
      {participants.map((p) => (
        <ParticipantVideo key={p.id} participant={p} />
      ))}
    </div>
  );
};

export default function VideoGrid({
  participants,
  isScreenSharing,
  viewMode,
  setViewMode,
}: VideoGridProps) {
  return (
    <div className="flex-1 flex flex-col p-4 gap-4 relative">
      {viewMode === "speaker" ? (
        <SpeakerView participants={participants} />
      ) : (
        <GridView participants={participants} />
      )}

      {isScreenSharing && (
        <div className="alert alert-info absolute bottom-4 left-4 w-auto shadow-lg">
          <MonitorUp className="w-5 h-5" />
          <span className="text-sm font-medium">You are presenting your screen</span>
        </div>
      )}

      <div className="absolute top-4 right-4 z-10">
        <div className="btn-group bg-base-100/80 rounded-lg p-1 backdrop-blur-sm">
          <button
            onClick={() => setViewMode("speaker")}
            className={cn("btn btn-sm", {
              "btn-primary": viewMode === "speaker",
              "btn-ghost": viewMode !== "speaker",
            })}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={cn("btn btn-sm", {
              "btn-primary": viewMode === "grid",
              "btn-ghost": viewMode !== "grid",
            })}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
