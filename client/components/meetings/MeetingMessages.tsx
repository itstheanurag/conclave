"use client";
import React, { useState } from "react";

export default function MeetingMessages({ messages }: { messages: any[] }) {
  const [text, setText] = useState("");

  return (
    <div className="bg-base-100 rounded p-3">
      <div className="text-sm text-base-content/60 mb-2">Messages</div>
      <div className="max-h-48 overflow-auto space-y-2">
        {messages.length === 0 ? (
          <div className="text-sm text-base-content/60">No messages yet</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="p-2 rounded bg-base-200">
              <div className="text-xs text-base-content/60">{m.author}</div>
              <div>{m.text}</div>
            </div>
          ))
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          className="input input-bordered flex-1"
          placeholder="Write a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => setText("")}>
          Send
        </button>
      </div>
    </div>
  );
}
