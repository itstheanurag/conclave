import { auth } from "@src/lib/auth";
import { Hono } from "hono";
// import authRoutes from "./auth-routes";

const routes = new Hono();

routes.all("/auth/*", async (c) => {
  return await auth.handler(c.req.raw);
});

export default routes;
