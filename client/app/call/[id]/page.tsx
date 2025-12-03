"use client";

import React, { useState, useEffect, useRef } from "react";
import MeetingHeader from "@/components/call/header";
import MeetingChat from "@/components/call/MeetingChat";
import SidebarParticipants from "@/components/call/participants";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useMediasoup } from "@/hooks/useMediasoup";
import MeetingControlDock from "@/components/call/MeetingControl";
import ParticipantTile from "@/components/call/participant-tile";

export default function CallPage() {
  const { id } = useParams();
  const router = useRouter();
  const roomId = id as string;

  const [userId] = useState(() => Math.random().toString(36).substring(2, 15));
  const [messages, setMessages] = useState<any[]>([]);
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
    isDeviceLoaded,
  } = useMediasoup({
    roomId,
    peerId: userId,
    websocketUrl: "ws://localhost:3001",
  });

  /* Auto Start Media */
  useEffect(() => {
    if (isDeviceLoaded) {
      startMedia(true, true);
    }

    return () => {
      stopMedia();
    };
  }, [isDeviceLoaded]);

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

  const handleLeave = () => {
    router.push("/dashboard");
  };

  return (
    <div className="h-screen w-full bg-base-100 flex flex-col font-sans">
      <MeetingHeader />

      <div className="flex-1 flex overflow-hidden">
        {/* MAIN VIDEO GRID */}
        <main className="flex-1 p-4 bg-black overflow-hidden flex items-center justify-center">
          <div
            className={cn(
              "grid gap-4 w-full h-full max-h-full",
              participants.size <= 1
                ? "grid-cols-1"
                : participants.size === 2
                ? "grid-cols-1 md:grid-cols-2"
                : participants.size <= 4
                ? "grid-cols-2"
                : participants.size <= 9
                ? "grid-cols-2 md:grid-cols-3"
                : "grid-cols-3 md:grid-cols-4"
            )}
          >
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
          onLeave={handleLeave}
        />
      </footer>
    </div>
  );
}
