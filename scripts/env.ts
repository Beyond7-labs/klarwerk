/** Lädt .env.local und .env, bevor andere Module Umgebungsvariablen lesen. Zuerst importieren. */
import { config } from "dotenv";
config({ path: ".env.local" });
config();
