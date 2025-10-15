import { db } from "@src/db";
import { BetterAuthOptions } from "better-auth/*";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const betterAuthOptions: BetterAuthOptions = {
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
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
    modelName: "jwt",
    secret: process.env.JWT_SECRET! || ""
    expiresIn: 60 * 60 * 24 * 7, // fallback
    updateAge: 60 * 60 * 24, // refresh token rotation interval
    cookieCache: { enabled: false }, // disable cookies
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "user", input: true },
      permissions: { type: "string[]", defaultValue: [] },
    },
  },
};
