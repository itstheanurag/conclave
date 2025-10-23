"use client";

import {
  MicOff,
  Mic,
  VideoOff,
  Video,
  MonitorUp,
  Users,
  MessageSquare,
  Hand,
  MoreVertical,
  PhoneOff,
  Settings,
  Film,
  Wind,
} from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface Participant {
  id: number;
  name: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isHost: boolean;
}

interface MeetingControlProps {
  participants: Participant[];
  showParticipants: boolean;
  setShowParticipants: (show: boolean) => void;
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  isScreenSharing: boolean;
  setIsScreenSharing: (sharing: boolean) => void;
  onLeave?: () => void;
}

const ControlButton = ({
  isActive,
  onClick,
  children,
  label,
  variant = "default",
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
  variant?: "default" | "danger";
}) => (
  <div className="flex flex-col items-center gap-2">
    <button
      onClick={onClick}
      className={cn("btn btn-circle btn-lg", {
        "btn-primary": variant === "default" && isActive,
        "btn-neutral": variant === "default" && !isActive,
        "btn-error": variant === "danger",
      })}
    >
      {children}
    </button>
    <span className="text-xs font-medium">{label}</span>
  </div>
);

const MeetingControl = ({
  participants,
  showParticipants,
  setShowParticipants,
  showChat,
  setShowChat,
  isScreenSharing,
  setIsScreenSharing,
  onLeave,
}: MeetingControlProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  return (
    <div className="bg-base-200/80 backdrop-blur-sm border-t border-base-300/50 px-6 py-4 flex justify-between items-center">
      {/* Left controls */}
      <div className="flex gap-4">
        <ControlButton
          isActive={isMuted}
          onClick={() => setIsMuted(!isMuted)}
          label={isMuted ? "Unmute" : "Mute"}
          variant={isMuted ? "danger" : "default"}
        >
          {isMuted ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </ControlButton>
        <ControlButton
          isActive={isVideoOff}
          onClick={() => setIsVideoOff(!isVideoOff)}
          label={isVideoOff ? "Start Video" : "Stop Video"}
          variant={isVideoOff ? "danger" : "default"}
        >
          {isVideoOff ? (
            <VideoOff className="w-6 h-6" />
          ) : (
            <Video className="w-6 h-6" />
          )}
        </ControlButton>
      </div>

      {/* Center controls */}
      <div className="flex gap-4">
        <ControlButton
          isActive={isScreenSharing}
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          label="Share Screen"
        >
          <MonitorUp className="w-6 h-6" />
        </ControlButton>
        <ControlButton
          isActive={showParticipants}
          onClick={() => setShowParticipants(!showParticipants)}
          label={`Participants (${participants.length})`}
        >
          <Users className="w-6 h-6" />
        </ControlButton>
        <ControlButton
          isActive={showChat}
          onClick={() => setShowChat(!showChat)}
          label="Chat"
        >
          <MessageSquare className="w-6 h-6" />
        </ControlButton>
        <ControlButton
          isActive={isHandRaised}
          onClick={() => setIsHandRaised(!isHandRaised)}
          label={isHandRaised ? "Lower Hand" : "Raise Hand"}
        >
          <Hand className="w-6 h-6" />
        </ControlButton>
        <div className="dropdown dropdown-top dropdown-end">
          <label tabIndex={0} className="btn btn-circle btn-lg btn-neutral">
            <MoreVertical className="w-6 h-6" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-64 mb-4"
          >
            <li>
              <a>
                <Settings className="w-5 h-5 mr-2" /> Settings
              </a>
            </li>
            <li>
              <a>
                <Film className="w-5 h-5 mr-2" /> Start Recording
              </a>
            </li>
            <li>
              <a>
                <Wind className="w-5 h-5 mr-2" /> Blur My Background
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Right controls */}
      <div>
        <button
          className="btn btn-error btn-lg gap-2"
          onClick={onLeave || (() => (window.location.href = "/"))}
        >
          <PhoneOff className="w-6 h-6" />
          <span className="hidden sm:inline">Leave</span>
        </button>
      </div>
    </div>
  );
};

export default MeetingControl;
