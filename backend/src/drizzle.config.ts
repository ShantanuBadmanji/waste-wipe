import "dotenv/config";
import type { Config } from "drizzle-kit";
import { dbCredentials } from "./db/connect";

export default {
  schema: "src/db/schemas/index.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: dbCredentials,
} satisfies Config;
