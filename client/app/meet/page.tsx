"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MeetPage() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      router.push(`/call/${roomId.trim()}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <h1 className="text-4xl font-bold mb-8">Join or Create a Meeting</h1>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Enter Meeting ID</h2>
          <input
            type="text"
            placeholder="Meeting ID"
            className="input input-bordered w-full max-w-xs mb-4"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <div className="card-actions">
            <button className="btn btn-primary" onClick={handleJoinRoom}>
              Join Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
