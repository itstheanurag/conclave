"use client";

import { useAtom } from "jotai";
import {
  loginAtom,
  authModeAtom,
  loadingAtom,
  rememberMeAtom,
  isLoginFormValidAtom,
} from "@/atoms";
import { handleEmailLogin } from "@/actions/auth";
import { GithubSignInButton } from "@/components/ui/buttons/github/signIn";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [login, setLogin] = useAtom(loginAtom);
  const [, setAuthMode] = useAtom(authModeAtom);
  const [loading] = useAtom(loadingAtom);
  const [rememberMe, setRememberMe] = useAtom(rememberMeAtom);
  const [isValid] = useAtom(isLoginFormValidAtom);
  const router = useRouter();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) setLogin({ email: rememberedEmail });
  }, [setLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) return;

    const result = await handleEmailLogin();

    console.log(result);
    if (result) {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="card py-4 bg-base-300">
      <div className="card-body">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="divider">Or continue with</div>

          <GithubSignInButton />

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
