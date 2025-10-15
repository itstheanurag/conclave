"use client";

import { useAtom } from "jotai";

import {
  meetingsAtom,
  currentMeetingAtom,
  usernameAtom,
} from "@/atoms";
import { useState } from "react";
import { toast } from "sonner";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useAtom(meetingsAtom);
  const [currentMeeting, setCurrentMeeting] = useAtom(currentMeetingAtom);
  const [username, setUsername] = useAtom(usernameAtom);

  const [newMeetingId, setNewMeetingId] = useState("");

  const createMeeting = () => {
    const meetingId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setMeetings([...meetings, meetingId]);
    setCurrentMeeting(meetingId);
    toast.success(`Meeting ${meetingId} created`);
  };

  const joinMeeting = (meetingId: string) => {
    if (!meetings.includes(meetingId)) {
      toast.error("Meeting does not exist");
      return;
    }
    setCurrentMeeting(meetingId);
    toast.success(`Joined meeting ${meetingId}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Meetings</h1>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Your name"
          className="input input-bordered"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="btn btn-primary" onClick={createMeeting}>
          Create Meeting
        </button>
      </div>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Meeting ID to join"
          className="input input-bordered"
          value={newMeetingId}
          onChange={(e) => setNewMeetingId(e.target.value)}
        />
        <button
          className="btn btn-secondary"
          onClick={() => joinMeeting(newMeetingId)}
        >
          Join Meeting
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Active Meetings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {meetings.map((id) => (
          <div key={id} className="card bg-base-200 shadow-md p-4">
            <div className="card-body">
              <h3 className="card-title">{id}</h3>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => joinMeeting(id)}
              >
                Join
              </button>
            </div>
          </div>
        ))}
      </div>

      {currentMeeting && (
        <div className="mt-8 p-4 border border-primary rounded-lg">
          <h2 className="text-xl font-bold">Meeting ID: {currentMeeting}</h2>
          <p>Participants: (coming soon)</p>
        </div>
      )}
    </div>
  );
}
