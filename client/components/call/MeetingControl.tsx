"use client";

import { Mic, MicOff, Video, VideoOff, MonitorUp } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface MeetingControlProps {
  isMicEnabled: boolean;
  isWebcamEnabled: boolean;
  isScreenSharing: boolean;

  toggleMic: () => void;
  toggleCamera: () => void;
  startScreenShare: () => void;
  stopScreenShare: () => void;
}

const DockButton = ({
  active,
  danger,
  onClick,
  children,
}: {
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "btn btn-circle btn-lg transition-all",
      danger ? "btn-error" : active ? "btn-primary" : "btn-neutral"
    )}
  >
    {children}
  </button>
);

export default function MeetingControlDock({
  isMicEnabled,
  isWebcamEnabled,
  isScreenSharing,
  toggleMic,
  toggleCamera,
  startScreenShare,
  stopScreenShare,
}: MeetingControlProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-base-200/70 backdrop-blur-xl border border-base-300 shadow-xl rounded-full px-6 py-3 flex gap-6 items-center">
        {/* Mic Toggle */}
        <DockButton
          active={isMicEnabled}
          danger={!isMicEnabled}
          onClick={toggleMic}
        >
          {isMicEnabled ? (
            <Mic className="w-6 h-6" />
          ) : (
            <MicOff className="w-6 h-6" />
          )}
        </DockButton>

        {/* Camera Toggle */}
        <DockButton
          active={isWebcamEnabled}
          danger={!isWebcamEnabled}
          onClick={toggleCamera}
        >
          {isWebcamEnabled ? (
            <Video className="w-6 h-6" />
          ) : (
            <VideoOff className="w-6 h-6" />
          )}
        </DockButton>

        {/* Screen Share */}
        <DockButton
          active={isScreenSharing}
          onClick={isScreenSharing ? stopScreenShare : startScreenShare}
        >
          <MonitorUp className="w-6 h-6" />
        </DockButton>
      </div>
    </div>
  );
}
