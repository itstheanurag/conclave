import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { db } from "@src/db";
import { meeting } from "@src/db/schema";
import { eq } from "drizzle-orm";

const app = new OpenAPIHono();

const MeetingSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string(),
  active: z.boolean(),
  hostId: z.string(),
});

const CreateMeetingSchema = z.object({
  title: z.string(),
  hostId: z.string(),
});

// GET /meetings
app.openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: {
      200: {
        description: "List all meetings",
        content: {
          "application/json": {
            schema: z.array(MeetingSchema),
          },
        },
      },
    },
  }),
  async (c) => {
    const meetings = await db.select().from(meeting);
    return c.json(
      meetings.map((m) => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
      }))
    );
  }
);

// POST /meetings
app.openapi(
  createRoute({
    method: "post",
    path: "/",
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateMeetingSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Create a meeting",
        content: {
          "application/json": {
            schema: MeetingSchema,
          },
        },
      },
    },
  }),
  async (c) => {
    const { title, hostId } = c.req.valid("json");
    const id = crypto.randomUUID();
    const [newMeeting] = await db
      .insert(meeting)
      .values({
        id,
        title,
        hostId,
      })
      .returning();

    return c.json({
      ...newMeeting,
      createdAt: newMeeting.createdAt.toISOString(),
    });
  }
);

// GET /meetings/:id
app.openapi(
  createRoute({
    method: "get",
    path: "/{id}",
    request: {
      params: z.object({
        id: z.string(),
      }),
    },
    responses: {
      200: {
        description: "Get meeting details",
        content: {
          "application/json": {
            schema: MeetingSchema.extend({
              participants: z.array(z.any()).default([]),
              messages: z.array(z.any()).default([]),
              recordings: z.array(z.any()).default([]),
            }),
          },
        },
      },
      404: {
        description: "Meeting not found",
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const [foundMeeting] = await db
      .select()
      .from(meeting)
      .where(eq(meeting.id, id));

    if (!foundMeeting) {
      return c.json({ error: "Meeting not found" }, 404);
    }

    // For now, return empty lists for details
    return c.json({
      ...foundMeeting,
      createdAt: foundMeeting.createdAt.toISOString(),
      participants: [],
      messages: [],
      recordings: [],
    });
  }
);

export default app;
