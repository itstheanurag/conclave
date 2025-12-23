"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import MeetingMessages from "./MeetingMessages";
import MeetingRecordings from "./MeetingRecordings";
import MeetingParticipants from "./MeetingParticipants";
import { useMeetingsStore } from "@/stores/meetingsStore";

export default function MeetingDetails({
  meetingId,
}: {
  meetingId?: string | null;
}) {
  const { meetingDetails: details, setMeetingDetails: setDetails } = useMeetingsStore();
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:8080/api";

  useEffect(() => {
    if (!meetingId) return;

    setLoading(true);

    fetch(`${API_URL}/meetings/${meetingId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        setDetails(data);
      })
      .catch((err) => {
        console.error(err);
        setDetails(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [meetingId, setDetails]);

  if (!meetingId)
    return (
      <div className="col-span-2 card bg-base-200 shadow-sm p-4 text-center py-8">
        Select a meeting to view details
      </div>
    );

  if (loading || !details)
    return (
      <div className="col-span-2 card bg-base-200 shadow-sm p-4 text-center py-8">
        Loading details…
      </div>
    );

  return (
    <div className="col-span-2 card bg-base-200 shadow-sm p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{details.title}</h2>
          <div className="text-sm text-base-content/60">ID: {details.id}</div>
        </div>
        <Link href={`/call/${details.id}`} className="btn btn-primary">
          Join Meeting
        </Link>
      </div>

      <MeetingMessages messages={details.messages ?? []} />
      <MeetingRecordings recordings={details.recordings ?? []} />
      <MeetingParticipants participants={details.participants ?? []} />
    </div>
  );
}
