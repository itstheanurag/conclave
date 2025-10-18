"use client";
import React, { useState } from "react";
import { Participant } from "@/types"; // optional, if you have a types file
import MeetingHeader from "./header";
import MeetingControl from "./MeetingControl";
import MeetingChat from "./MeetingChat";
import SidebarParticipants from "./participants";
import VideoGrid from "./VideoGrid";

// Example participants and messages
const participants = [
  { id: 1, name: "You", isMuted: false, isVideoOff: true, isHost: true },
  {
    id: 2,
    name: "Sarah Johnson",
    isMuted: false,
    isVideoOff: true,
    isHost: false,
  },
  { id: 3, name: "Mike Chen", isMuted: true, isVideoOff: false, isHost: false },
  {
    id: 4,
    name: "Emily Davis",
    isMuted: false,
    isVideoOff: true,
    isHost: false,
  },
  {
    id: 5,
    name: "James Wilson",
    isMuted: false,
    isVideoOff: true,
    isHost: false,
  },
];

const messages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    text: "Hey everyone! Can you hear me?",
    time: "10:23 AM",
  },
  { id: 2, sender: "You", text: "Yes, loud and clear!", time: "10:23 AM" },
  {
    id: 3,
    sender: "Mike Chen",
    text: "Ready to start when you are",
    time: "10:24 AM",
  },
];

export default function MeetingPage() {
  const [showParticipants, setShowParticipants] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState("speaker");
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage("");
    }
  };

  return (
    <div className="h-screen w-full bg-base-300 flex flex-col">
      {/* Header */}
      <MeetingHeader />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <VideoGrid
          participants={participants}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isScreenSharing={isScreenSharing}
        />

        {/* Participants Sidebar */}
        {showParticipants && (
          <SidebarParticipants
            participants={participants}
            onClose={() => setShowParticipants(false)}
          />
        )}

        {/* Chat Sidebar */}
        {showChat && (
          <MeetingChat
            messages={messages}
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            onClose={() => setShowChat(false)}
          />
        )}
      </div>

      {/* Control Bar */}
      <MeetingControl
        participants={participants}
        showParticipants={showParticipants}
        setShowParticipants={setShowParticipants}
        showChat={showChat}
        setShowChat={setShowChat}
        isScreenSharing={isScreenSharing}
        setIsScreenSharing={setIsScreenSharing}
      />
    </div>
  );
}
