import { CONFIG } from "config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@src/db/schema";

const pool = new Pool({
  connectionString: CONFIG.DB.URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on("error", (err: unknown) => {
  console.error("[DB] Unexpected error:", err);
});

pool.on("remove", () => {
  console.log("[DB] Connection closed ❌");
});

(async () => {
  try {
    const client = await pool.connect();
    console.log("[DB] Initial connection successful ✅");
    client.release();
  } catch (err) {
    console.error("[DB] Initial connection failed ❌", err);
  }
})();

export const db = drizzle(pool, { logger: true, schema });

export async function closeDb() {
  await pool.end();
  console.log("[DB] Pool closed gracefully.");
}
