"use client";
import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { loginAtom, authModeAtom } from "@/atoms/auth";
import { client } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LoginForm() {
  const [login, setLogin] = useAtom(loginAtom);
  const [, setAuthMode] = useAtom(authModeAtom);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) setLogin({ email: rememberedEmail });
  }, [setLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const t = toast.loading("Signing in...");

    try {
      const result = await client.signIn.email({
        email: login.email,
        password: login.password,
      });

      if (result.error) {
        toast.error(result.error.statusText, { id: t });
        return;
      }

      toast.success("Signed in successfully!", { id: t });

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", login.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in.", { id: t });
    }
  };

  return (
    <div className="card py-4 bg-base-300">
      <div className="card-body">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-control">
            <label className="label mb-1">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full focus:outline-none focus:ring-0 focus:border-base-300"
              required
              value={login.email}
              onChange={(e) => setLogin({ email: e.target.value })}
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
              className="input input-bordered w-full focus:outline-none focus:ring-0 focus:border-base-300 mb-1"
              required
              value={login.password}
              onChange={(e) => setLogin({ password: e.target.value })}
            />
            <div className="form-control flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="w-4 h-4 rounded-sm checkbox-primary"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe" className="label-text">
                  Remember me
                </label>
              </div>

              <a href="#" className="label-text-alt link link-hover">
                Forgot password?
              </a>
            </div>
          </div>

          {/* <div className="form-control flex-row items-center gap-3">
            <input
              type="checkbox"
              id="rememberMe"
              className="w-4 h-4 rounded-sm checkbox-primary"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe" className="label-text pl-3">
              Remember me
            </label>
          </div> */}

          <button type="submit" className="btn btn-primary w-full">
            Sign In
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
            Don’t have an account?{" "}
            <button
              type="button"
              className="link link-primary"
              onClick={() => setAuthMode("register")}
            >
              Create one
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
