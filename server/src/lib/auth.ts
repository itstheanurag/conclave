import { betterAuth } from "better-auth";
import { betterAuthOptions, betterAuthPlugins } from "./better-auth";

export const auth = betterAuth({
  ...betterAuthOptions,
  plugins: betterAuthPlugins,
});

export type AuthContext = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
