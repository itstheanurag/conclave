import React from "react";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-base-200 min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
        <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-left">
          <div className="badge badge-outline badge-primary badge-md md:badge-lg text-base font-medium px-4 md:px-6 py-2 md:py-3 inline-flex items-center gap-2">
            Empower Your Meetings
            <span className="rounded-full bg-primary w-2 h-2 md:w-3 md:h-3"></span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug md:leading-tight text-base-content">
            Conclave — The Future of{" "}
            <span className="text-primary">Online Collaboration</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-base-content/80 max-w-md md:max-w-xl">
            Conclave is a secure and scalable meeting platform for individuals
            and businesses. Developers can access powerful APIs to build
            real-time video and chat experiences — just like Zoom, but with
            complete control.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
            <button className="btn btn-primary rounded-lg">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button className="btn btn-outline rounded-lg">View Docs</button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex justify-center md:justify-end w-full">
          <div className="w-64 sm:w-80 md:w-96 lg:w-[28rem] h-64 sm:h-80 md:h-96 lg:h-[28rem] bg-primary/10 rounded-2xl flex items-center justify-center">
            <p className="text-primary font-semibold">[ Meeting Preview ]</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
