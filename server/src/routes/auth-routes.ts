import { Hono } from "hono";
import { auth } from "@src/lib/auth";
import { db } from "@src/db";
import { session, user } from "@src/db/schema";
import { and, eq, gt } from "drizzle-orm";

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

    // console.log(
    //   await auth.api.getSession({ headers: { ...c.req.header } }),
    //   "sesion from the auth"
    // );

    const [sessionWithUser] = await db
      .select({
        sessionId: session.id,
        sessionToken: session.token,
        sessionExpiresAt: session.expiresAt,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      })
      .from(session)
      .leftJoin(user, eq(session.userId, user.id))
      .where(and(eq(session.token, token), gt(session.expiresAt, new Date())))
      .limit(1);

    // console.log(sessionWithUser);

    if (!sessionWithUser) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({
      session: {
        id: sessionWithUser.sessionId,
        token: sessionWithUser.sessionToken,
        expiresAt: sessionWithUser.sessionExpiresAt,
      },
      user: {
        id: sessionWithUser.userId,
        name: sessionWithUser.userName,
        email: sessionWithUser.userEmail,
      },
    });
  } catch (err: any) {
    console.error("[Auth] Me error:", err);
    return c.json({ error: err.message }, 400);
  }
});

export default authRoutes;
