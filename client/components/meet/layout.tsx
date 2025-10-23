"use client";
import React, { useState, useEffect } from "react";
import MeetingHeader from "./header";
import MeetingControl from "./MeetingControl";
import MeetingChat from "./MeetingChat";
import SidebarParticipants from "./participants";
import VideoGrid from "./VideoGrid";
import { cn } from "@/lib/utils";

const initialParticipants = [
  {
    id: 1,
    name: "You",
    isMuted: false,
    isVideoOff: false,
    isHost: true,
    isSpeaking: false,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    isMuted: false,
    isVideoOff: true,
    isHost: false,
    isSpeaking: true,
  },
  {
    id: 3,
    name: "Mike Chen",
    isMuted: true,
    isVideoOff: false,
    isHost: false,
    isSpeaking: false,
  },
  {
    id: 4,
    name: "Emily Davis",
    isMuted: false,
    isVideoOff: true,
    isHost: false,
    isSpeaking: false,
  },
  {
    id: 5,
    name: "James Wilson",
    isMuted: false,
    isVideoOff: true,
    isHost: false,
    isSpeaking: false,
  },
];

const initialMessages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    text: "Hey everyone! Can you hear me?",
    time: "10:23 AM",
    isMe: false,
  },
  {
    id: 2,
    sender: "You",
    text: "Yes, loud and clear!",
    time: "10:23 AM",
    isMe: true,
  },
  {
    id: 3,
    sender: "Mike Chen",
    text: "Ready to start when you are",
    time: "10:24 AM",
    isMe: false,
  },
];

export default function MeetingPage() {
  const [participants, setParticipants] = useState(initialParticipants);
  const [messages, setMessages] = useState(initialMessages);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState<"speaker" | "grid">("grid");
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "You",
        text: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: true,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleMuteToggle = (id: number) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, isMuted: !p.isMuted } : p))
    );
  };

  const handleRemoveParticipant = (id: number) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  return (
    <div className="h-screen w-full bg-base-100 flex flex-col font-sans">
      <MeetingHeader />

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 flex flex-col transition-all duration-300">
          <VideoGrid
            participants={participants}
            viewMode={viewMode}
            setViewMode={setViewMode}
            isScreenSharing={isScreenSharing}
          />
        </main>

        <div
          className={cn(
            "w-96 h-full flex-shrink-0 transition-all duration-300 ease-in-out",
            {
              "-mr-96": !showParticipants && !showChat,
            }
          )}
        >
          {showParticipants ? (
            <SidebarParticipants
              participants={participants}
              onClose={() => setShowParticipants(false)}
              onMuteToggle={handleMuteToggle}
              onRemove={handleRemoveParticipant}
            />
          ) : showChat ? (
            <MeetingChat
              messages={messages}
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              onClose={() => setShowChat(false)}
            />
          ) : null}
        </div>
      </div>

      <footer className="relative z-30">
        <MeetingControl
          participants={participants}
          showParticipants={showParticipants}
          setShowParticipants={(show) => {
            setShowParticipants(show);
            setShowChat(false);
          }}
          showChat={showChat}
          setShowChat={(show) => {
            setShowChat(show);
            setShowParticipants(false);
          }}
          isScreenSharing={isScreenSharing}
          setIsScreenSharing={setIsScreenSharing}
        />
      </footer>
    </div>
  );
}
