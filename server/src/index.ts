import { Hono } from "hono";
import { cors } from "hono/cors";

const PORT = Number(process.env.PORT) || 3000;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .filter(Boolean);
const ALLOWED_METHODS = (
  process.env.ALLOWED_METHODS || "GET,POST,OPTIONS"
).split(",");

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ALLOWED_ORIGINS,
    allowMethods: ALLOWED_METHODS,
    credentials: true,
  })
);

app.get("/", (c) => c.text("Hello Hono!"));

Bun.serve({
  port: PORT,
  fetch: app.fetch,
});

console.log(`✅ Server running on http://localhost:${PORT}`);
