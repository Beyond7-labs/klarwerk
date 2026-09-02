/**
 * Datenmodell Klarwerk.
 *
 * Ein Mandant ist eine Agentur. Nutzer:innen sind global (eine E-Mail, ein Konto)
 * und über Mitgliedschaften einem oder mehreren Mandanten zugeordnet. Alle
 * Fachdaten (Kunden, Projekte, Aufgaben, Zeiteinträge) hängen am Mandanten.
 */
import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const rolleEnum = pgEnum("rolle", ["admin", "mitglied"]);
export const projektTypEnum = pgEnum("projekt_typ", [
  "website",
  "kampagne",
  "retainer",
  "marke",
  "sonstiges",
]);
export const projektStatusEnum = pgEnum("projekt_status", [
  "laufend",
  "pausiert",
  "abgeschlossen",
]);
export const spalteEnum = pgEnum("spalte", ["offen", "in_arbeit", "erledigt"]);

const erstelltAm = () =>
  timestamp("erstellt_am", { withTimezone: true }).defaultNow().notNull();

export const mandanten = pgTable("mandanten", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  plaetze: integer("plaetze").notNull().default(12),
  erstelltAm: erstelltAm(),
});

export const nutzer = pgTable("nutzer", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwortHash: text("passwort_hash").notNull(),
  erstelltAm: erstelltAm(),
});

export const mitgliedschaften = pgTable(
  "mitgliedschaften",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mandantId: uuid("mandant_id")
      .notNull()
      .references(() => mandanten.id, { onDelete: "cascade" }),
    nutzerId: uuid("nutzer_id")
      .notNull()
      .references(() => nutzer.id, { onDelete: "cascade" }),
    rolle: rolleEnum("rolle").notNull().default("mitglied"),
    wochenstunden: integer("wochenstunden").notNull().default(40),
    erstelltAm: erstelltAm(),
  },
  (t) => [uniqueIndex("mitgliedschaft_eindeutig").on(t.mandantId, t.nutzerId)],
);

export const einladungen = pgTable(
  "einladungen",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mandantId: uuid("mandant_id")
      .notNull()
      .references(() => mandanten.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    rolle: rolleEnum("rolle").notNull().default("mitglied"),
    token: text("token").notNull().unique(),
    eingeladenVon: uuid("eingeladen_von").references(() => nutzer.id, {
      onDelete: "set null",
    }),
    angenommenAm: timestamp("angenommen_am", { withTimezone: true }),
    gueltigBis: timestamp("gueltig_bis", { withTimezone: true }).notNull(),
    erstelltAm: erstelltAm(),
  },
  (t) => [index("einladungen_mandant").on(t.mandantId)],
);

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tokenHash: text("token_hash").notNull().unique(),
  nutzerId: uuid("nutzer_id")
    .notNull()
    .references(() => nutzer.id, { onDelete: "cascade" }),
  mandantId: uuid("mandant_id")
    .notNull()
    .references(() => mandanten.id, { onDelete: "cascade" }),
  gueltigBis: timestamp("gueltig_bis", { withTimezone: true }).notNull(),
  erstelltAm: erstelltAm(),
});

export const kunden = pgTable(
  "kunden",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mandantId: uuid("mandant_id")
      .notNull()
      .references(() => mandanten.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    ansprechpartner: text("ansprechpartner"),
    email: text("email"),
    notiz: text("notiz"),
    erstelltAm: erstelltAm(),
  },
  (t) => [index("kunden_mandant").on(t.mandantId)],
);

export const projekte = pgTable(
  "projekte",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mandantId: uuid("mandant_id")
      .notNull()
      .references(() => mandanten.id, { onDelete: "cascade" }),
    kundeId: uuid("kunde_id").references(() => kunden.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    typ: projektTypEnum("typ").notNull().default("sonstiges"),
    status: projektStatusEnum("status").notNull().default("laufend"),
    beschreibung: text("beschreibung"),
    budgetStunden: integer("budget_stunden"),
    startAm: date("start_am", { mode: "string" }),
    endeAm: date("ende_am", { mode: "string" }),
    erstelltAm: erstelltAm(),
  },
  (t) => [index("projekte_mandant").on(t.mandantId)],
);

export const aufgaben = pgTable(
  "aufgaben",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projektId: uuid("projekt_id")
      .notNull()
      .references(() => projekte.id, { onDelete: "cascade" }),
    titel: text("titel").notNull(),
    beschreibung: text("beschreibung"),
    spalte: spalteEnum("spalte").notNull().default("offen"),
    verantwortlichId: uuid("verantwortlich_id").references(() => nutzer.id, {
      onDelete: "set null",
    }),
    faelligAm: date("faellig_am", { mode: "string" }),
    tag: text("tag"),
    position: integer("position").notNull().default(0),
    erledigtAm: timestamp("erledigt_am", { withTimezone: true }),
    erstelltAm: erstelltAm(),
  },
  (t) => [index("aufgaben_projekt").on(t.projektId)],
);

export const zeiteintraege = pgTable(
  "zeiteintraege",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mandantId: uuid("mandant_id")
      .notNull()
      .references(() => mandanten.id, { onDelete: "cascade" }),
    projektId: uuid("projekt_id")
      .notNull()
      .references(() => projekte.id, { onDelete: "cascade" }),
    nutzerId: uuid("nutzer_id")
      .notNull()
      .references(() => nutzer.id, { onDelete: "cascade" }),
    datum: date("datum", { mode: "string" }).notNull(),
    minuten: integer("minuten").notNull(),
    notiz: text("notiz"),
    erstelltAm: erstelltAm(),
  },
  (t) => [
    index("zeiteintraege_mandant_datum").on(t.mandantId, t.datum),
    index("zeiteintraege_projekt").on(t.projektId),
  ],
);

export type Mandant = typeof mandanten.$inferSelect;
export type Nutzer = typeof nutzer.$inferSelect;
export type Mitgliedschaft = typeof mitgliedschaften.$inferSelect;
export type Einladung = typeof einladungen.$inferSelect;
export type Kunde = typeof kunden.$inferSelect;
export type Projekt = typeof projekte.$inferSelect;
export type Aufgabe = typeof aufgaben.$inferSelect;
export type Zeiteintrag = typeof zeiteintraege.$inferSelect;
export type Rolle = (typeof rolleEnum.enumValues)[number];
export type ProjektTyp = (typeof projektTypEnum.enumValues)[number];
export type ProjektStatus = (typeof projektStatusEnum.enumValues)[number];
export type Spalte = (typeof spalteEnum.enumValues)[number];
