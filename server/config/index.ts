export const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .filter(Boolean);

// console.log(ALLOWED_ORIGINS);

export const ALLOWED_METHODS = (
  process.env.ALLOWED_METHODS || "GET,POST,OPTIONS"
).split(",");

export const CONFIG = {
  APP: { PORT: process.env.PORT },
  CORS: {
    ALLOWED_ORIGINS,
    ALLOWED_METHODS,
  },
  DB: { URL: process.env.DATABASE_URL! },
};
