"use client";

import React, { useState, useEffect, useRef } from "react";
import MeetingHeader from "@/components/call/header";
import MeetingChat from "@/components/call/MeetingChat";
import SidebarParticipants from "@/components/call/participants";
import { cn } from "@/lib/utils";
import { initialMessages } from "@/data/meetings/meetings";
import { useParams } from "next/navigation";
import { useMediasoup } from "@/hooks/useMediasoup";
import MeetingControlDock from "@/components/call/MeetingControl";
import ParticipantTile from "@/components/call/participant-tile";

export default function CallPage() {
  const { id } = useParams();
  const roomId = id as string;

  const [userId] = useState(() => Math.random().toString(36).substring(2, 15));
  const [messages, setMessages] = useState(initialMessages);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");

  const {
    participants,
    startMedia,
    stopMedia,
    toggleMic,
    toggleCamera,
    startScreenShare,
    stopScreenShare,
    isMicEnabled,
    isWebcamEnabled,
    isScreenSharing,
  } = useMediasoup({
    roomId,
    peerId: userId,
    websocketUrl: "ws://localhost:3001",
  });

  /* Auto Start Media */
  useEffect(() => {
    startMedia(true, true); // don't await here

    return () => {
      stopMedia(); // also don't await here
    };
  }, []);

  /* Send Chat */
  const handleSendMessage = () => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "You",
        text: message,
        isMe: true,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setMessage("");
  };

  /* Participant Control */
  const handleMuteToggle = (id: string) => {
    if (id === userId) toggleMic();
  };

  const handleVideoToggle = (id: string) => {
    if (id === userId) toggleCamera();
  };

  return (
    <div className="h-screen w-full bg-base-100 flex flex-col font-sans">
      <MeetingHeader />

      <div className="flex-1 flex overflow-hidden">
        {/* MAIN VIDEO GRID */}
        <main className="flex-1 p-4 bg-black overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full">
            {Array.from(participants.values()).map((p) => (
              <ParticipantTile
                key={p.id}
                participant={p}
                isMe={p.id === userId}
              />
            ))}
          </div>
        </main>

        {/* SIDEBAR */}
        <aside
          className={cn(
            "w-96 h-full flex-shrink-0 transition-all duration-300 ease-in-out",
            { "-mr-96": !showParticipants && !showChat }
          )}
        >
          {showParticipants ? (
            <SidebarParticipants
              participants={Array.from(participants.values())}
              onClose={() => setShowParticipants(false)}
              onMuteToggle={handleMuteToggle}
              onRemove={(id) => console.log("Remove participant", id)}
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
        </aside>
      </div>

      {/* CONTROLS */}
      <footer className="relative z-30">
        <MeetingControlDock
          isMicEnabled={isMicEnabled}
          isWebcamEnabled={isWebcamEnabled}
          isScreenSharing={isScreenSharing}
          toggleMic={toggleMic}
          toggleCamera={toggleCamera}
          startScreenShare={startScreenShare}
          stopScreenShare={stopScreenShare}
        />
      </footer>
    </div>
  );
}
