import { createAuthClient } from "better-auth/client";

console.log(process.env.NEXT_PUBLIC_BETTER_AUTH_API);

export const client = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_API,
});
