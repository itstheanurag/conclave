"use client";

import React, { useEffect, useRef } from "react";
import { MeetingParticipant } from "@/types/mediasoup";

export default function ParticipantTile({
  participant,
  isMe,
}: {
  participant: MeetingParticipant;
  isMe: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Attach stream to video element */
  useEffect(() => {
    if (participant.stream && videoRef.current) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream]);

  const initials =
    participant.name?.slice(0, 2)?.toUpperCase() ??
    participant.id.slice(0, 2).toUpperCase();

  const showVideo =
    participant.stream &&
    participant.stream.getVideoTracks().length > 0 &&
    !participant.isVideoOff;

  return (
    <div
      className="
        relative 
        bg-[#1a1c1f] 
        rounded-2xl 
        overflow-hidden 
        shadow-xl 
        shadow-black/40 
        border border-white/10 
        flex items-center justify-center
        w-full h-full
        aspect-video
        animate-fadeIn
      "
    >
      {/* STREAM OR PLACEHOLDER */}
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMe}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-white/90 select-none">
          <div className="w-24 h-24 rounded-full bg-[#2a2c31] flex items-center justify-center text-4xl font-semibold mb-4">
            {initials}
          </div>
          <p className="text-lg font-medium">
            {isMe ? "You" : participant.name}
          </p>
          <p className="text-xs opacity-50 mt-1">
            {participant.isVideoOff ? "Camera off" : "Connecting…"}
          </p>
        </div>
      )}

      {/* STATUS BADGES */}
      <div className="absolute top-2 right-2 flex items-center gap-2">
        {participant.isMuted && (
          <span className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-red-400 text-sm">
            🔇
          </span>
        )}

        {participant.isVideoOff && (
          <span className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-red-400 text-sm">
            📷✖
          </span>
        )}

        {participant.isScreenShare && (
          <span className="bg-green-600/80 text-white px-2 py-1 rounded text-xs">
            Screen Sharing
          </span>
        )}
      </div>

      {/* NAME TAG */}
      <div
        className="
        absolute bottom-0 left-0 right-0 
        bg-gradient-to-t from-black/70 to-transparent 
        px-4 py-2 
        text-white text-sm font-medium
      "
      >
        {isMe ? "You" : participant.name}
        {participant.isHost && (
          <span className="ml-2 text-yellow-400 text-xs">(Host)</span>
        )}
      </div>
    </div>
  );
}
