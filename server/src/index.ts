import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { CONFIG } from "config";
import routes from "./routes";
import { db } from "./db";

const app = new Hono();

// Basic request logging
app.use("*", logger());

// Custom middleware for detailed request & response logs
// app.use("*", async (c, next) => {
//   const start = Date.now();
//   console.log(`➡️  [Request] ${c.req.method} ${c.req.url}`);
//   console.log("Headers:", c.req);
//   console.log("Body:", await c.req.text());

//   await next(); // proceed to the next middleware/route

//   const duration = Date.now() - start;
//   // status is available via c.res
//   console.log(
//     `⬅️  [Response] ${c.req.method} ${c.req.url} -> ${
//       c.res.status
//     } ${JSON.stringify(c.res)} (${duration}ms,)`
//   );
// });

// Set database in context
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
