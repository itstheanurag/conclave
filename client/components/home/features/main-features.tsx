"use client";
import { motion } from "framer-motion";
import React from "react";

// --- SKELETON 1: The Coding Interface ---
const CodeSkeleton = () => (
  <div className="w-full h-64 bg-base-300 rounded-xl overflow-hidden relative border border-white/5 flex flex-col p-4">
    {/* Header Dots */}
    <div className="flex gap-2 mb-4">
      <div className="w-3 h-3 rounded-full bg-red-500/20" />
      <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
      <div className="w-3 h-3 rounded-full bg-green-500/20" />
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
      <motion.div
        initial={{ width: "0%" }}
        whileInView={{ width: "50%" }}
        transition={{ duration: 1, delay: 0.6 }}
        className="h-2 bg-base-content/20 rounded w-1/2 ml-4"
      />
      {/* Active Line with Cursor */}
      <div className="flex items-center gap-1 ml-4 pt-2">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 100 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="h-2 bg-secondary/40 rounded"
        />
        <motion.div
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-1 h-4 bg-primary"
        />
        {/* User Tag */}
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

// --- SKELETON 2: The Kanban Board ---
const KanbanSkeleton = () => (
  <div className="w-full h-64 bg-base-300 rounded-xl overflow-hidden relative border border-white/5 p-4 grid grid-cols-3 gap-3">
    {[0, 1, 2].map((col) => (
      <div
        key={col}
        className="bg-base-200/50 rounded-lg p-2 flex flex-col gap-2 h-full"
      >
        {/* Column Header */}
        <div className="w-12 h-2 bg-base-content/10 rounded mb-2" />

        {/* Static Cards */}
        <div className="w-full h-16 bg-base-100 rounded border border-white/5" />
        {col === 0 && (
          <div className="w-full h-16 bg-base-100 rounded border border-white/5" />
        )}

        {/* Animated Moving Card (In middle column) */}
        {col === 1 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
            className="w-full h-16 bg-gradient-to-r from-primary/20 to-secondary/20 rounded border border-primary/30 flex items-center justify-center"
          >
            <div className="w-8 h-8 rounded-full bg-base-100/50 flex items-center justify-center text-[10px]">
              ✓
            </div>
          </motion.div>
        )}
      </div>
    ))}
  </div>
);

export default function MainFeatures() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Core Workflow
        </h2>
        <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
          The two pillars of effective remote engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group relative bg-base-200 rounded-3xl p-1 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="bg-base-100 rounded-[22px] p-8 h-full flex flex-col">
            <div className="mb-8">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <svg
                  className="w-6 h-6"
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
              <h3 className="text-2xl font-bold mb-2">
                Live Code Collaboration
              </h3>
              <p className="text-base-content/70">
                Multi-cursor editing with syntax highlighting. It's like VS
                Code, but inside your video call.
              </p>
            </div>
            <div className="mt-auto">
              <CodeSkeleton />
            </div>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="group relative bg-base-200 rounded-3xl p-1 overflow-hidden hover:shadow-2xl hover:shadow-secondary/5 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="bg-base-100 rounded-[22px] p-8 h-full flex flex-col">
            <div className="mb-8">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                <svg
                  className="w-6 h-6"
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
              <h3 className="text-2xl font-bold mb-2">
                Integrated Project Boards
              </h3>
              <p className="text-base-content/70">
                Don't tab switch. Move tickets, assign bugs, and update sprints
                without leaving the conversation.
              </p>
            </div>
            <div className="mt-auto">
              <KanbanSkeleton />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
