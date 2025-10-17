import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),

  ALLOWED_ORIGINS: z
    .string()
    .default("http://localhost:3000")
    .transform((val) =>
      val
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    )
    .pipe(z.array(z.url())),

  ALLOWED_METHODS: z
    .string()
    .default("GET,POST,OPTIONS")
    .transform((val) =>
      val
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    )
    .pipe(
      z.array(
        z.enum(["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "CREATE"])
      )
    ),

  DATABASE_URL: z.url(),

  DEBUG_LOGS: z
    .string()
    .optional()
    .transform((val) => val === "1"),

  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),

  // 🧾 Extracted from Bun/NPM automatically
  npm_package_name: z.string().default("unknown-app"),
  npm_package_version: z.string().default("0.0.0"),
  npm_package_description: z.string().default(""),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const ENV = parsed.data;

export const CONFIG = {
  APP: {
    PORT: ENV.PORT,
    NAME: ENV.npm_package_name,
    VERSION: ENV.npm_package_version,
    DESCRIPTION: ENV.npm_package_description,
  },
  CORS: {
    ALLOWED_ORIGINS: ENV.ALLOWED_ORIGINS,
    ALLOWED_METHODS: ENV.ALLOWED_METHODS,
  },
  DB: { URL: ENV.DATABASE_URL },
  DEBUG: ENV.DEBUG_LOGS,
  GITHUB: {
    CLIENT_ID: ENV.GITHUB_CLIENT_ID,
    CLIENT_SECRET: ENV.GITHUB_CLIENT_SECRET,
  },
};

export const { ALLOWED_ORIGINS, ALLOWED_METHODS } = CONFIG.CORS;
console.log(ALLOWED_ORIGINS);
