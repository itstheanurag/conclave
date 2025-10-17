import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { db } from "./db";
import { ALLOWED_METHODS, ALLOWED_ORIGINS, CONFIG } from "config";
import routes from "./routes";
import { Scalar } from "@scalar/hono-api-reference";

const app = new OpenAPIHono();

app.use(
  "/*",
  cors({
    origin: (origin) => {
      // handle same-origin or server-side requests
      if (!origin) return null;
      return ALLOWED_ORIGINS.includes(origin) ? origin : null;
    },
    allowMethods: ALLOWED_METHODS,
    credentials: true,
  })
);

app.use("*", logger());
app.use("*", (c, next) => {
  c.set("database", db);
  return next();
});

// --- Healthcheck ---
app.get("/", (c) => c.text("Hello Hono + Better Auth!"));

app.route("/api", routes);

app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: {
    title: CONFIG.APP.NAME,
    version: CONFIG.APP.VERSION,
    description: CONFIG.APP.DESCRIPTION || "Auto-generated API docs",
  },
});

app.get(
  "/docs",
  Scalar({
    spec: {
      url: "/openapi.json",
    },
    layout: "modern",
    theme: "deepSpace",
  })
);

Bun.serve({
  port: CONFIG.APP.PORT || 3000,
  fetch: app.fetch,
});

console.log(`✅ Server running on http://localhost:${CONFIG.APP.PORT || 3000}`);
console.log(
  `📘 OpenAPI Docs: http://localhost:${CONFIG.APP.PORT || 3000}/docs`
);
