"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Button from "../ui/Button";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Meeting {
  id: number;
  title: string;
  type: string;
}

export default function MeetingModal({ isOpen, onClose }: MeetingModalProps) {
  const [form, setForm] = useState({ title: "", type: "" });
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const handleCreateMeeting = () => {
    if (!form.title || !form.type) return;

    const newMeeting: Meeting = {
      id: meetings.length + 1,
      title: form.title,
      type: form.type,
    };

    setMeetings([...meetings, newMeeting]);
    setForm({ title: "", type: "" });
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-base-200 p-6 rounded-lg w-full max-w-md shadow-lg relative">
          <h3 className="font-bold text-lg mb-4">Create a Meeting</h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Meeting Title"
              className="input input-bordered w-full"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Meeting Type"
              className="input input-bordered w-full"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleCreateMeeting}>Create</Button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
