"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content flex-col lg:flex-row-reverse max-w-7xl gap-12 lg:gap-20">
        {/* Right side - Visual element */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full lg:w-1/2"
        >
          <div className="mockup-window border border-base-300 bg-base-200 shadow-2xl">
            <div className="bg-base-300 flex justify-center px-4 py-16">
              {/* Video call mockup */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="aspect-video bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <div className="avatar online">
                    <div className="w-16 rounded-full bg-base-100">
                      <svg className="w-full h-full p-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                  <div className="avatar online">
                    <div className="w-16 rounded-full bg-base-100">
                      <svg className="w-full h-full p-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                  <div className="avatar online">
                    <div className="w-16 rounded-full bg-base-100">
                      <svg className="w-full h-full p-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <div className="loading loading-spinner loading-lg text-primary"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -left-6 badge badge-lg badge-primary gap-2 shadow-lg"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            100+ Users
          </motion.div>
          
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-6 -right-6 badge badge-lg badge-secondary gap-2 shadow-lg"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Enterprise Ready
          </motion.div>
        </motion.div>

        {/* Left side - Content */}
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge badge-primary badge-outline mb-4">Powered by WebRTC</div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Video Conferencing
              <span className="block text-primary mt-2">Made Simple</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="py-6 text-lg text-base-content/70"
          >
            Build secure, scalable video applications with our developer-friendly platform. 
            From startups to enterprises, Conclave powers real-time communication at any scale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/signup">
              <button className="btn btn-primary btn-lg">
                Get Started Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </Link>
            <Link href="/about">
              <button className="btn btn-outline btn-lg">
                View Demo
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <div className="stats stats-vertical sm:stats-horizontal shadow bg-base-200">
              <div className="stat place-items-center">
                <div className="stat-value text-primary">99.9%</div>
                <div className="stat-desc">Uptime</div>
              </div>
              <div className="stat place-items-center">
                <div className="stat-value text-secondary">&lt;50ms</div>
                <div className="stat-desc">Latency</div>
              </div>
              <div className="stat place-items-center">
                <div className="stat-value text-accent">10K+</div>
                <div className="stat-desc">Developers</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}