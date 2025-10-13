import { Hono } from "hono";
import { cors } from "hono/cors";
import { CONFIG } from "config";
import routes from "./routes";
import { db } from "./db";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: CONFIG.CORS.ALLOWED_ORIGINS,
    allowMethods: CONFIG.CORS.ALLOWED_METHODS,
    credentials: true,
  })
);

app.use("*", (c, next) => {
  c.set("database", db);
  return next();
});

app.get("/", (c) => c.text("Hello Hono + Better Auth!"));
app.route("/api", routes);

Bun.serve({
  port: CONFIG.APP.PORT || 3000,
  fetch: app.fetch,
});

console.log(`✅ Server running on http://localhost:${CONFIG.APP.PORT || 3000}`);
