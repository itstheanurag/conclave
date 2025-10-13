import type { Context, Next } from "hono";
import { auth } from "@src/lib/auth";

export const protect = () => {
  return async (c: Context, next: Next) => {
    const session = await auth.api.getSession(c.req.raw);
    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("user", session.user);
    c.set("session", session.session);
    await next();
  };
};
