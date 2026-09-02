/**
 * Anmeldung und Sitzungen.
 *
 * Passwort-Login mit bcrypt. Sitzungen liegen in der Tabelle `sessions`,
 * der Browser bekommt nur ein zufälliges Token als httpOnly-Cookie; in der
 * Datenbank steht der SHA-256-Hash davon. Eine Sitzung gehört immer zu genau
 * einem Mandanten.
 */
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { mandanten, mitgliedschaften, nutzer, sessions } from "@/db/schema";

const COOKIE_NAME = "klarwerk_sitzung";
const SITZUNGSDAUER_TAGE = 30;

export function passwortHashen(passwort: string) {
  return bcrypt.hash(passwort, 10);
}

export function passwortPruefen(passwort: string, hash: string) {
  return bcrypt.compare(passwort, hash);
}

function tokenHashen(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function sitzungStarten(nutzerId: string, mandantId: string) {
  const token = randomBytes(32).toString("base64url");
  const gueltigBis = new Date(Date.now() + SITZUNGSDAUER_TAGE * 86_400_000);
  await db.insert(sessions).values({
    tokenHash: tokenHashen(token),
    nutzerId,
    mandantId,
    gueltigBis,
  });
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: gueltigBis,
  });
}

export async function sitzungBeenden() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.tokenHash, tokenHashen(token)));
  }
  jar.delete(COOKIE_NAME);
}

export type Sitzung = {
  sessionId: string;
  nutzer: { id: string; name: string; email: string };
  mandant: { id: string; name: string; slug: string; plaetze: number };
  rolle: "admin" | "mitglied";
};

/** Aktuelle Sitzung aus dem Cookie; pro Request gecacht. */
export const aktuelleSitzung = cache(async (): Promise<Sitzung | null> => {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const [row] = await db
    .select({
      sessionId: sessions.id,
      nutzerId: nutzer.id,
      nutzerName: nutzer.name,
      nutzerEmail: nutzer.email,
      mandantId: mandanten.id,
      mandantName: mandanten.name,
      mandantSlug: mandanten.slug,
      plaetze: mandanten.plaetze,
      rolle: mitgliedschaften.rolle,
    })
    .from(sessions)
    .innerJoin(nutzer, eq(nutzer.id, sessions.nutzerId))
    .innerJoin(mandanten, eq(mandanten.id, sessions.mandantId))
    .innerJoin(
      mitgliedschaften,
      and(
        eq(mitgliedschaften.nutzerId, sessions.nutzerId),
        eq(mitgliedschaften.mandantId, sessions.mandantId),
      ),
    )
    .where(
      and(
        eq(sessions.tokenHash, tokenHashen(token)),
        gt(sessions.gueltigBis, new Date()),
      ),
    )
    .limit(1);

  if (!row) return null;
  return {
    sessionId: row.sessionId,
    nutzer: { id: row.nutzerId, name: row.nutzerName, email: row.nutzerEmail },
    mandant: {
      id: row.mandantId,
      name: row.mandantName,
      slug: row.mandantSlug,
      plaetze: row.plaetze,
    },
    rolle: row.rolle,
  };
});

/** Leitet zur Anmeldung um, wenn niemand angemeldet ist. */
export async function sitzungErforderlich(): Promise<Sitzung> {
  const sitzung = await aktuelleSitzung();
  if (!sitzung) redirect("/anmelden");
  return sitzung;
}
