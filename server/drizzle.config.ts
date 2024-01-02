import type { Config } from "drizzle-kit";
import "dotenv-flow/config";

export default {
  schema: "./src/lib/drizzle/schema",
  out: "./src/lib/drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  }
} satisfies Config;