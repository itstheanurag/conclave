"use client";

import { Eye, EyeOff } from "lucide-react";
import { handleEmailSignup } from "@/actions";
import { GithubSignUpButton } from "../ui/buttons/github/singup";
import { useAuthStore } from "@/stores/authStore";

export default function SignupForm() {
  const {
    formData,
    loadingSignUp,
    updateFormData,
    setAuthMode,
    toggleShowPassword,
    isRegisterFormValid,
  } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRegisterFormValid()) return;
    await handleEmailSignup();
  };

  const isValid = isRegisterFormValid();

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
              value={formData.fullName}
              onChange={(e) => updateFormData({ fullName: e.target.value })}
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
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
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
                type={formData.showPassword ? "text" : "password"}
                placeholder="********"
                className="input input-bordered w-full pr-10"
                value={formData.password}
                onChange={(e) => updateFormData({ password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {formData.showPassword ? (
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
              value={formData.confirmPassword}
              onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || loadingSignUp}
            className="btn btn-primary w-full"
          >
            {loadingSignUp ? "Creating account..." : "Create Account"}
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
