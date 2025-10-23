import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { Scalar } from "@scalar/hono-api-reference";
import { db } from "@src/db";
import routes from "@src/routes";
import { ALLOWED_ORIGINS, ALLOWED_METHODS, CONFIG } from "config";

export const app = new OpenAPIHono();

app.use(
  "/*",
  cors({
    origin: (origin) =>
      !origin ? null : ALLOWED_ORIGINS.includes(origin) ? origin : null,
    allowMethods: ALLOWED_METHODS,
    credentials: true,
  })
);

app.use("*", logger());
app.use("*", (c, next) => {
  c.set("database", db);
  return next();
});

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
    spec: { url: "/openapi.json" },
    layout: "modern",
    theme: "deepSpace",
  })
);
