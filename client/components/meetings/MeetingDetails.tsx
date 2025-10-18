"use client";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { meetingDetailsAtom, currentMeetingAtom, meetingsAtom } from "@/atoms";
import { MeetingDetails as MeetingDetailsType } from "@/types";
import { mockMeetingDetails } from "@/data/meetings/meetings";
import MeetingMessages from "./MeetingMessages";
import MeetingRecordings from "./MeetingRecordings";
import MeetingParticipants from "./MeetingParticipants";

export default function MeetingDetails({
  meetingId,
}: {
  meetingId?: string | null;
}) {
  const [details, setDetails] = useAtom(meetingDetailsAtom);
  const [loading, setLoading] = useState(false);
  const [meetings] = useAtom(meetingsAtom);

  useEffect(() => {
    if (!meetingId) return;

    setLoading(true);

    setTimeout(() => {
      const data =
        mockMeetingDetails[meetingId] ??
        ({
          id: meetingId,
          title: `Meeting ${meetingId}`,
          participants: [],
          messages: [],
          recordings: [],
        } as MeetingDetailsType);

      setDetails(data);
      setLoading(false);
    }, 400);
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
        <h2 className="text-xl font-bold">{details.title}</h2>
        <div className="text-sm text-base-content/60">ID: {details.id}</div>
      </div>

      <MeetingMessages messages={details.messages ?? []} />
      <MeetingRecordings recordings={details.recordings ?? []} />
      <MeetingParticipants participants={details.participants ?? []} />
    </div>
  );
}
