"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import MeetingList from "./MeetingLists";
import MeetingDetails from "./MeetingDetails";
import { useMeetingsStore } from "@/stores/meetingsStore";

export default function MeetingsPage() {
  const {
    meetings,
    currentMeetingId,
    username,
    setMeetings,
    setCurrentMeetingId,
    setUsername,
  } = useMeetingsStore();

  const [loading, setLoading] = useState(false);
  const API_URL = "http://localhost:8080/api";

  async function fetchMeetings() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/meetings`);
      if (!res.ok) throw new Error("Failed to fetch meetings");
      const data = await res.json();
      setMeetings(data);
    } catch (err) {
      console.error(err);
      toast.error("Could not load meetings");
    } finally {
      setLoading(false);
    }
  }

  async function createMeeting() {
    try {
      const res = await fetch(`${API_URL}/meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Meeting by ${username || "User"}`,
          hostId: username || "anonymous",
        }),
      });
      if (!res.ok) throw new Error("Failed to create meeting");
      // const newMeeting = await res.json();
      toast.success("Meeting created");
      fetchMeetings();
    } catch (err) {
      console.error(err);
      toast.error("Could not create meeting");
    }
  }

  useEffect(() => {
    fetchMeetings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meetings</h1>
          <p className="text-base-content/70">
            Create, join and inspect meeting transcripts, messages and
            recordings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            className="input input-bordered"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="btn btn-primary" onClick={createMeeting}>
            Create Meeting
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MeetingList
          meetings={meetings}
          loading={loading}
          onRefresh={fetchMeetings}
          onSelect={setCurrentMeetingId}
        />
        <MeetingDetails meetingId={currentMeetingId} />
      </div>
    </div>
  );
}
