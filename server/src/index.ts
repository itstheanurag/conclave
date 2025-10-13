import { Hono } from "hono";
import { cors } from "hono/cors";
import { CONFIG } from "config";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: CONFIG.CORS.ALLOWED_METHODS,
    allowMethods: CONFIG.CORS.ALLOWED_METHODS,
    credentials: true,
  })
);

app.get("/", (c) => c.text("Hello Hono!"));

Bun.serve({
  port: CONFIG.APP.PORT || 3000,
  fetch: app.fetch,
});

console.log(`✅ Server running on http://localhost:${CONFIG.APP.PORT || 3000}`);
