"use server";
/**
 * Server Actions: alles, was schreibt.
 * Jede Action holt sich die Sitzung und begrenzt auf deren Mandanten.
 * Fehler in Formularen werden per `?fehler=` an die Seite zurückgegeben.
 */
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  aufgaben,
  einladungen,
  kunden,
  mandanten,
  mitgliedschaften,
  nutzer,
  projekte,
  zeiteintraege,
  type ProjektStatus,
  type ProjektTyp,
  type Rolle,
  type Spalte,
} from "@/db/schema";
import {
  passwortHashen,
  passwortPruefen,
  sitzungBeenden,
  sitzungErforderlich,
  sitzungStarten,
} from "@/lib/auth";
import { projektGehoertZuMandant } from "@/lib/data";
import { heuteISO, slugify } from "@/lib/format";
import { vorlageFinden } from "@/lib/vorlagen";

const DEMO_EMAIL = "tessa.mahler@agentur-nordlicht.de";

function text(fd: FormData, key: string) {
  return String(fd.get(key) ?? "").trim();
}

function mitFehler(pfad: string, fehler: string): never {
  redirect(`${pfad}?fehler=${encodeURIComponent(fehler)}`);
}

async function freienSlugFinden(name: string) {
  const basis = slugify(name);
  let slug = basis;
  for (let i = 2; i < 50; i++) {
    const [vorhanden] = await db
      .select({ id: mandanten.id })
      .from(mandanten)
      .where(eq(mandanten.slug, slug))
      .limit(1);
    if (!vorhanden) return slug;
    slug = `${basis}-${i}`;
  }
  return `${basis}-${Date.now()}`;
}

async function ersteMitgliedschaft(nutzerId: string) {
  const [m] = await db
    .select({ mandantId: mitgliedschaften.mandantId })
    .from(mitgliedschaften)
    .where(eq(mitgliedschaften.nutzerId, nutzerId))
    .orderBy(mitgliedschaften.erstelltAm)
    .limit(1);
  return m ?? null;
}

/* ---------- Anmeldung ---------- */

export async function anmelden(fd: FormData) {
  const email = text(fd, "email").toLowerCase();
  const passwort = String(fd.get("passwort") ?? "");
  if (!email || !passwort) mitFehler("/anmelden", "Bitte E-Mail und Passwort eingeben.");

  const [konto] = await db.select().from(nutzer).where(eq(nutzer.email, email)).limit(1);
  const passt = konto ? await passwortPruefen(passwort, konto.passwortHash) : false;
  if (!konto || !passt) mitFehler("/anmelden", "E-Mail oder Passwort stimmen nicht.");

  const m = await ersteMitgliedschaft(konto.id);
  if (!m) mitFehler("/anmelden", "Dieses Konto gehört zu keiner Agentur.");

  await sitzungStarten(konto.id, m.mandantId);
  redirect("/projekte");
}

export async function demoAnmelden() {
  const [konto] = await db.select().from(nutzer).where(eq(nutzer.email, DEMO_EMAIL)).limit(1);
  if (!konto) mitFehler("/anmelden", "Die Demo-Agentur ist gerade nicht verfügbar.");
  const m = await ersteMitgliedschaft(konto.id);
  if (!m) mitFehler("/anmelden", "Die Demo-Agentur ist gerade nicht verfügbar.");
  await sitzungStarten(konto.id, m.mandantId);
  redirect("/projekte");
}

export async function registrieren(fd: FormData) {
  const name = text(fd, "name");
  const email = text(fd, "email").toLowerCase();
  const passwort = String(fd.get("passwort") ?? "");
  const agentur = text(fd, "agentur");

  if (!name || !email || !passwort || !agentur)
    mitFehler("/registrieren", "Bitte alle Felder ausfüllen.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    mitFehler("/registrieren", "Die E-Mail-Adresse sieht nicht vollständig aus.");
  if (passwort.length < 8)
    mitFehler("/registrieren", "Das Passwort braucht mindestens 8 Zeichen.");

  const [vorhanden] = await db
    .select({ id: nutzer.id })
    .from(nutzer)
    .where(eq(nutzer.email, email))
    .limit(1);
  if (vorhanden)
    mitFehler("/registrieren", "Für diese E-Mail gibt es schon ein Konto. Melde dich an.");

  const slug = await freienSlugFinden(agentur);
  const [mandant] = await db.insert(mandanten).values({ name: agentur, slug }).returning();
  const [konto] = await db
    .insert(nutzer)
    .values({ name, email, passwortHash: await passwortHashen(passwort) })
    .returning();
  await db.insert(mitgliedschaften).values({
    mandantId: mandant.id,
    nutzerId: konto.id,
    rolle: "admin",
  });

  await sitzungStarten(konto.id, mandant.id);
  redirect("/projekte");
}

export async function abmelden() {
  await sitzungBeenden();
  redirect("/anmelden");
}

/* ---------- Einladung ---------- */

export async function einladungAnnehmen(token: string, fd: FormData) {
  const pfad = `/einladung/${token}`;
  const [einladung] = await db
    .select()
    .from(einladungen)
    .where(eq(einladungen.token, token))
    .limit(1);
  if (!einladung) mitFehler(pfad, "Diese Einladung gibt es nicht.");
  if (einladung.angenommenAm) mitFehler(pfad, "Diese Einladung wurde schon angenommen.");
  if (einladung.gueltigBis < new Date()) mitFehler(pfad, "Diese Einladung ist abgelaufen.");

  const passwort = String(fd.get("passwort") ?? "");
  const name = text(fd, "name");
  const email = einladung.email.toLowerCase();

  let [konto] = await db.select().from(nutzer).where(eq(nutzer.email, email)).limit(1);
  if (konto) {
    const passt = await passwortPruefen(passwort, konto.passwortHash);
    if (!passt) mitFehler(pfad, "Für diese E-Mail gibt es schon ein Konto. Das Passwort stimmt nicht.");
  } else {
    if (!name) mitFehler(pfad, "Bitte deinen Namen eingeben.");
    if (passwort.length < 8) mitFehler(pfad, "Das Passwort braucht mindestens 8 Zeichen.");
    [konto] = await db
      .insert(nutzer)
      .values({ name, email, passwortHash: await passwortHashen(passwort) })
      .returning();
  }

  await db
    .insert(mitgliedschaften)
    .values({ mandantId: einladung.mandantId, nutzerId: konto.id, rolle: einladung.rolle })
    .onConflictDoNothing();
  await db
    .update(einladungen)
    .set({ angenommenAm: new Date() })
    .where(eq(einladungen.id, einladung.id));

  await sitzungStarten(konto.id, einladung.mandantId);
  redirect("/projekte");
}

export async function einladungErstellen(fd: FormData) {
  const s = await sitzungErforderlich();
  const email = text(fd, "email").toLowerCase();
  const rolle = (text(fd, "rolle") || "mitglied") as Rolle;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    mitFehler("/einstellungen", "Die E-Mail-Adresse sieht nicht vollständig aus.");

  const token = randomBytes(24).toString("base64url");
  await db.insert(einladungen).values({
    mandantId: s.mandant.id,
    email,
    rolle: rolle === "admin" ? "admin" : "mitglied",
    token,
    eingeladenVon: s.nutzer.id,
    gueltigBis: new Date(Date.now() + 14 * 86_400_000),
  });
  revalidatePath("/einstellungen");
  redirect("/einstellungen");
}

export async function einladungWiderrufen(id: string) {
  const s = await sitzungErforderlich();
  await db
    .delete(einladungen)
    .where(and(eq(einladungen.id, id), eq(einladungen.mandantId, s.mandant.id)));
  revalidatePath("/einstellungen");
}

/* ---------- Mandant und Konto ---------- */

export async function mandantAktualisieren(fd: FormData) {
  const s = await sitzungErforderlich();
  if (s.rolle !== "admin") mitFehler("/einstellungen", "Nur Admins können die Agentur ändern.");
  const name = text(fd, "name");
  if (!name) mitFehler("/einstellungen", "Der Name darf nicht leer sein.");
  await db.update(mandanten).set({ name }).where(eq(mandanten.id, s.mandant.id));
  revalidatePath("/", "layout");
  redirect("/einstellungen");
}

export async function profilAktualisieren(fd: FormData) {
  const s = await sitzungErforderlich();
  const name = text(fd, "name");
  const wochenstunden = Number(fd.get("wochenstunden") ?? 40);
  if (!name) mitFehler("/einstellungen", "Der Name darf nicht leer sein.");
  await db.update(nutzer).set({ name }).where(eq(nutzer.id, s.nutzer.id));
  if (Number.isFinite(wochenstunden) && wochenstunden > 0 && wochenstunden <= 60) {
    await db
      .update(mitgliedschaften)
      .set({ wochenstunden: Math.round(wochenstunden) })
      .where(
        and(
          eq(mitgliedschaften.nutzerId, s.nutzer.id),
          eq(mitgliedschaften.mandantId, s.mandant.id),
        ),
      );
  }
  revalidatePath("/", "layout");
  redirect("/einstellungen");
}

/* ---------- Kunden ---------- */

export async function kundeAnlegen(fd: FormData) {
  const s = await sitzungErforderlich();
  const name = text(fd, "name");
  if (!name) mitFehler("/kunden", "Der Kunde braucht einen Namen.");
  await db.insert(kunden).values({
    mandantId: s.mandant.id,
    name,
    ansprechpartner: text(fd, "ansprechpartner") || null,
    email: text(fd, "email") || null,
    notiz: text(fd, "notiz") || null,
  });
  revalidatePath("/kunden");
  redirect("/kunden");
}

/* ---------- Projekte ---------- */

export async function projektAnlegen(fd: FormData) {
  const s = await sitzungErforderlich();
  const name = text(fd, "name");
  if (!name) mitFehler("/projekte/neu", "Das Projekt braucht einen Namen.");

  const typ = (text(fd, "typ") || "sonstiges") as ProjektTyp;
  let kundeId: string | null = text(fd, "kundeId") || null;
  const neuerKunde = text(fd, "neuerKunde");
  if (!kundeId && neuerKunde) {
    const [k] = await db
      .insert(kunden)
      .values({ mandantId: s.mandant.id, name: neuerKunde })
      .returning();
    kundeId = k.id;
  }
  if (kundeId) {
    const [k] = await db
      .select({ id: kunden.id })
      .from(kunden)
      .where(and(eq(kunden.id, kundeId), eq(kunden.mandantId, s.mandant.id)))
      .limit(1);
    if (!k) kundeId = null;
  }

  const budget = Number(fd.get("budgetStunden"));
  const [projekt] = await db
    .insert(projekte)
    .values({
      mandantId: s.mandant.id,
      kundeId,
      name,
      typ,
      beschreibung: text(fd, "beschreibung") || null,
      budgetStunden: Number.isFinite(budget) && budget > 0 ? Math.round(budget) : null,
      startAm: text(fd, "startAm") || heuteISO(),
      endeAm: text(fd, "endeAm") || null,
    })
    .returning({ id: projekte.id });

  revalidatePath("/projekte");
  redirect(`/projekte/${projekt.id}`);
}

/** Projekt aus einer Vorlage: Beispielaufgaben in „Offen", die Phase als Etikett. */
export async function projektAusVorlage(fd: FormData) {
  const s = await sitzungErforderlich();
  const vorlage = vorlageFinden(text(fd, "vorlage"));
  if (!vorlage) mitFehler("/projekte/vorlage", "Wähl eine Vorlage aus.");

  const [projekt] = await db
    .insert(projekte)
    .values({
      mandantId: s.mandant.id,
      name: text(fd, "name") || vorlage.titel,
      typ: vorlage.typ,
      startAm: heuteISO(),
    })
    .returning({ id: projekte.id });

  const zeilen = vorlage.phasen.flatMap((p) => p.aufgaben.map((titel) => ({ titel, tag: p.name })));
  await db.insert(aufgaben).values(
    zeilen.map((z, i) => ({
      projektId: projekt.id,
      titel: z.titel,
      tag: z.tag,
      spalte: "offen" as Spalte,
      position: i + 1,
    })),
  );

  revalidatePath("/projekte");
  redirect(`/projekte/${projekt.id}`);
}

export async function projektStatusSetzen(projektId: string, fd: FormData) {
  const s = await sitzungErforderlich();
  const status = text(fd, "status") as ProjektStatus;
  if (!["laufend", "pausiert", "abgeschlossen"].includes(status)) return;
  await db
    .update(projekte)
    .set({ status })
    .where(and(eq(projekte.id, projektId), eq(projekte.mandantId, s.mandant.id)));
  revalidatePath(`/projekte/${projektId}`);
  revalidatePath("/projekte");
}

/* ---------- Aufgaben ---------- */

export async function aufgabeAnlegen(projektId: string, fd: FormData) {
  const s = await sitzungErforderlich();
  if (!(await projektGehoertZuMandant(s.mandant.id, projektId))) return;
  const titel = text(fd, "titel");
  if (!titel) return;
  const spalte = (text(fd, "spalte") || "offen") as Spalte;

  const [pos] = await db
    .select({ max: sql<number>`coalesce(max(${aufgaben.position}), 0)::int` })
    .from(aufgaben)
    .where(eq(aufgaben.projektId, projektId));

  await db.insert(aufgaben).values({
    projektId,
    titel,
    spalte,
    verantwortlichId: text(fd, "verantwortlichId") || null,
    faelligAm: text(fd, "faelligAm") || null,
    tag: text(fd, "tag") || null,
    position: (pos?.max ?? 0) + 1,
    erledigtAm: spalte === "erledigt" ? new Date() : null,
  });
  revalidatePath(`/projekte/${projektId}`);
  revalidatePath("/projekte");
}

export async function aufgabeVerschieben(aufgabeId: string, spalte: Spalte) {
  const s = await sitzungErforderlich();
  const [a] = await db
    .select({ id: aufgaben.id, projektId: aufgaben.projektId })
    .from(aufgaben)
    .innerJoin(projekte, eq(projekte.id, aufgaben.projektId))
    .where(and(eq(aufgaben.id, aufgabeId), eq(projekte.mandantId, s.mandant.id)))
    .limit(1);
  if (!a) return;
  await db
    .update(aufgaben)
    .set({ spalte, erledigtAm: spalte === "erledigt" ? new Date() : null })
    .where(eq(aufgaben.id, aufgabeId));
  revalidatePath(`/projekte/${a.projektId}`);
  revalidatePath("/projekte");
}

export async function aufgabeLoeschen(aufgabeId: string) {
  const s = await sitzungErforderlich();
  const [a] = await db
    .select({ id: aufgaben.id, projektId: aufgaben.projektId })
    .from(aufgaben)
    .innerJoin(projekte, eq(projekte.id, aufgaben.projektId))
    .where(and(eq(aufgaben.id, aufgabeId), eq(projekte.mandantId, s.mandant.id)))
    .limit(1);
  if (!a) return;
  await db.delete(aufgaben).where(eq(aufgaben.id, aufgabeId));
  revalidatePath(`/projekte/${a.projektId}`);
  revalidatePath("/projekte");
}

/* ---------- Zeiten ---------- */

export async function zeitErfassen(fd: FormData) {
  const s = await sitzungErforderlich();
  const projektId = text(fd, "projektId");
  const stunden = Number(String(fd.get("stunden") ?? "").replace(",", "."));
  const datum = text(fd, "datum") || heuteISO();
  if (!projektId) mitFehler("/zeiten", "Bitte ein Projekt wählen.");
  if (!Number.isFinite(stunden) || stunden <= 0 || stunden > 24)
    mitFehler("/zeiten", "Bitte eine Dauer zwischen 0,25 und 24 Stunden eingeben.");
  if (!(await projektGehoertZuMandant(s.mandant.id, projektId)))
    mitFehler("/zeiten", "Dieses Projekt gehört nicht zu deiner Agentur.");

  await db.insert(zeiteintraege).values({
    mandantId: s.mandant.id,
    projektId,
    nutzerId: s.nutzer.id,
    datum,
    minuten: Math.round(stunden * 60),
    notiz: text(fd, "notiz") || null,
  });
  revalidatePath("/zeiten");
  revalidatePath("/auslastung");
  redirect("/zeiten");
}

export async function zeitLoeschen(id: string) {
  const s = await sitzungErforderlich();
  await db
    .delete(zeiteintraege)
    .where(
      and(
        eq(zeiteintraege.id, id),
        eq(zeiteintraege.mandantId, s.mandant.id),
        eq(zeiteintraege.nutzerId, s.nutzer.id),
      ),
    );
  revalidatePath("/zeiten");
  revalidatePath("/auslastung");
}
