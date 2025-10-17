import { db } from "@src/db";
import { BetterAuthOptions } from "better-auth/*";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@src/db/schema";
import { ALLOWED_ORIGINS } from "config";

export const betterAuthOptions: BetterAuthOptions = {
  basePath: "",
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  trustedOrigins: ALLOWED_ORIGINS,
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 2,
    cookieCache: { enabled: false },
  },

  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "user", input: true },
      permissions: { type: "string[]", defaultValue: [] },
    },
  },
};
