import { auth } from "@src/lib/auth";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

const routes = new OpenAPIHono();

routes.all("/auth/*", async (c) => {
  return await auth.handler(c.req.raw);
});

const helloRoute = createRoute({
  method: "get",
  path: "/hello",
  request: {
    query: z.object({
      name: z.string().optional().openapi({ example: "Komal" }),
    }),
  },
  responses: {
    200: {
      description: "Returns a greeting message",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string().openapi({ example: "Hello Komal!" }),
          }),
        },
      },
    },
  },
  tags: ["Hello"],
});

routes.openapi(helloRoute, (c) => {
  const { name } = c.req.valid("query");
  return c.json({ message: `Hello ${name ?? "World"}!` });
});

export default routes;
