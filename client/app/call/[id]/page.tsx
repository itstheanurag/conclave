"use client";

import { useEffect } from "react";
import MeetingHeader from "@/components/call/header";
import MeetingChat from "@/components/call/MeetingChat";
import SidebarParticipants from "@/components/call/participants";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useMediasoup } from "@/hooks/useMediasoup";
import MeetingControlDock from "@/components/call/MeetingControl";
import ParticipantTile from "@/components/call/participant-tile";
import { useCallStore, ChatMessage } from "@/stores/callStore";

export default function CallPage() {
  const { id } = useParams();
  const router = useRouter();
  const roomId = id as string;

  // Get state and actions from Zustand stores
  const {
    userId,
    messages,
    showParticipants,
    showChat,
    currentMessage,
    setUserId,
    setRoomId,
    addMessage,
    setCurrentMessage,
    toggleChat,
    toggleParticipants,
    closeChat,
    closeParticipants,
  } = useCallStore();

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

  /* Initialize userId and roomId */
  useEffect(() => {
    const generatedId = Math.random().toString(36).substring(2, 15);
    setUserId(generatedId);
    setRoomId(roomId);
  }, [roomId, setUserId, setRoomId]);

  /* Auto Start Media */
  useEffect(() => {
    if (isDeviceLoaded && userId) {
      startMedia(true, true);
    }

    return () => {
      stopMedia();
    };
  }, [isDeviceLoaded, userId, startMedia, stopMedia]);

  /* Send Chat */
  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      sender: "You",
      text: currentMessage,
      isMe: true,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    addMessage(newMessage);
    setCurrentMessage("");
  };

  /* Participant Control */
  const handleMuteToggle = (participantId: string) => {
    if (participantId === userId) toggleMic();
  };

  const handleVideoToggle = (participantId: string) => {
    if (participantId === userId) toggleCamera();
  };

  const handleLeave = () => {
    router.push("/dashboard");
  };

  // Don't render until userId is set
  if (!userId) {
    return (
      <div className="h-screen w-full bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

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
              onClose={closeParticipants}
              onMuteToggle={handleMuteToggle}
              onRemove={(participantId) => console.log("Remove participant", participantId)}
            />
          ) : showChat ? (
            <MeetingChat
              messages={messages}
              message={currentMessage}
              setMessage={setCurrentMessage}
              handleSendMessage={handleSendMessage}
              onClose={closeChat}
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
