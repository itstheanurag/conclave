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

export default function CallPage() {
  const { id } = useParams();
  const roomId = id as string;

  const [userId] = useState(() => Math.random().toString(36).substring(2, 15));

  const [messages, setMessages] = useState(initialMessages);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");

  // Video refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // -----------------------------
  // MEDIASOUP HOOK
  // -----------------------------
  const {
    localStream,
    remoteStreams,
    participants,
    isMicEnabled,
    isWebcamEnabled,
    isScreenSharing,
    startMedia,
    stopMedia,
    startScreenShare,
    stopScreenShare,
    toggleMic,
    toggleCamera,
  } = useMediasoup({
    roomId,
    peerId: userId,
    websocketUrl: "ws://localhost:3001",
  });

  // Attach local stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Attach first remote stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStreams.length > 0) {
      remoteVideoRef.current.srcObject = remoteStreams[0];
    }
  }, [remoteStreams]);

  // Auto start cam & mic
  useEffect(() => {
    (async () => {
      await startMedia(true, true);
    })();

    return () => {
      stopMedia(); // no await
    };
  }, [startMedia, stopMedia]);

  // -----------------------------
  // Messaging
  // -----------------------------
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

  // -----------------------------
  // Participant Controls
  // -----------------------------
  const handleMuteToggle = (id: string) => {
    if (id === userId) toggleMic();
  };

  const handleVideoToggle = (id: string) => {
    if (id === userId) toggleCamera();
  };

  const handleRemoveParticipant = (id: string) => {
    console.log(`Remove participant ${id}`);
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="h-screen w-full bg-base-100 flex flex-col font-sans">
      <MeetingHeader />

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 flex flex-col transition-all duration-300">
          <div className="flex-1 flex justify-center items-center bg-gray-800 gap-2">
            {/* LOCAL VIDEO */}
            {localStream && (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-1/2 h-full object-cover"
              />
            )}

            {/* REMOTE VIDEO */}
            {remoteStreams.length > 0 && (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-1/2 h-full object-cover"
              />
            )}

            {!localStream && remoteStreams.length === 0 && (
              <p className="text-white">No media streams active</p>
            )}
          </div>
        </main>

        {/* SIDEBAR */}
        <div
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

      {/* FOOTER CONTROLS */}
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
