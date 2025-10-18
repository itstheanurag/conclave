"use client";
import React from "react";
import { MessageSquare, Send, X } from "lucide-react";

interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  time: string;
}

interface MeetingChatProps {
  messages: ChatMessage[];
  message: string;
  setMessage: (msg: string) => void;
  handleSendMessage: () => void;
  onClose: () => void;
}

const MeetingChat = ({
  messages,
  message,
  setMessage,
  handleSendMessage,
  onClose,
}: MeetingChatProps) => {
  return (
    <div className="w-80 bg-base-200 border-l border-base-300 flex flex-col">
      <div className="p-4 border-b border-base-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <h2 className="font-semibold">Chat</h2>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="chat chat-start">
            <div className="chat-header flex items-center gap-2">
              {msg.sender}
              <time className="text-xs opacity-50">{msg.time}</time>
            </div>
            <div className="chat-bubble">{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-base-300">
        <div className="join w-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="input input-bordered join-item flex-1"
          />
          <button
            onClick={handleSendMessage}
            className="btn btn-primary join-item"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingChat;
