import { CONFIG } from "config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: CONFIG.DB.URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on("connect", () => {
  console.log("[DB] Connection established ✅");
});

pool.on("error", (err: unknown) => {
  console.error("[DB] Unexpected error:", err);
});

pool.on("remove", () => {
  console.log("[DB] Connection closed ❌");
});

const originalQuery = pool.query.bind(pool);
pool.query = async (...args: any[]) => {
  const start = Date.now();
  const result = await originalQuery(...args);
  const duration = Date.now() - start;
  console.log(`[DB] Executed query in ${duration}ms:`, args[0]);
  return result;
};

export const db = drizzle(pool, {
  logger: true,
});

export async function closeDb() {
  await pool.end();
  console.log("[DB] Pool closed gracefully.");
}
