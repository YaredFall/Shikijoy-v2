import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.SHIKIJOY_DB_URL;

if (!connectionString) throw new Error("SHIKIJOY_DB_URL is not defined");

const queryClient = postgres(connectionString);
export const db = drizzle(queryClient);