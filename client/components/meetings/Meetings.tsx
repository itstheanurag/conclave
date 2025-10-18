"use client";
import { useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { meetingsAtom, currentMeetingAtom, usernameAtom } from "@/atoms";
import { toast } from "sonner";
import MeetingList from "./MeetingLists";
import MeetingDetails from "./MeetingDetails";
import { mockMeetings } from "@/data/meetings/meetings";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useAtom(meetingsAtom);
  
  const [currentMeeting, setCurrentMeeting] = useAtom(currentMeetingAtom);
  const [username, setUsername] = useAtom(usernameAtom);
  const [loading, setLoading] = useState(false);

  async function fetchMeetings() {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setMeetings(mockMeetings);
    } catch (err) {
      console.error(err);
      toast.error("Could not load meetings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMeetings();
  }, []);

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
          <button
            className="btn btn-primary"
            onClick={() => toast.success("Meeting created (dummy)")}
          >
            Create Meeting
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MeetingList
          meetings={meetings}
          loading={loading}
          onRefresh={fetchMeetings}
          onSelect={(id) => setCurrentMeeting(id)}
        />
        <MeetingDetails meetingId={currentMeeting} />
      </div>
    </div>
  );
}
