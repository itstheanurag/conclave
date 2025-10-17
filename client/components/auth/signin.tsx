"use client";

import { useAtom } from "jotai";
import {
  authFormAtom,
  authModeAtom,
  loadingSignInFormAtom,
  isLoginFormValidAtom,
} from "@/atoms/auth";
import { handleEmailLogin } from "@/actions/auth";
import { GithubSignInButton } from "@/components/ui/buttons/github/signIn";
import { useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [form, setForm] = useAtom(authFormAtom);
  const [, setAuthMode] = useAtom(authModeAtom);
  const [loading, setLoading] = useAtom(loadingSignInFormAtom);
  const [isValid] = useAtom(isLoginFormValidAtom);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");

    if (rememberedEmail) {
      setForm((prev) => ({ ...prev, email: rememberedEmail }));
    }
  }, [setForm]);

  const updateField = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    const result = await handleEmailLogin();
    setLoading(false);

    if (result) window.location.href = "/dashboard";
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
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label mb-1">
              <span className="label-text font-medium">Password</span>
            </label>

            <div className="relative">
              <input
                type={form.showPassword ? "text" : "password"}
                placeholder="********"
                className="input input-bordered w-full pr-10"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => updateField("showPassword", !form.showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {form.showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="form-control flex flex-row items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="w-4 h-4 rounded-sm checkbox-primary"
                  checked={form.rememberMe}
                  onChange={(e) => updateField("rememberMe", e.target.checked)}
                />
                <label htmlFor="rememberMe" className="label-text">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                className="label-text-alt link link-hover"
                onClick={() => updateField("showPassword", !form.showPassword)}
              >
                {form.showPassword ? "Hide" : "Show"} password
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !isValid}
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
