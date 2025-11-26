"use client";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior FE Engineer @ Vercel",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    quote:
      "Finally, a video API that doesn't tank my CPU. The React hooks are incredibly intuitive.",
  },
  {
    name: "Alex Rivera",
    role: "CTO @ StartupX",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    quote:
      "We switched from Twilio Video in a weekend. The documentation is actual gold.",
  },
  {
    name: "Jordan Lee",
    role: "Indie Hacker",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    quote:
      "The sub-50ms latency is real. My remote pair programming sessions feel like we're in the same room.",
  },
  {
    name: "Emily Watson",
    role: "DevOps Lead",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    quote:
      "Security was our #1 concern. Their end-to-end encryption implementation is flawless.",
  },
  {
    name: "David Kim",
    role: "Product Designer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    quote:
      "The UI kit saved us months of design work. It's fully accessible and looks great out of the box.",
  },
];

// Duplicate the array to create a seamless loop
const allTestimonials = [...testimonials, ...testimonials, ...testimonials];

const MarqueeColumn = ({
  items,
  direction = "left",
  speed = 20,
}: {
  items: typeof testimonials;
  direction?: "left" | "right";
  speed?: number;
}) => {
  return (
    <div className="flex overflow-hidden relative w-full mask-gradient">
      {/* The Fade Masks for the edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-base-100 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-base-100 to-transparent z-10" />

      <motion.div
        initial={{ x: direction === "left" ? 0 : "-50%" }}
        animate={{ x: direction === "left" ? "-50%" : 0 }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="flex gap-6 py-4 flex-nowrap"
      >
        {items.map((t, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[350px] p-6 rounded-2xl bg-base-200/50 backdrop-blur-sm border border-base-content/5 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                src={t.image}
                alt={t.name}
              />
              <div>
                <div className="font-bold text-base-content">{t.name}</div>
                <div className="text-xs font-medium text-base-content/60">
                  {t.role}
                </div>
              </div>
            </div>
            <p className="text-base-content/80 text-sm leading-relaxed">
              "{t.quote}"
            </p>

            {/* Optional: Add stars or logo */}
            <div className="flex gap-1 mt-4 text-warning text-xs">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>★</span>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function Testimonials() {
  return (
    <section className="relative bg-base-100 py-24 sm:py-32 overflow-hidden">
      {/* 1. Reuse the Grid Background for consistency */}
      <div
        className="absolute inset-0 z-0 opacity-[0.1]" // Higher opacity to make dots pop
        style={{
          backgroundImage: `radial-gradient(circle 2px at 0.5px 0.5px, #000 100%, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-2">
              Community
            </h2>
            <p className="text-3xl font-bold tracking-tight text-base-content sm:text-5xl">
              Loved by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                10,000+
              </span>{" "}
              developers.
            </p>
            <p className="mt-4 text-lg text-base-content/60 max-w-2xl mx-auto">
              From solo founders to enterprise engineering teams, developers
              choose us for our reliability and developer experience.
            </p>
          </motion.div>
        </div>

        {/* Marquee Row 1 (Moving Left) */}
        <div className="mb-6">
          <MarqueeColumn items={allTestimonials} direction="left" speed={40} />
        </div>

        {/* Marquee Row 2 (Moving Right) */}
        <div>
          <MarqueeColumn items={allTestimonials} direction="right" speed={50} />
        </div>
      </div>
    </section>
  );
}
