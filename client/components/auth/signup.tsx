"use client";
import { useAtom } from "jotai";
import {
  fullNameAtom,
  emailAtom,
  passwordAtom,
  confirmPasswordAtom,
  authModeAtom,
  loadingAtom,
  isRegisterFormValidAtom,
} from "@/atoms/auth";
import { handleEmailSignup } from "@/actions";
import { GithubSignInButton } from "@/components/ui/buttons/github/signIn";

export default function SignupForm() {
  const [fullName, setFullName] = useAtom(fullNameAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const [confirmPassword, setConfirmPassword] = useAtom(confirmPasswordAtom);
  const [, setAuthMode] = useAtom(authModeAtom);
  const [loading] = useAtom(loadingAtom);
  const [isValid] = useAtom(isRegisterFormValidAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    await handleEmailSignup();
  };

  return (
    <div className="card bg-base-300">
      <div className="card-body">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
            disabled={!isValid || loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div className="divider">Or continue with</div>

          <GithubSignInButton />

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
