import { auth } from "@src/lib/auth";
import { Hono } from "hono";
// import authRoutes from "./auth-routes";

const routes = new Hono();

// routes.route("/auth", authRoutes);
routes.all("/auth/*", async (c) => {
  return auth.handler(c.req.raw);
});

export default routes;
