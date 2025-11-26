"use client";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function GlobalNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1, // 1 for dark mode look, 0 for light
      diffuse: 1.2,
      mapSamples: 16000, // Number of dots (higher = more detailed countries)
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3], // Gray base
      markerColor: [0.1, 0.8, 1], // Cyan markers
      glowColor: [0.1, 0.1, 0.2], // Subtle glow
      markers: [
        // location: [latitude, longitude], size: 0.1
        { location: [37.7595, -122.4367], size: 0.05 }, // San Francisco
        { location: [40.7128, -74.006], size: 0.05 }, // New York
        { location: [51.5074, -0.1278], size: 0.05 }, // London
        { location: [12.9716, 77.5946], size: 0.05 }, // Bangalore
        { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
        { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
        { location: [-23.5505, -46.6333], size: 0.05 }, // Sao Paulo
      ],
      onRender: (state) => {
        // Very slow rotation
        state.phi = phi;
        phi += 0.003;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <section className="py-24 bg-base-100 overflow-hidden relative border-t border-base-content/5">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col lg:flex-row items-center gap-16">
        {/* TEXT CONTENT */}
        <div className="w-full lg:w-1/2 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Global Edge Network
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Local latency, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Global scale.
              </span>
            </h2>

            <p className="text-lg text-base-content/60 mb-8 max-w-lg leading-relaxed">
              We automatically route video traffic through the nearest edge
              server. With data centers in 24 regions, your users are never more
              than 50ms away.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-6 max-w-sm">
              <div className="pl-4 border-l-2 border-primary">
                <div className="text-3xl font-bold text-base-content mb-1">
                  24
                </div>
                <div className="text-xs text-base-content/50 uppercase tracking-wider font-bold">
                  Regions
                </div>
              </div>
              <div className="pl-4 border-l-2 border-secondary">
                <div className="text-3xl font-bold text-base-content mb-1">
                  99.9%
                </div>
                <div className="text-xs text-base-content/50 uppercase tracking-wider font-bold">
                  Reliability
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* THE GLOBE VISUAL */}
        <div className="w-full lg:w-1/2 relative flex items-center justify-center h-[600px]">
          {/* The Canvas (Globe) */}
          <div className="relative w-[600px] h-[600px] max-w-full aspect-square flex items-center justify-center">
            <canvas
              ref={canvasRef}
              style={{
                width: 600,
                height: 600,
                maxWidth: "100%",
                aspectRatio: 1,
              }}
            />
          </div>

          {/* Floating Connection Cards (Overlay) */}
          {/* Connection 1: NY to London */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-20 left-0 md:left-10 bg-base-100/80 backdrop-blur-md p-3 rounded-xl border border-base-content/10 shadow-xl flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-base-100 flex items-center justify-center text-[10px]">
                🇺🇸
              </div>
              <div className="w-8 h-8 rounded-full bg-secondary/20 border border-base-100 flex items-center justify-center text-[10px]">
                🇬🇧
              </div>
            </div>
            <div>
              <div className="text-xs font-bold">New York ↔ London</div>
              <div className="text-[10px] ">32ms latency</div>
            </div>
          </motion.div>

          {/* Connection 2: Tokyo to Sydney */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-32 right-0 md:right-10 bg-base-100/80 backdrop-blur-md p-3 rounded-xl border border-base-content/10 shadow-xl flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-base-100 flex items-center justify-center text-[10px]">
                🇯🇵
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-base-100 flex items-center justify-center text-[10px]">
                🇦🇺
              </div>
            </div>
            <div>
              <div className="text-xs font-bold">Tokyo ↔ Sydney</div>
              <div className="text-[10px]">45ms latency</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
