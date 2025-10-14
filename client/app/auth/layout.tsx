import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex items-center justify-center bg-base-400 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 shadow-xl rounded-2xl overflow-hidden max-w-7xl w-full max-h-[80vh] bg-base-300">
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

        {/* RIGHT SIDE (Form) */}
        <div className="flex items-center justify-center p-6 bg-base-300">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
