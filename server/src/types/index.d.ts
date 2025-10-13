import { db } from "@src/db";
import { auth } from "@src/lib/auth";
import "hono";

type SessionType = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

declare module "hono" {
  interface ContextVariableMap {
    user: SessionType["user"];
    session: SessionType["session"];
    database: typeof db;
  }
}
