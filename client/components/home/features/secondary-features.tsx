"use client";
import { motion } from "framer-motion";
import React from "react";

// ==========================================
// 1. MINI SKELETONS (INTERACTIVE)
// ==========================================

const TranscriptionSkeleton = () => (
  <div className="w-full h-full p-4 flex flex-col gap-3">
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
  <div className="w-full h-full relative p-4 flex items-center justify-center">
    <div className="absolute inset-4 border-2 border-dashed border-base-content/10 rounded-lg" />
    {/* Main Window */}
    <motion.div
      className="w-3/4 h-3/4 bg-base-300 rounded-lg shadow-xl border border-white/5 relative overflow-hidden"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="h-4 bg-base-content/10 w-full mb-2" />
      <div className="p-2 space-y-2">
        <div className="h-2 bg-base-content/20 w-1/2 rounded" />
        <div className="h-16 bg-primary/10 w-full rounded" />
      </div>

      {/* Floating Cursor */}
      <motion.div
        className="absolute bottom-4 right-4 w-3 h-3 bg-primary rounded-full"
        animate={{ x: [0, -20, 0], y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  </div>
);

const RecordingSkeleton = () => (
  <div className="w-full h-full p-6 flex flex-col justify-center">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-3 h-3 bg-red-500 rounded-full"
        />
        <span className="text-[10px] font-mono opacity-50">REC 00:24:12</span>
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
  <div className="w-full h-full p-6 flex flex-col justify-center gap-3">
    {["React", "Vue", "Svelte"].map((label, i) => (
      <div key={i} className="group cursor-pointer">
        <div className="flex justify-between text-[10px] opacity-60 mb-1">
          <span>{label}</span>
          <span>{30 + i * 10}%</span>
        </div>
        <div className="w-full h-2 bg-base-300 rounded-full overflow-hidden">
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
  <div className="w-full h-full p-4 flex flex-col justify-end gap-2">
    <motion.div
      className="self-start bg-base-300 p-2 rounded-lg rounded-tl-none max-w-[80%]"
      whileHover={{ scale: 1.05, originX: 0 }}
    >
      <div className="h-2 w-20 bg-base-content/20 rounded" />
    </motion.div>
    <motion.div
      className="self-end bg-primary/20 p-2 rounded-lg rounded-tr-none max-w-[80%]"
      whileHover={{ scale: 1.05, originX: 1 }}
    >
      <div className="h-2 w-24 bg-primary/40 rounded" />
    </motion.div>
    <motion.div
      className="self-start bg-base-300 p-2 rounded-lg rounded-tl-none max-w-[80%]"
      whileHover={{ scale: 1.05, originX: 0 }}
    >
      <div className="h-2 w-16 bg-base-content/20 rounded" />
    </motion.div>
  </div>
);

const RoomsSkeleton = () => (
  <div className="w-full h-full p-6 grid grid-cols-2 gap-3 content-center">
    {[1, 2, 3, 4].map((i) => (
      <motion.div
        key={i}
        className="aspect-square rounded-lg border border-dashed border-base-content/20 flex items-center justify-center hover:bg-base-200 hover:border-solid hover:border-primary/50 transition-all"
        whileHover={{ scale: 1.1 }}
      >
        <div className="w-8 h-8 rounded-full bg-base-300" />
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
    colSpan: "lg:col-span-1",
  },
  {
    title: "4K Screen Share",
    desc: "60fps sharing with separate system audio channels.",
    skeleton: ScreenShareSkeleton,
    colSpan: "lg:col-span-1",
  },
  {
    title: "Cloud Recording",
    desc: "Indexed HD replays automatically saved to your dashboard.",
    skeleton: RecordingSkeleton,
    colSpan: "lg:col-span-1",
  },
  {
    title: "Live Polls",
    desc: "Instant team voting, consensus checks, and results.",
    skeleton: PollsSkeleton,
    colSpan: "lg:col-span-1",
  },
  {
    title: "Persistent Chat",
    desc: "Chat history saved by project context forever.",
    skeleton: ChatSkeleton,
    colSpan: "lg:col-span-1",
  },
  {
    title: "Project Rooms",
    desc: "Dedicated workspaces per repo or team channel.",
    skeleton: RoomsSkeleton,
    colSpan: "lg:col-span-1",
  },
];

export default function SecondaryFeatures() {
  return (
    <section className="py-24 bg-base-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Everything else you need</h2>
          <p className="text-lg text-base-content/60">
            A comprehensive toolkit designed for high-performance engineering
            teams.
          </p>
        </div>

        {/* THE GRID */}
        {/* We use negative margins (-ml-px -mt-px) to make borders collapse into a single line */}
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
                bg-base-100 hover:bg-base-200/30 transition-colors duration-300
              `}
            >
              {/* Corner "Plus" Marker for Technical Feel */}
              <div className="absolute -bottom-1.5 -right-1.5 z-10 text-base-content/20">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5.5 0V11" stroke="currentColor" strokeWidth="0.5" />
                  <path d="M0 5.5H11" stroke="currentColor" strokeWidth="0.5" />
                </svg>
              </div>

              {/* Card Content */}
              <div className="h-[400px] flex flex-col">
                {/* 1. The Interactive Skeleton (Top 60%) */}
                <div className="flex-1 p-8 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-base-100 border border-base-content/5 rounded-xl overflow-hidden group-hover:shadow-lg transition-shadow duration-500 relative">
                    {/* Subtle grid background inside skeleton */}
                    <div
                      className="absolute inset-0 opacity-[0.03]"
                      style={{
                        backgroundImage:
                          "radial-gradient(#000 1px, transparent 1px)",
                        backgroundSize: "10px 10px",
                      }}
                    ></div>

                    {/* Render the specific skeleton */}
                    <feature.skeleton />
                  </div>
                </div>

                {/* 2. The Text Content (Bottom 40%) */}
                <div className="px-8 pb-8 pt-2">
                  <div className="w-10 h-10 mb-4 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {/* We reuse a generic icon or you can pass specific icons */}
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-base-content group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-base-content/60 leading-relaxed max-w-xs">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
