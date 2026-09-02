/**
 * Seed für den Demo-Mandanten „Agentur Nordlicht".
 *
 * Setzt nur diesen Mandanten zurück (inklusive seiner vier Personen) und legt
 * ihn neu an. Andere Mandanten bleiben unberührt. Aufruf: `pnpm db:seed`.
 * Alle Fälligkeiten und Zeiteinträge sind relativ zum heutigen Datum.
 */
import "./env";

import { eq, inArray } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "../db";
import {
  aufgaben,
  kunden,
  mandanten,
  mitgliedschaften,
  nutzer,
  projekte,
  zeiteintraege,
  type Spalte,
} from "../db/schema";
import { heuteISO, tageAddieren } from "../lib/format";

const SLUG = "agentur-nordlicht";
const PASSWORT = "nordlicht2026";

const TEAM = [
  { key: "tessa", name: "Tessa Mahler", email: "tessa.mahler@agentur-nordlicht.de", rolle: "admin", wochenstunden: 30 },
  { key: "jana", name: "Jana Petersen", email: "jana.petersen@agentur-nordlicht.de", rolle: "mitglied", wochenstunden: 40 },
  { key: "ben", name: "Ben Aydin", email: "ben.aydin@agentur-nordlicht.de", rolle: "mitglied", wochenstunden: 32 },
  { key: "tobias", name: "Tobias Krüger", email: "tobias.krueger@agentur-nordlicht.de", rolle: "mitglied", wochenstunden: 40 },
] as const;

type Person = (typeof TEAM)[number]["key"];

const KUNDEN = [
  { key: "hafenstadt", name: "Hafenstadt Immobilien GmbH", ansprechpartner: "Dr. Lena Voss", email: "l.voss@hafenstadt-immobilien.de", notiz: "Makler mit drei Standorten, Entscheidungen laufen über Frau Voss." },
  { key: "deichbaecker", name: "Deichbäcker Backhaus KG", ansprechpartner: "Malte Hansen", email: "hansen@deichbaecker.de", notiz: "Familienbetrieb, 14 Filialen in Nordfriesland." },
  { key: "kuestenwind", name: "Küstenwind Energie AG", ansprechpartner: "Sören Lüdtke", email: "s.luedtke@kuestenwind-energie.de", notiz: "Retainer seit Januar, Abrechnung monatlich." },
  { key: "speicherstadt", name: "Speicherstadt Kaffee Rösterei", ansprechpartner: "Anna Behrens", email: "anna@speicherstadt-kaffee.de", notiz: null },
  { key: "elbterrassen", name: "Elbterrassen Hotel & Spa", ansprechpartner: "Katrin Oelke", email: "k.oelke@elbterrassen-hotel.de", notiz: "Budget für 2027 noch nicht freigegeben." },
] as const;

type KundeKey = (typeof KUNDEN)[number]["key"];

type AufgabeSeed = {
  titel: string;
  spalte: Spalte;
  wer: Person | null;
  faelligIn: number | null; // Tage relativ zu heute
  tag: string | null;
};

type ProjektSeed = {
  key: string;
  name: string;
  kunde: KundeKey;
  typ: "website" | "kampagne" | "retainer" | "marke" | "sonstiges";
  status: "laufend" | "pausiert" | "abgeschlossen";
  beschreibung: string;
  budgetStunden: number | null;
  startVor: number; // Tage vor heute
  endeIn: number | null; // Tage nach heute
  aufgaben: AufgabeSeed[];
  zeitPersonen: Person[];
  zeitGewicht: number;
};

const PROJEKTE: ProjektSeed[] = [
  {
    key: "hafenstadt-relaunch",
    name: "Relaunch Hafenstadt Immobilien",
    kunde: "hafenstadt",
    typ: "website",
    status: "laufend",
    beschreibung: "Neue Website mit Objektsuche und Anbindung an das Maklerportal. Livegang vor der Herbstmesse.",
    budgetStunden: 320,
    startVor: 16,
    endeIn: 86,
    aufgaben: [
      { titel: "Kickoff-Termin mit Frau Voss bestätigen", spalte: "offen", wer: "jana", faelligIn: 1, tag: "Discovery" },
      { titel: "Zugänge zum Maklerportal anfragen", spalte: "offen", wer: "tobias", faelligIn: 3, tag: "Discovery" },
      { titel: "Wettbewerbsanalyse Immobilienportale", spalte: "offen", wer: "jana", faelligIn: 7, tag: "Discovery" },
      { titel: "Moodboard für zwei Richtungen", spalte: "offen", wer: "ben", faelligIn: 9, tag: "Design" },
      { titel: "Seitenstruktur entwerfen", spalte: "in_arbeit", wer: "ben", faelligIn: 5, tag: "Design" },
      { titel: "Staging-Umgebung aufsetzen", spalte: "in_arbeit", wer: "tobias", faelligIn: 2, tag: "Umsetzung" },
      { titel: "Angebot und Zeitplan abgestimmt", spalte: "erledigt", wer: "tessa", faelligIn: -9, tag: "Discovery" },
      { titel: "Analytics-Export der alten Seite gesichert", spalte: "erledigt", wer: "tobias", faelligIn: -4, tag: "Discovery" },
    ],
    zeitPersonen: ["tessa", "jana", "ben", "tobias"],
    zeitGewicht: 3,
  },
  {
    key: "deichbaecker-herbst",
    name: "Herbstkampagne Deichbäcker",
    kunde: "deichbaecker",
    typ: "kampagne",
    status: "laufend",
    beschreibung: "Regionale Kampagne zum Erntedank: Plakate in Nordfriesland, Social Ads, Landingpage mit Filialfinder.",
    budgetStunden: 120,
    startVor: 9,
    endeIn: 44,
    aufgaben: [
      { titel: "Mediaplan mit Außenwerber abstimmen", spalte: "offen", wer: "jana", faelligIn: 2, tag: "Schaltung" },
      { titel: "Reporting-Vorlage anlegen", spalte: "offen", wer: "jana", faelligIn: 14, tag: "Reporting" },
      { titel: "Key Visual finalisieren", spalte: "in_arbeit", wer: "ben", faelligIn: -1, tag: "Produktion" },
      { titel: "Landingpage mit Filialfinder", spalte: "in_arbeit", wer: "tobias", faelligIn: 6, tag: "Produktion" },
      { titel: "Kampagnenidee präsentiert", spalte: "erledigt", wer: "tessa", faelligIn: -7, tag: "Konzept" },
      { titel: "Fotoshooting in der Backstube organisiert", spalte: "erledigt", wer: "jana", faelligIn: -3, tag: "Produktion" },
      { titel: "Claim-Varianten getestet", spalte: "erledigt", wer: "ben", faelligIn: -5, tag: "Konzept" },
    ],
    zeitPersonen: ["jana", "ben", "tobias"],
    zeitGewicht: 2,
  },
  {
    key: "kuestenwind-retainer",
    name: "Retainer Küstenwind Energie",
    kunde: "kuestenwind",
    typ: "retainer",
    status: "laufend",
    beschreibung: "Laufende Betreuung: monatlicher Newsletter, Redaktionsplan LinkedIn, kleine Anpassungen an der Website.",
    budgetStunden: 32,
    startVor: 240,
    endeIn: null,
    aufgaben: [
      { titel: "Newsletter Oktober: Themen sammeln", spalte: "offen", wer: "jana", faelligIn: 12, tag: "Redaktion" },
      { titel: "LinkedIn-Redaktionsplan Oktober", spalte: "offen", wer: "jana", faelligIn: 16, tag: "Redaktion" },
      { titel: "Newsletter September: Texte", spalte: "in_arbeit", wer: "jana", faelligIn: 4, tag: "Redaktion" },
      { titel: "Stellenanzeigen-Seite anpassen", spalte: "in_arbeit", wer: "tobias", faelligIn: 8, tag: "Website" },
      { titel: "Monatsreport August versendet", spalte: "erledigt", wer: "tessa", faelligIn: -2, tag: "Reporting" },
      { titel: "Newsletter August", spalte: "erledigt", wer: "jana", faelligIn: -12, tag: "Redaktion" },
      { titel: "Cookie-Banner aktualisiert", spalte: "erledigt", wer: "tobias", faelligIn: -15, tag: "Website" },
    ],
    zeitPersonen: ["tessa", "jana", "tobias"],
    zeitGewicht: 1,
  },
  {
    key: "speicherstadt-marke",
    name: "Markenauftritt Speicherstadt Kaffee",
    kunde: "speicherstadt",
    typ: "marke",
    status: "abgeschlossen",
    beschreibung: "Logo-Überarbeitung, Verpackungsdesign für drei Sorten, kompakter Styleguide.",
    budgetStunden: 80,
    startVor: 121,
    endeIn: -33,
    aufgaben: [
      { titel: "Logo-Überarbeitung", spalte: "erledigt", wer: "ben", faelligIn: -90, tag: "Design" },
      { titel: "Verpackung für drei Sorten", spalte: "erledigt", wer: "ben", faelligIn: -60, tag: "Design" },
      { titel: "Druckabnahme in der Druckerei", spalte: "erledigt", wer: "jana", faelligIn: -40, tag: "Produktion" },
      { titel: "Styleguide übergeben", spalte: "erledigt", wer: "tessa", faelligIn: -33, tag: "Übergabe" },
    ],
    zeitPersonen: [],
    zeitGewicht: 0,
  },
  {
    key: "elbterrassen-website",
    name: "Website Elbterrassen Hotel",
    kunde: "elbterrassen",
    typ: "website",
    status: "pausiert",
    beschreibung: "Neue Website mit Buchungsanbindung. Pausiert, bis das Budget für 2027 freigegeben ist.",
    budgetStunden: 200,
    startVor: 79,
    endeIn: null,
    aufgaben: [
      { titel: "Buchungssystem-Anbieter vergleichen", spalte: "offen", wer: "tobias", faelligIn: null, tag: "Discovery" },
      { titel: "Bildsprache mit der Hotelleitung abstimmen", spalte: "offen", wer: "ben", faelligIn: null, tag: "Design" },
      { titel: "Anforderungsworkshop", spalte: "erledigt", wer: "tessa", faelligIn: -70, tag: "Discovery" },
    ],
    zeitPersonen: [],
    zeitGewicht: 0,
  },
];

const NOTIZEN: Record<string, string[]> = {
  "hafenstadt-relaunch": ["Seitenstruktur, zweite Runde", "Abstimmung mit Frau Voss", "Staging und Deploy-Pipeline", "Wettbewerbsrecherche", "Moodboard Richtung A", "Anforderungen Objektsuche"],
  "deichbaecker-herbst": ["Key Visual, Farbvarianten", "Mediaplan Nordfriesland", "Filialfinder: Datenimport", "Textvarianten Plakat", "Abstimmung Fotograf"],
  "kuestenwind-retainer": ["Newsletter September", "LinkedIn-Posts Woche 36", "Stellenanzeigen-Seite", "Monatsreport", "Kleine Textkorrekturen"],
};

/** Deterministischer Zufall, damit der Seed bei jedem Lauf gleich aussieht. */
function zufall(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

async function main() {
  const heute = heuteISO();
  console.log(`Seed für ${SLUG}, heute ist ${heute}`);

  // Alten Stand entfernen: Mandant (kaskadiert) und die Demo-Personen
  const [alt] = await db.select({ id: mandanten.id }).from(mandanten).where(eq(mandanten.slug, SLUG));
  if (alt) {
    await db.delete(mandanten).where(eq(mandanten.id, alt.id));
    console.log("Alten Mandanten entfernt");
  }
  await db.delete(nutzer).where(inArray(nutzer.email, TEAM.map((t) => t.email)));

  const [mandant] = await db
    .insert(mandanten)
    .values({ name: "Agentur Nordlicht", slug: SLUG, plaetze: 12 })
    .returning();

  const hash = await bcrypt.hash(PASSWORT, 10);
  const personen: Record<Person, string> = {} as Record<Person, string>;
  for (const t of TEAM) {
    const [n] = await db.insert(nutzer).values({ name: t.name, email: t.email, passwortHash: hash }).returning();
    personen[t.key] = n.id;
    await db.insert(mitgliedschaften).values({
      mandantId: mandant.id,
      nutzerId: n.id,
      rolle: t.rolle,
      wochenstunden: t.wochenstunden,
    });
  }
  console.log(`${TEAM.length} Personen angelegt`);

  const kundenIds: Record<KundeKey, string> = {} as Record<KundeKey, string>;
  for (const k of KUNDEN) {
    const [row] = await db
      .insert(kunden)
      .values({ mandantId: mandant.id, name: k.name, ansprechpartner: k.ansprechpartner, email: k.email, notiz: k.notiz })
      .returning();
    kundenIds[k.key] = row.id;
  }
  console.log(`${KUNDEN.length} Kunden angelegt`);

  const projektIds: Record<string, string> = {};
  let aufgabenZahl = 0;
  for (const p of PROJEKTE) {
    const [row] = await db
      .insert(projekte)
      .values({
        mandantId: mandant.id,
        kundeId: kundenIds[p.kunde],
        name: p.name,
        typ: p.typ,
        status: p.status,
        beschreibung: p.beschreibung,
        budgetStunden: p.budgetStunden,
        startAm: tageAddieren(heute, -p.startVor),
        endeAm: p.endeIn === null ? null : tageAddieren(heute, p.endeIn),
      })
      .returning();
    projektIds[p.key] = row.id;

    let position = 0;
    for (const a of p.aufgaben) {
      await db.insert(aufgaben).values({
        projektId: row.id,
        titel: a.titel,
        spalte: a.spalte,
        verantwortlichId: a.wer ? personen[a.wer] : null,
        faelligAm: a.faelligIn === null ? null : tageAddieren(heute, a.faelligIn),
        tag: a.tag,
        position: position++,
        erledigtAm: a.spalte === "erledigt" ? new Date(`${tageAddieren(heute, a.faelligIn ?? -1)}T16:00:00Z`) : null,
      });
      aufgabenZahl++;
    }
  }
  console.log(`${PROJEKTE.length} Projekte mit ${aufgabenZahl} Aufgaben angelegt`);

  // Zeiteinträge: die letzten drei Wochen, nur Werktage bis heute
  const rnd = zufall(20260902);
  const laufende = PROJEKTE.filter((p) => p.status === "laufend" && p.zeitGewicht > 0);
  let eintraege = 0;
  for (let tage = 20; tage >= 0; tage--) {
    const datum = tageAddieren(heute, -tage);
    const wochentag = new Date(`${datum}T00:00:00Z`).getUTCDay();
    if (wochentag === 0 || wochentag === 6) continue;
    for (const t of TEAM) {
      const ziel = t.wochenstunden / 5; // Stunden pro Tag
      const passende = laufende.filter((p) => p.zeitPersonen.includes(t.key));
      if (passende.length === 0) continue;
      const anzahl = rnd() < 0.55 ? 2 : 1;
      let restMinuten = Math.round((ziel * (0.65 + rnd() * 0.5)) * 4) * 15;
      if (tage === 0) restMinuten = Math.round(restMinuten * 0.4);
      for (let i = 0; i < anzahl && restMinuten >= 30; i++) {
        const gewichtet = passende.flatMap((p) => Array<ProjektSeed>(p.zeitGewicht).fill(p));
        const p = gewichtet[Math.floor(rnd() * gewichtet.length)];
        const minuten = i === anzahl - 1 ? restMinuten : Math.max(30, Math.round((restMinuten * (0.4 + rnd() * 0.3)) / 15) * 15);
        restMinuten -= minuten;
        const notizen = NOTIZEN[p.key];
        await db.insert(zeiteintraege).values({
          mandantId: mandant.id,
          projektId: projektIds[p.key],
          nutzerId: personen[t.key],
          datum,
          minuten,
          notiz: notizen[Math.floor(rnd() * notizen.length)],
        });
        eintraege++;
      }
    }
  }
  console.log(`${eintraege} Zeiteinträge angelegt`);
  console.log(`Fertig. Demo-Login: ${TEAM[0].email} / ${PASSWORT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
