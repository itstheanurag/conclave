import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const meeting = pgTable("meeting", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  active: boolean("active").default(true).notNull(),
  hostId: text("host_id").notNull(),
});
