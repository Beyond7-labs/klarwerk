/**
 * Lesende Abfragen, immer auf einen Mandanten begrenzt.
 * Server Components rufen diese Funktionen direkt auf.
 */
import { and, asc, count, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  aufgaben,
  einladungen,
  kunden,
  mitgliedschaften,
  nutzer,
  projekte,
  zeiteintraege,
} from "@/db/schema";
import { heuteISO, tageAddieren, wochenStart } from "@/lib/format";

export async function platzbelegung(mandantId: string) {
  const [row] = await db
    .select({ belegt: count() })
    .from(mitgliedschaften)
    .where(eq(mitgliedschaften.mandantId, mandantId));
  return row?.belegt ?? 0;
}

export async function mitglieder(mandantId: string) {
  return db
    .select({
      id: nutzer.id,
      name: nutzer.name,
      email: nutzer.email,
      rolle: mitgliedschaften.rolle,
      wochenstunden: mitgliedschaften.wochenstunden,
      seit: mitgliedschaften.erstelltAm,
    })
    .from(mitgliedschaften)
    .innerJoin(nutzer, eq(nutzer.id, mitgliedschaften.nutzerId))
    .where(eq(mitgliedschaften.mandantId, mandantId))
    .orderBy(asc(mitgliedschaften.erstelltAm));
}

export async function projekteMitKennzahlen(mandantId: string) {
  const rows = await db
    .select({
      id: projekte.id,
      name: projekte.name,
      typ: projekte.typ,
      status: projekte.status,
      kundeName: kunden.name,
      erstelltAm: projekte.erstelltAm,
      aufgabenGesamt: sql<number>`count(${aufgaben.id})::int`,
      aufgabenErledigt: sql<number>`count(${aufgaben.id}) filter (where ${aufgaben.spalte} = 'erledigt')::int`,
      naechsteFaelligkeit: sql<string | null>`min(${aufgaben.faelligAm}) filter (where ${aufgaben.spalte} <> 'erledigt')`,
    })
    .from(projekte)
    .leftJoin(kunden, eq(kunden.id, projekte.kundeId))
    .leftJoin(aufgaben, eq(aufgaben.projektId, projekte.id))
    .where(eq(projekte.mandantId, mandantId))
    .groupBy(projekte.id, kunden.name)
    .orderBy(
      sql`case ${projekte.status} when 'laufend' then 0 when 'pausiert' then 1 else 2 end`,
      asc(projekte.name),
    );

  if (rows.length === 0) return [];

  const team = await db
    .selectDistinct({
      projektId: aufgaben.projektId,
      nutzerId: nutzer.id,
      name: nutzer.name,
    })
    .from(aufgaben)
    .innerJoin(nutzer, eq(nutzer.id, aufgaben.verantwortlichId))
    .where(
      inArray(
        aufgaben.projektId,
        rows.map((r) => r.id),
      ),
    );

  return rows.map((r) => ({
    ...r,
    team: team.filter((t) => t.projektId === r.id).map((t) => t.name),
  }));
}

export async function projektMitAufgaben(mandantId: string, projektId: string) {
  const [projekt] = await db
    .select({
      id: projekte.id,
      name: projekte.name,
      typ: projekte.typ,
      status: projekte.status,
      beschreibung: projekte.beschreibung,
      budgetStunden: projekte.budgetStunden,
      startAm: projekte.startAm,
      endeAm: projekte.endeAm,
      kundeId: projekte.kundeId,
      kundeName: kunden.name,
    })
    .from(projekte)
    .leftJoin(kunden, eq(kunden.id, projekte.kundeId))
    .where(and(eq(projekte.id, projektId), eq(projekte.mandantId, mandantId)))
    .limit(1);
  if (!projekt) return null;

  const liste = await db
    .select({
      id: aufgaben.id,
      titel: aufgaben.titel,
      beschreibung: aufgaben.beschreibung,
      spalte: aufgaben.spalte,
      faelligAm: aufgaben.faelligAm,
      tag: aufgaben.tag,
      position: aufgaben.position,
      verantwortlichId: aufgaben.verantwortlichId,
      verantwortlichName: nutzer.name,
    })
    .from(aufgaben)
    .leftJoin(nutzer, eq(nutzer.id, aufgaben.verantwortlichId))
    .where(eq(aufgaben.projektId, projektId))
    .orderBy(asc(aufgaben.position), asc(aufgaben.erstelltAm));

  const [zeit] = await db
    .select({ minuten: sql<number>`coalesce(sum(${zeiteintraege.minuten}), 0)::int` })
    .from(zeiteintraege)
    .where(eq(zeiteintraege.projektId, projektId));

  return { ...projekt, aufgaben: liste, minutenGebucht: zeit?.minuten ?? 0 };
}

export async function projektGehoertZuMandant(mandantId: string, projektId: string) {
  const [row] = await db
    .select({ id: projekte.id })
    .from(projekte)
    .where(and(eq(projekte.id, projektId), eq(projekte.mandantId, mandantId)))
    .limit(1);
  return Boolean(row);
}

export async function kundenListe(mandantId: string) {
  return db
    .select({
      id: kunden.id,
      name: kunden.name,
      ansprechpartner: kunden.ansprechpartner,
      email: kunden.email,
      notiz: kunden.notiz,
      projekte: sql<number>`count(${projekte.id})::int`,
      laufend: sql<number>`count(${projekte.id}) filter (where ${projekte.status} = 'laufend')::int`,
    })
    .from(kunden)
    .leftJoin(projekte, eq(projekte.kundeId, kunden.id))
    .where(eq(kunden.mandantId, mandantId))
    .groupBy(kunden.id)
    .orderBy(asc(kunden.name));
}

export async function projekteKurz(mandantId: string) {
  return db
    .select({ id: projekte.id, name: projekte.name, status: projekte.status })
    .from(projekte)
    .where(eq(projekte.mandantId, mandantId))
    .orderBy(asc(projekte.name));
}

export async function zeiteintraegeListe(mandantId: string, limit = 60) {
  return db
    .select({
      id: zeiteintraege.id,
      datum: zeiteintraege.datum,
      minuten: zeiteintraege.minuten,
      notiz: zeiteintraege.notiz,
      nutzerId: zeiteintraege.nutzerId,
      nutzerName: nutzer.name,
      projektId: projekte.id,
      projektName: projekte.name,
    })
    .from(zeiteintraege)
    .innerJoin(nutzer, eq(nutzer.id, zeiteintraege.nutzerId))
    .innerJoin(projekte, eq(projekte.id, zeiteintraege.projektId))
    .where(eq(zeiteintraege.mandantId, mandantId))
    .orderBy(desc(zeiteintraege.datum), desc(zeiteintraege.erstelltAm))
    .limit(limit);
}

/** Auslastung der laufenden Woche (Montag bis Sonntag) pro Person. */
export async function auslastungDieseWoche(mandantId: string) {
  const heute = heuteISO();
  const von = wochenStart(heute);
  const bis = tageAddieren(von, 6);

  const team = await mitglieder(mandantId);

  const gebucht = await db
    .select({
      nutzerId: zeiteintraege.nutzerId,
      minuten: sql<number>`coalesce(sum(${zeiteintraege.minuten}), 0)::int`,
    })
    .from(zeiteintraege)
    .where(
      and(
        eq(zeiteintraege.mandantId, mandantId),
        gte(zeiteintraege.datum, von),
        lte(zeiteintraege.datum, bis),
      ),
    )
    .groupBy(zeiteintraege.nutzerId);

  const offen = await db
    .select({
      nutzerId: aufgaben.verantwortlichId,
      anzahl: sql<number>`count(*)::int`,
      ueberfaellig: sql<number>`count(*) filter (where ${aufgaben.faelligAm} < ${heute})::int`,
    })
    .from(aufgaben)
    .innerJoin(projekte, eq(projekte.id, aufgaben.projektId))
    .where(
      and(
        eq(projekte.mandantId, mandantId),
        sql`${aufgaben.spalte} <> 'erledigt'`,
        eq(projekte.status, "laufend"),
      ),
    )
    .groupBy(aufgaben.verantwortlichId);

  return {
    von,
    bis,
    personen: team.map((m) => ({
      ...m,
      minutenGebucht: gebucht.find((g) => g.nutzerId === m.id)?.minuten ?? 0,
      offeneAufgaben: offen.find((o) => o.nutzerId === m.id)?.anzahl ?? 0,
      ueberfaellig: offen.find((o) => o.nutzerId === m.id)?.ueberfaellig ?? 0,
    })),
  };
}

/** Gebuchte Stunden je laufendem Projekt gegen das Budget. */
export async function projektbudgets(mandantId: string) {
  return db
    .select({
      id: projekte.id,
      name: projekte.name,
      status: projekte.status,
      budgetStunden: projekte.budgetStunden,
      minutenGebucht: sql<number>`coalesce(sum(${zeiteintraege.minuten}), 0)::int`,
    })
    .from(projekte)
    .leftJoin(zeiteintraege, eq(zeiteintraege.projektId, projekte.id))
    .where(and(eq(projekte.mandantId, mandantId), eq(projekte.status, "laufend")))
    .groupBy(projekte.id)
    .orderBy(asc(projekte.name));
}

export async function offeneEinladungen(mandantId: string) {
  return db
    .select({
      id: einladungen.id,
      email: einladungen.email,
      rolle: einladungen.rolle,
      token: einladungen.token,
      gueltigBis: einladungen.gueltigBis,
      erstelltAm: einladungen.erstelltAm,
    })
    .from(einladungen)
    .where(
      and(
        eq(einladungen.mandantId, mandantId),
        sql`${einladungen.angenommenAm} is null`,
      ),
    )
    .orderBy(desc(einladungen.erstelltAm));
}

export async function einladungPerToken(token: string) {
  const [row] = await db
    .select({
      id: einladungen.id,
      email: einladungen.email,
      rolle: einladungen.rolle,
      mandantId: einladungen.mandantId,
      mandantName: mandanten.name,
      angenommenAm: einladungen.angenommenAm,
      gueltigBis: einladungen.gueltigBis,
      eingeladenVonName: nutzer.name,
    })
    .from(einladungen)
    .innerJoin(mandanten, eq(mandanten.id, einladungen.mandantId))
    .leftJoin(nutzer, eq(nutzer.id, einladungen.eingeladenVon))
    .where(eq(einladungen.token, token))
    .limit(1);
  return row ?? null;
}

import { mandanten } from "@/db/schema";
