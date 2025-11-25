"use client";
import React, { useState, useEffect, useRef } from "react";
import MeetingHeader from "@/components/call/header";
import MeetingControl from "@/components/call/MeetingControl";
import MeetingChat from "@/components/call/MeetingChat";
import SidebarParticipants from "@/components/call/participants";
import { cn } from "@/lib/utils";
import { initialMessages } from "@/data/meetings/meetings";
import { useParams } from "next/navigation";
import { useMediasoup } from "@/hooks/useMediasoup"; // Import the new hook

export default function CallPage() {
  const { id } = useParams();
  const roomId = id as string;
  const [userId] = useState(() => Math.random().toString(36).substring(2, 15));
  const [userName] = useState(() => `Guest-${userId.substring(0, 5)}`);

  const [messages, setMessages] = useState(initialMessages);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState<"speaker" | "grid">("grid"); // Keep for potential future use with VideoGrid

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null); // For simplicity, showing one remote video

  const {
    localStream,
    remoteStreams,
    participants, // This will be an empty map for now, as useMediasoup doesn't populate it yet
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
    websocketUrl: "ws://localhost:3000",
  }); // TODO: Replace with actual WebSocket URL

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    // For simplicity, just display the first remote stream
    if (remoteVideoRef.current && remoteStreams.length > 0) {
      remoteVideoRef.current.srcObject = remoteStreams[0];
    }
  }, [remoteStreams]);

  useEffect(() => {
    startMedia(true, true); // Automatically start camera and microphone

    return () => {
      stopMedia(); // Stop media when component unmounts
    };
  }, [startMedia, stopMedia]);

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

  const handleMuteToggle = (id: string) => {
    if (id === userId) {
      toggleMic();
    } else {
      console.log(`Toggle mute for remote participant ${id}`);
      // For remote participants, this would involve sending a signaling message to the server
    }
  };

  const handleVideoToggle = (id: string) => {
    if (id === userId) {
      toggleCamera();
    } else {
      console.log(`Toggle video for remote participant ${id}`);
      // For remote participants, this would involve sending a signaling message to the server
    }
  };

  const handleRemoveParticipant = (id: string) => {
    console.log(`Remove participant ${id}`);
    // Implement actual participant removal logic via signaling to the server
  };

  return (
    <div className="h-screen w-full bg-base-100 flex flex-col font-sans">
      <MeetingHeader />

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 flex flex-col transition-all duration-300">
          <div className="flex-1 flex justify-center items-center bg-gray-800">
            {localStream && (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-1/2 h-full object-cover"
              />
            )}
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

      <footer className="relative z-30">
        <MeetingControl
          participants={Array.from(participants.values())}
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
          startMedia={startMedia}
          startScreenShare={startScreenShare}
          stopMedia={stopMedia}
          stopScreenShare={stopScreenShare}
          toggleMic={toggleMic}
          toggleCamera={toggleCamera}
        />
      </footer>
    </div>
  );
}
