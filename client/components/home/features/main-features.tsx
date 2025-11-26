"use client";
import { motion } from "framer-motion";
import React from "react";

// ==========================================
// 1. SKELETONS
// ==========================================

// --- SKELETON 1: Coding Interface ---
const CodeSkeleton = () => (
  <div className="w-full h-full bg-base-300/50 relative flex flex-col p-4 border-t border-base-content/5">
    {/* Header Dots */}
    <div className="flex gap-2 mb-4">
      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
    </div>

    {/* Typing Animation Lines */}
    <div className="space-y-3">
      <motion.div
        initial={{ width: "0%" }}
        whileInView={{ width: "40%" }}
        transition={{ duration: 1, delay: 0.2 }}
        className="h-2 bg-primary/40 rounded w-1/3"
      />
      <motion.div
        initial={{ width: "0%" }}
        whileInView={{ width: "70%" }}
        transition={{ duration: 1, delay: 0.4 }}
        className="h-2 bg-base-content/20 rounded w-2/3 ml-4"
      />
      {/* Active Line with Cursor */}
      <div className="flex items-center gap-1 ml-4 pt-2">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 60 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="h-2 bg-secondary/40 rounded"
        />
        <motion.div
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-1 h-4 bg-primary"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="ml-2 px-2 py-0.5 bg-primary text-[8px] text-primary-content rounded-full"
        >
          Dev_1
        </motion.div>
      </div>
    </div>
  </div>
);

// --- SKELETON 2: Kanban Board ---
const KanbanSkeleton = () => (
  <div className="w-full h-full bg-base-300/50 relative border-t border-base-content/5 p-4 grid grid-cols-3 gap-2">
    {[0, 1, 2].map((col) => (
      <div
        key={col}
        className="bg-base-200/50 rounded p-2 flex flex-col gap-2 h-full"
      >
        <div className="w-8 h-1.5 bg-base-content/10 rounded mb-1" />
        <div className="w-full h-10 bg-base-100 rounded border border-white/5" />
        {/* Animated Moving Card */}
        {col === 1 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
            className="w-full h-10 bg-base-100 rounded border-l-2 border-primary flex items-center justify-center shadow-sm"
          >
            <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] text-primary">
              ✓
            </div>
          </motion.div>
        )}
      </div>
    ))}
  </div>
);

// --- SKELETON 3: Terminal / CLI ---
const TerminalSkeleton = () => (
  <div className="w-full h-full bg-[#1e1e1e] relative border-t border-base-content/5 p-4 font-mono text-[10px] text-gray-300 flex flex-col gap-2">
    <div className="flex gap-2 text-gray-500 border-b border-gray-700 pb-2 mb-1">
      <span>terminal</span>
      <span>console</span>
    </div>

    <div className="flex gap-2">
      <span className="text-green-500">➜</span>
      <span>git push origin main</span>
    </div>

    <div className="text-gray-500">Compressing objects: 100% (12/12)...</div>

    <div className="flex items-center gap-2">
      <div className="text-blue-400">Remote:</div>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "60%" }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="h-1.5 bg-blue-500/50 rounded-full"
      />
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 2 }}
      className="text-green-400 mt-1"
    >
      Deployed to production (2.4s)
    </motion.div>
  </div>
);

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

export default function MainFeatures() {
  return (
    <section className="py-24 px-6 bg-base-100">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          The Core Workflow
        </h2>
        <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
          Everything your team needs to ship, debug, and deploy together.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-2 md:gap-0 lg:grid-cols-3 bg-base-100 border border-base-content/10 divide-y lg:divide-y-0 lg:divide-x divide-base-content/10 overflow-hidden">
        {/* --- CARD 1: CODE --- */}
        <div className="group relative bg-base-100 hover:bg-base-200/50 transition-colors duration-500 flex flex-col h-[500px]">
          <div className="p-8 flex-1">
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary mb-4">
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
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Live Code Collaboration</h3>
            <p className="text-base-content/70 text-sm leading-relaxed">
              Multi-cursor editing with syntax highlighting. It's like VS Code,
              but inside your video call.
            </p>
          </div>
          {/* Skeleton pinned to bottom */}
          <div className="h-64 mt-auto w-full">
            <CodeSkeleton />
          </div>
        </div>

        {/* --- CARD 2: KANBAN --- */}
        <div className="group relative bg-base-100 hover:bg-base-200/50 transition-colors duration-500 flex flex-col h-[500px]">
          <div className="p-8 flex-1">
            <div className="w-10 h-10 bg-secondary/10 flex items-center justify-center text-secondary mb-4">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">
              Integrated Project Boards
            </h3>
            <p className="text-base-content/70 text-sm leading-relaxed">
              Don't tab switch. Move tickets, assign bugs, and update sprints
              without leaving the conversation.
            </p>
          </div>
          <div className="h-64 mt-auto w-full">
            <KanbanSkeleton />
          </div>
        </div>

        {/* --- CARD 3: TERMINAL (NEW) --- */}
        <div className="group relative bg-base-100 hover:bg-base-200/50 transition-colors duration-500 flex flex-col h-[500px]">
          <div className="p-8 flex-1">
            <div className="w-10 h-1 bg-accent/10 flex items-center justify-center text-accent mb-4">
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
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Shared Terminal</h3>
            <p className="text-base-content/70 text-sm leading-relaxed">
              Run commands, check build logs, and deploy to production together
              in a shared shell instance.
            </p>
          </div>
          <div className="h-64 mt-auto w-full">
            <TerminalSkeleton />
          </div>
        </div>
      </div>
    </section>
  );
}
