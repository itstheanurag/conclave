"use client";
import React, { useState, useEffect } from "react";
import MeetingHeader from "@/components/call/header";
import MeetingControl from "@/components/call/MeetingControl";
import MeetingChat from "@/components/call/MeetingChat";
import SidebarParticipants from "@/components/call/participants";
import VideoGrid from "@/components/call/VideoGrid";
import { cn } from "@/lib/utils";
import useWebRTC from "@/hooks/useWebRTC";
import { initialMessages } from "@/data/meetings/meetings";
import { useParams } from "next/navigation";

export default function CallPage() {
  const { id } = useParams();
  const roomId = id as string;
  const [userId] = useState(() => Math.random().toString(36).substring(2, 15));
  const [userName] = useState(() => `Guest-${userId.substring(0, 5)}`);

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
  } = useWebRTC(roomId, userId, userName);

  useEffect(() => {
    setIsScreenSharing(isScreenSharingActive);
  }, [isScreenSharingActive]);

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
