"use client";
import React from "react";
import { Video, Users, Code, Shield } from "lucide-react";

const features = [
  {
    title: "High-Quality Video",
    description:
      "Crystal-clear video meetings with low latency and optimized performance for every device.",
    icon: <Video className="h-6 w-6 text-white" />,
    color: "bg-gradient-to-r from-purple-500 to-indigo-500",
  },
  {
    title: "Team Collaboration",
    description:
      "Invite your team, share screens, chat, and collaborate seamlessly in real-time.",
    icon: <Users className="h-6 w-6 text-white" />,
    color: "bg-gradient-to-r from-green-400 to-teal-500",
  },
  {
    title: "Developer APIs",
    description:
      "Integrate Conclave APIs into your apps and build Zoom-like experiences in minutes.",
    icon: <Code className="h-6 w-6 text-white" />,
    color: "bg-gradient-to-r from-yellow-400 to-orange-500",
  },
  {
    title: "Secure & Private",
    description:
      "End-to-end encryption ensures your meetings and data stay safe and confidential.",
    icon: <Shield className="h-6 w-6 text-white" />,
    color: "bg-gradient-to-r from-red-400 to-pink-500",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-base-100 py-20 px-6 sm:px-10 lg:px-20 relative overflow-hidden">
      {/* Optional: decorative background shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full -z-10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -z-10 blur-3xl"></div>

      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-12">
          Features of Conclave
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-base-200"
            >
              <div
                className={`flex items-center justify-center w-12 h-12 mb-4 rounded-full ${feature.color} hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-base-content/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
