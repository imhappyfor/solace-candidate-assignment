import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export async function POST() {
  if (!process.env.DATABASE_URL) {
    return new Response("Database URL not set", { status: 500 });
  }
  // Type assertion to tell TypeScript this is a full database instance
  const dbInstance = db as PostgresJsDatabase<any>;
  const records = await dbInstance.insert(advocates).values(advocateData).returning();

  return Response.json({ advocates: records });
}
