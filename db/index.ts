/**
 * Datenbankzugriff über Drizzle und den Neon-HTTP-Treiber.
 * DATABASE_URL kommt aus den Vercel-Umgebungsvariablen (Neon-Integration).
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error(
    "DATABASE_URL fehlt. Lokal: `vercel env pull .env.local` ausführen.",
  );
}

export const db = drizzle({ client: neon(url), schema });
export type Db = typeof db;
