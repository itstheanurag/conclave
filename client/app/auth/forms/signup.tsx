"use client";
import React from "react";
import { useAtom } from "jotai";
import {
  fullNameAtom,
  emailAtom,
  passwordAtom,
  confirmPasswordAtom,
  isRegisterFormValidAtom,
  authModeAtom,
} from "@/atoms/auth";
import { client } from "@/lib/auth-client";

export default function SignupForm() {
  const [fullName, setFullName] = useAtom(fullNameAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const [confirmPassword, setConfirmPassword] = useAtom(confirmPasswordAtom);
  const [isValid] = useAtom(isRegisterFormValidAtom);
  const [, setAuthMode] = useAtom(authModeAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      alert("Please fill out all fields correctly.");
      return;
    }

    try {
      const result = await client.signUp.email({
        email,
        password,
        name: fullName,
      });
      console.log("✅ Signup successful:", result);
    } catch (error) {
      console.error("❌ Signup failed:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="card bg-base-300">
      <div className="card-body">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Full name */}
          <div className="form-control">
            <label className="label mb-1">
              <span className="label-text font-medium">Full name</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="input input-bordered w-full"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label mb-1">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label mb-1">
              <span className="label-text font-medium">Password</span>
            </label>
            <input
              type="password"
              placeholder="********"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm password */}
          <div className="form-control">
            <label className="label mb-1">
              <span className="label-text font-medium">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="********"
              className="input input-bordered w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={!isValid}
          >
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
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            Sign in with GitHub
          </button>

          <p className="text-sm text-center mt-3">
            Already have an account?{" "}
            <button
              type="button"
              className="link link-primary"
              onClick={() => setAuthMode("login")}
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
