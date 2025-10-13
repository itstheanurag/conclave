import { Hono } from "hono";
import { auth } from "@src/lib/auth";

const authRoutes = new Hono();

authRoutes.post("/register", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    const user = await auth.api.signUpEmail({
      body: { email, password, name },
    });

    return c.json({ success: true, user });
  } catch (error: any) {
    console.error("[Auth] Register error:", error);
    return c.json({ success: false, message: error.message }, 400);
  }
});

authRoutes.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const session = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      request: c.req.raw,
    });

    return c.json({ success: true, session });
  } catch (error: any) {
    console.error("[Auth] Login error:", error);
    return c.json({ success: false, message: error.message }, 400);
  }
});

authRoutes.post("/logout", async (c) => {
  try {
    await auth.api.signOut({
      request: c.req.raw,
      headers: c.req.raw.headers,
    });
    return c.json({ success: true });
  } catch (error: any) {
    console.error("[Auth] Logout error:", error);
    return c.json({ success: false, message: error.message }, 400);
  }
});

authRoutes.get("/me", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const db = c.get("database");

    const sessionData = await db.query.session.findFirst({
      where: (session, { eq, gt }) =>
        eq(session.token, token) && gt(session.expiresAt, new Date()),
      with: {
        user: true,
      },
    });

    console.log("Session found:", sessionData);

    if (!sessionData) return c.json({ error: "Unauthorized" }, 401);

    const user = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, sessionData.userId),
    });

    return c.json({
      user,
      session: { token: sessionData.token, expiresAt: sessionData.expiresAt },
    });
  } catch (err: any) {
    console.error("[Auth] Me error:", err);
    return c.json({ error: err.message }, 400);
  }
});

export default authRoutes;
