"use client";
import React, { useState, useEffect } from "react";
import MeetingHeader from "./header";
import MeetingControl from "./MeetingControl";
import MeetingChat from "./MeetingChat";
import SidebarParticipants from "./participants";
import VideoGrid from "./VideoGrid";
import { cn } from "@/lib/utils";
import useWebRTC from "@/hooks/useWebRTC";
import { initialMessages } from "@/data/meetings/meetings";

export default function MeetingPage() {
  const currentUserId = "local-user-123";
  const currentUserName = "You";

  const [messages, setMessages] = useState(initialMessages);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState<"speaker" | "grid">("grid");
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const {
    participants,
    startMedia,
    startScreenShare,
    stopMedia,
    stopScreenShare,
    isScreenSharingActive,
    toggleMic,
    toggleCamera,
  } = useWebRTC("test-room", currentUserId, currentUserName);

  useEffect(() => {
    setIsScreenSharing(isScreenSharingActive);
  }, [isScreenSharingActive]);

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
    if (id === currentUserId) {
      toggleMic();
    } else {
      console.log(`Toggle mute for remote participant ${id}`);
      // For remote participants, this would involve sending a signaling message to the server
    }
  };

  const handleVideoToggle = (id: string) => {
    if (id === currentUserId) {
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
          <VideoGrid
            participants={Array.from(participants.values())}
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
