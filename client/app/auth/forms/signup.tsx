"use client";
import React from "react";

export default function SignupForm({ onSwitch }: { onSwitch?: () => void }) {
  return (
    <div className="card bg-base-300 shadow-lg">
      <div className="card-body">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Full name</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full"
              required
            />
            <label className="label">
              <span className="label-text-alt text-base-content/70">
                We won’t share your email.
              </span>
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <input
              type="password"
              placeholder="********"
              className="input input-bordered w-full"
              required
            />
            <label className="label">
              <span className="label-text-alt">
                Must be at least 8 characters.
              </span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Create Account
          </button>

          <div className="divider">Or continue with</div>

          <button type="button" className="btn btn-outline w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12..." />
            </svg>
            Sign up with GitHub
          </button>

          <p className="text-sm text-center mt-3">
            Already have an account?{" "}
            <button
              type="button"
              className="link link-primary"
              onClick={onSwitch}
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
