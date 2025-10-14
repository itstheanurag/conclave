"use client";
import React from "react";
import { Video, Users, Code, Shield, Lock, Database } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const integrations = [
  { Icon: Video, name: "Video", color: "from-purple-500 to-indigo-500" },
  { Icon: Users, name: "Team", color: "from-green-400 to-teal-500" },
  { Icon: Code, name: "APIs", color: "from-yellow-400 to-orange-500" },
  { Icon: Shield, name: "Security", color: "from-red-400 to-pink-500" },
  { Icon: Lock, name: "Encryption", color: "from-indigo-400 to-purple-500" },
  { Icon: Database, name: "Database", color: "from-teal-400 to-cyan-500" },
];

export default function IntegrationsSection() {
  return (
    <section className="py-24 md:py-32 bg-base-100 relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-6">
          Integrate with your favorite tools
        </h2>
        <p className="text-base-content/70 mb-12">
          Connect seamlessly with popular platforms and services to enhance your
          workflow.
        </p>

        {/* Rotating circular integration grid */}
        <div className="relative mx-auto aspect-square w-[22rem] flex items-center justify-center">
          {integrations.map((integration, idx) => {
            const angle = (360 / integrations.length) * idx;
            return (
              <IntegrationCard
                key={idx}
                className="absolute"
                style={{
                  transform: `rotate(${angle}deg) translate(9rem) rotate(-${angle}deg)`,
                }}
                color={integration.color}
              >
                <integration.Icon className="w-6 h-6 text-white" />
              </IntegrationCard>
            );
          })}

          {/* Center Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <IntegrationCard isCenter color="from-primary to-secondary">
              <Video className="w-8 h-8 text-white" />
            </IntegrationCard>
          </div>
        </div>

        <div className="mt-12">
          <div className="mt-12">
            <Link href="#" className="btn btn-outline btn-sm">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  children,
  className,
  isCenter = false,
  color,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  isCenter?: boolean;
  color?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      style={style}
      className={cn(
        "relative z-30 flex items-center justify-center size-12 rounded-full shadow-lg transition-transform duration-500 hover:scale-110",
        isCenter
          ? `size-16 bg-gradient-to-tr ${color || "from-primary to-secondary"}`
          : `size-12 bg-gradient-to-tr ${color || "from-base-300 to-base-200"}`,
        className
      )}
    >
      <div className={cn("m-auto size-fit *:size-5", isCenter && "*:size-8")}>
        {children}
      </div>
    </div>
  );
};
