"use client";
import React, { useEffect, useRef } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  time: string;
  isMe?: boolean;
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-96 bg-base-200/80 backdrop-blur-sm border-l border-base-300/50 flex flex-col h-full">
      <div className="p-4 border-b border-base-300/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6" />
          <h2 className="font-bold text-lg">Meeting Chat</h2>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("chat", {
              "chat-start": !msg.isMe,
              "chat-end": msg.isMe,
            })}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-content font-bold">
                {msg.sender.charAt(0)}
              </div>
            </div>
            <div className="chat-header flex items-center gap-2 text-xs text-base-content/70">
              {msg.sender}
              <time className="opacity-80">{msg.time}</time>
            </div>
            <div
              className={cn("chat-bubble", {
                "chat-bubble-primary": msg.isMe,
              })}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-base-300/50">
        <div className="join w-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="input input-bordered join-item flex-1 focus:ring-primary focus:border-primary"
          />
          <button
            onClick={handleSendMessage}
            className="btn btn-primary join-item"
            disabled={!message.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingChat;
