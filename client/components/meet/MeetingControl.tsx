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
} from "lucide-react";
import React, { useState } from "react";

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

  return (
    <div className="navbar bg-base-200 border-t border-base-300 px-6">
      {/* Left controls */}
      <div className="flex-1 justify-start">
        <div className="btn-group">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`btn ${isMuted ? "btn-error" : "btn-neutral"} gap-2`}
          >
            {isMuted ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">
              {isMuted ? "Unmute" : "Mute"}
            </span>
          </button>

          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`btn ${isVideoOff ? "btn-error" : "btn-neutral"} gap-2`}
          >
            {isVideoOff ? (
              <VideoOff className="w-5 h-5" />
            ) : (
              <Video className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">
              {isVideoOff ? "Start" : "Stop"}
            </span>
          </button>

          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`btn ${
              isScreenSharing ? "btn-primary" : "btn-neutral"
            } gap-2`}
          >
            <MonitorUp className="w-5 h-5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex-none">
        <div className="btn-group">
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`btn ${
              showParticipants ? "btn-primary" : "btn-neutral"
            } gap-2`}
          >
            <Users className="w-5 h-5" />
            <span className="hidden sm:inline">
              People ({participants.length})
            </span>
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`btn ${showChat ? "btn-primary" : "btn-neutral"} gap-2`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="hidden sm:inline">Chat</span>
          </button>

          <button className="btn btn-neutral gap-2">
            <Hand className="w-5 h-5" />
            <span className="hidden sm:inline">Raise</span>
          </button>

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-neutral btn-circle">
              <MoreVertical className="w-5 h-5" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Recording</a>
              </li>
              <li>
                <a>Blur background</a>
              </li>
            </ul>
          </div>

          <button
            className="btn btn-error gap-2 ml-2"
            onClick={onLeave || (() => (window.location.href = "/"))}
          >
            <PhoneOff className="w-5 h-5" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingControl;
