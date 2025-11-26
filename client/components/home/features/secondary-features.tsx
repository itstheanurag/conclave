"use client";
import { motion } from "framer-motion";
import React from "react";

// ==========================================
// 1. REUSING SKELETONS (Same as before)
// ==========================================

const TranscriptionSkeleton = () => (
  <div className="w-full h-full p-4 flex flex-col gap-3 bg-base-100 rounded-t-xl border-t border-x border-base-content/5">
    {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="flex gap-3"
        initial={{ opacity: 0.5 }}
        whileHover={{ opacity: 1 }}
      >
        <div className="w-6 h-6 rounded-full bg-base-300 shrink-0" />
        <div className="flex flex-col gap-2 w-full">
          <motion.div
            className="h-2 bg-base-content/20 rounded w-1/4"
            animate={{ width: ["25%", "30%", "25%"] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
          <motion.div
            className="h-2 bg-base-content/10 rounded w-3/4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
          />
        </div>
      </motion.div>
    ))}
  </div>
);

const ScreenShareSkeleton = () => (
  <div className="w-full h-full relative p-4 flex items-end justify-center bg-base-100 rounded-t-xl border-t border-x border-base-content/5">
    {/* Main Window */}
    <motion.div
      className="w-full h-32 bg-base-300 rounded-t-lg shadow-xl border border-white/5 relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="h-4 bg-base-content/10 w-full mb-2" />
      <div className="p-2 space-y-2">
        <div className="h-2 bg-base-content/20 w-1/2 rounded" />
        <div className="h-16 bg-primary/10 w-full rounded" />
      </div>

      <motion.div
        className="absolute bottom-4 right-4 w-3 h-3 bg-primary rounded-full"
        animate={{ x: [0, -20, 0], y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  </div>
);

const RecordingSkeleton = () => (
  <div className="w-full h-full p-6 flex flex-col justify-end bg-base-100 rounded-t-xl border-t border-x border-base-content/5">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 bg-red-500 rounded-full"
        />
        <span className="text-[10px] font-mono opacity-50">REC</span>
      </div>
    </div>
    <div className="w-full h-12 bg-base-300 rounded-lg flex items-end gap-1 p-2 overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="w-full bg-primary/40 rounded-t"
          animate={{ height: ["20%", "80%", "40%"] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </div>
  </div>
);

const PollsSkeleton = () => (
  <div className="w-full h-full p-6 flex flex-col justify-end gap-3 bg-base-100 rounded-t-xl border-t border-x border-base-content/5">
    {["React", "Vue", "Svelte"].map((label, i) => (
      <div key={i} className="group cursor-pointer">
        <div className="flex justify-between text-[10px] opacity-60 mb-1">
          <span>{label}</span>
          <span>{30 + i * 10}%</span>
        </div>
        <div className="w-full h-1.5 bg-base-300 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              i === 0 ? "bg-primary" : "bg-base-content/20"
            } rounded-full`}
            initial={{ width: "0%" }}
            whileInView={{ width: `${30 + i * 10}%` }}
            whileHover={{ width: `${40 + i * 10}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    ))}
  </div>
);

const ChatSkeleton = () => (
  <div className="w-full h-full p-4 flex flex-col justify-end gap-2 bg-base-100 rounded-t-xl border-t border-x border-base-content/5">
    <motion.div
      className="self-start bg-base-300 p-2 rounded-lg rounded-tl-none max-w-[80%]"
      whileHover={{ scale: 1.05, originX: 0 }}
    >
      <div className="h-2 w-12 bg-base-content/20 rounded" />
    </motion.div>
    <motion.div
      className="self-end bg-primary/20 p-2 rounded-lg rounded-tr-none max-w-[80%]"
      whileHover={{ scale: 1.05, originX: 1 }}
    >
      <div className="h-2 w-20 bg-primary/40 rounded" />
    </motion.div>
  </div>
);

const RoomsSkeleton = () => (
  <div className="w-full h-full p-6 grid grid-cols-2 gap-3 content-end bg-base-100 rounded-t-xl border-t border-x border-base-content/5">
    {[1, 2].map((i) => (
      <motion.div
        key={i}
        className="aspect-video rounded-lg border border-dashed border-base-content/20 flex items-center justify-center hover:bg-base-200 hover:border-solid hover:border-primary/50 transition-all"
        whileHover={{ scale: 1.05 }}
      >
        <div className="w-6 h-6 rounded-full bg-base-300" />
      </motion.div>
    ))}
  </div>
);

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

const features = [
  {
    title: "AI Transcriptions",
    desc: "Auto-generated searchable notes with speaker detection.",
    skeleton: TranscriptionSkeleton,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
    ),
  },
  {
    title: "4K Screen Share",
    desc: "60fps sharing with separate system audio channels.",
    skeleton: ScreenShareSkeleton,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Cloud Recording",
    desc: "Indexed HD replays automatically saved to your dashboard.",
    skeleton: RecordingSkeleton,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Live Polls",
    desc: "Instant team voting, consensus checks, and results.",
    skeleton: PollsSkeleton,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    title: "Persistent Chat",
    desc: "Chat history saved by project context forever.",
    skeleton: ChatSkeleton,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
  },
  {
    title: "Project Rooms",
    desc: "Dedicated workspaces per repo or team channel.",
    skeleton: RoomsSkeleton,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
    ),
  },
];

export default function SecondaryFeatures() {
  return (
    <section className="py-24 bg-base-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold">Everything else you need</h2>
          <p className="text-lg text-base-content/60">
            A comprehensive toolkit designed for high-performance engineering
            teams.
          </p>
        </div>

        {/* THE GRID 
            - Negative margins (-ml-[1px]) allow borders to collapse
        */}
        <div className="flex flex-wrap border-t border-l border-base-content/10">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`
                group relative w-full md:w-1/2 lg:w-1/3 
                border-b border-r border-base-content/10 
                bg-base-100 hover:bg-base-300/30 transition-colors duration-300
                h-[400px] flex flex-col
              `}
            >
              {/* CROSSHAIR LOGIC 
                  Only show if it's NOT the last column (index+1 % 3 != 0) 
                  AND NOT the last row (index < total - 3)
                  This ensures it only appears at the center "cross" intersections.
              */}
              {(i + 1) % 3 !== 0 && i < features.length - 3 && (
                <div className="absolute -bottom-1.5 -right-1.5 z-20 text-base-content/30 hidden lg:block">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5.5 0V11" stroke="currentColor" strokeWidth="1" />
                    <path d="M0 5.5H11" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </div>
              )}

              {/* 1. TOP: Content */}
              <div className="p-8 pb-0">
            
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="size-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                      {feature.icon}
                    </div>

                    {/* Text Column */}
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold text-base-content group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>

                      <p className="text-xs text-base-content/60 leading-tighter ">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                
              </div>

              {/* 2. BOTTOM: Skeleton (Pushed to bottom using mt-auto) */}
              <div className="mt-auto h-48 w-full px-8 flex items-end justify-center overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                <feature.skeleton />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
