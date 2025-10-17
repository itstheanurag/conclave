import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex items-center justify-center overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 shadow-xl rounded-2xl overflow-hidden max-w-7xl w-full max-h-[80vh]">
        {/* LEFT SIDE */}
        <div className="relative hidden md:flex items-center justify-center bg-base-200">
          <div className="relative z-20 text-center px-8">
            <h2 className="text-4xl font-extrabold text-primary mb-3">
              Welcome to Conclave
            </h2>
            <p className="text-base-content/70 font-medium max-w-sm mx-auto">
              Join meetings, collaborate in real-time, and stay connected with
              your team.{" "}
              <span className="text-primary font-semibold">
                Login or register to continue.
              </span>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (Desktop Form) */}
        <div className="hidden md:flex items-center justify-center p-6 bg-base-300">
          <div className="w-full max-w-md px-4 sm:px-6">{children}</div>
        </div>

        {/* MOBILE FORM */}
        <div className="w-full px-4 sm:px-6 md:hidden">{children}</div>
      </div>
    </div>
  );
}
