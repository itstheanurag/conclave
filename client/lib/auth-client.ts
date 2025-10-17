import { createAuthClient } from "better-auth/client";

export const client = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_API,
});
