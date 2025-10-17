"use client";

import { useAtom } from "jotai";
import { Eye, EyeOff } from "lucide-react";
import {
  authFormAtom,
  authModeAtom,
  loadingSignUpFormAtom,
  isRegisterFormValidAtom,
} from "@/atoms/auth";
import { handleEmailSignup } from "@/actions";
import { GithubSignUpButton } from "../ui/buttons/github/singup";

export default function SignupForm() {
  const [form, setForm] = useAtom(authFormAtom);
  const [, setAuthMode] = useAtom(authModeAtom);
  const [loading] = useAtom(loadingSignUpFormAtom);
  const [isValid] = useAtom(isRegisterFormValidAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    await handleEmailSignup();
  };

  const updateField = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
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
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
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
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div className="divider">Or continue with</div>

          <GithubSignUpButton />

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
