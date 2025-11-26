"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

// Mini component for the Audio Wave animation
const AudioWave = () => (
  <div className="flex items-end gap-[2px] h-4">
    {[1, 2, 3, 4].map((i) => (
      <motion.div
        key={i}
        className="w-1 bg-white rounded-full"
        animate={{
          height: ["20%", "100%", "20%"],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: i * 0.3,
        }}
      />
    ))}
  </div>
);

export default function HeroSection() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-base-100 flex items-center justify-center">
      {/* 1. The Grid Lines (Very subtle) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* 2. The Intersection Dots (Slightly more visible accent) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.1]" // Higher opacity to make dots pop
        style={{
          backgroundImage: `radial-gradient(circle 1px at 0.5px 0.5px, #000 100%, transparent 0)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Side - Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-base-200 border border-base-300 text-sm font-medium text-primary mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                v2.0 is now live
              </span>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
                Collaborate
                <br className="hidden lg:block" />
                <span className="bg-primary/20 p-2 rounded-xl">
                  Create
                </span>{" "}
                Conquer
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-base-content/70 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Low-latency video conferencing API for developers. Embed crystal
              clear video calls into your application in minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="btn btn-primary btn-lg w-full sm:w-auto shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all">
                  Start Building
                </button>
              </Link>
              <Link href="/demo" className="w-full sm:w-auto">
                <button className="btn btn-ghost btn-lg w-full sm:w-auto border border-base-300 bg-base-100/50 backdrop-blur-sm">
                  View Documentation
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              // divide-x adds the borders between children automatically
              className="mt-12 flex flex-wrap items-center justify-center lg:justify-start divide-x divide-base-content/20 border-t border-base-content/10 pt-8"
            >
              <div className="pr-8">
                <div className="text-4xl font-bold text-base-content tracking-tight">
                  99.99%
                </div>
                <div className="text-sm text-base-content/60 font-medium uppercase tracking-wider mt-1">
                  Uptime
                </div>
              </div>

              <div className="px-8">
                <div className="text-4xl font-bold text-base-content tracking-tight">
                  &lt;50ms
                </div>
                <div className="text-sm text-base-content/60 font-medium uppercase tracking-wider mt-1">
                  Latency
                </div>
              </div>

              <div className="pl-8">
                <div className="text-4xl font-bold text-base-content tracking-tight">
                  15k+
                </div>
                <div className="text-sm text-base-content/60 font-medium uppercase tracking-wider mt-1">
                  Developers
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 relative perspective-1000"
          >
            <div className="relative bg-base-100/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-4 shadow-2xl">
              {/* Fake UI Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex items-center gap-2 bg-base-content/5 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-medium text-base-content/60">
                    Encrypted
                  </span>
                </div>
              </div>

              {/* Video Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-video rounded-xl overflow-hidden relative group bg-base-300"
                  >
                    <div
                      className={`w-full h-full bg-gradient-to-br ${
                        i === 1
                          ? "from-indigo-500 to-purple-600"
                          : i === 2
                          ? "from-pink-500 to-rose-500"
                          : i === 3
                          ? "from-emerald-400 to-cyan-500"
                          : "from-amber-400 to-orange-500"
                      } opacity-80 group-hover:opacity-100 transition-opacity`}
                    >
                      {/* Fake Avatar */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-lg">
                          {String.fromCharCode(64 + i)}
                        </div>
                      </div>

                      {/* 3. UPGRADE: Active Speaker Indicator (For User 1) */}
                      {i === 1 && (
                        <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-md p-1 rounded-lg">
                          <AudioWave />
                        </div>
                      )}

                      {/* Name Tag */}
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/20 backdrop-blur-md rounded text-xs text-white flex items-center gap-2">
                        {i === 1 && (
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        )}
                        User {i} {i === 1 && "(You)"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call Quality Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -left-4 bg-base-100 p-4 rounded-xl shadow-xl border border-base-200 flex items-center gap-3 z-30"
              >
                <div
                  className="radial-progress text-success text-xs"
                  style={
                    { "--value": 98, "--size": "2rem" } as React.CSSProperties
                  }
                >
                  98
                </div>
                <div>
                  <div className="text-xs font-bold">Connection</div>
                  <div className="text-[10px] text-base-content/60">
                    Excellent
                  </div>
                </div>
              </motion.div>

              {/* Participants Badge */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -top-6 -right-4 bg-base-100 p-2 pr-4 rounded-xl shadow-xl border border-base-200 flex items-center gap-2 z-30"
              >
                <div className="avatar-group -space-x-3 rtl:space-x-reverse">
                  <div className="avatar w-8 h-8">
                    <div className="bg-primary text-primary-content grid place-items-center rounded-full text-xs">
                      A
                    </div>
                  </div>
                  <div className="avatar w-8 h-8">
                    <div className="bg-secondary text-secondary-content grid place-items-center rounded-full text-xs">
                      B
                    </div>
                  </div>
                  <div className="avatar w-8 h-8">
                    <div className="bg-accent text-accent-content grid place-items-center rounded-full text-xs">
                      C
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-base-content/70">
                  +5
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
