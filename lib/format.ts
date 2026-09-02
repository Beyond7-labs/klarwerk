/**
 * Formatierung und Bezeichnungen: Datum, Dauer, Initialen, Labels für Enums.
 * Alles auf Deutsch, Zeitzone Europe/Berlin.
 */
import type { ProjektStatus, ProjektTyp, Spalte } from "@/db/schema";

export const ZEITZONE = "Europe/Berlin";

export const PROJEKT_TYP_LABEL: Record<ProjektTyp, string> = {
  website: "Website",
  kampagne: "Kampagne",
  retainer: "Retainer",
  marke: "Marke",
  sonstiges: "Sonstiges",
};

export const PROJEKT_STATUS_LABEL: Record<ProjektStatus, string> = {
  laufend: "Läuft",
  pausiert: "Pausiert",
  abgeschlossen: "Abgeschlossen",
};

export const SPALTEN: { key: Spalte; label: string }[] = [
  { key: "offen", label: "Offen" },
  { key: "in_arbeit", label: "In Arbeit" },
  { key: "erledigt", label: "Erledigt" },
];

/** Heutiges Datum in Berlin als YYYY-MM-DD. */
export function heuteISO(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: ZEITZONE }).format(
    new Date(),
  );
}

/** Verschiebt ein ISO-Datum um n Tage. */
export function tageAddieren(iso: string, tage: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + tage);
  return d.toISOString().slice(0, 10);
}

/** Montag der Woche, in der das ISO-Datum liegt. */
export function wochenStart(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  const tag = (d.getUTCDay() + 6) % 7; // Montag = 0
  return tageAddieren(iso, -tag);
}

export function formatDatum(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(d);
}

export function formatDatumLang(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

/** Relative Fälligkeit für Aufgabenkarten: „heute", „morgen", „überfällig", sonst Datum. */
export function faelligkeitsText(iso: string | null | undefined): {
  text: string;
  ueberfaellig: boolean;
} {
  if (!iso) return { text: "", ueberfaellig: false };
  const heute = heuteISO();
  if (iso < heute) return { text: `überfällig seit ${formatDatum(iso)}`, ueberfaellig: true };
  if (iso === heute) return { text: "fällig heute", ueberfaellig: false };
  if (iso === tageAddieren(heute, 1)) return { text: "fällig morgen", ueberfaellig: false };
  return { text: `fällig ${formatDatum(iso)}`, ueberfaellig: false };
}

export function formatStunden(minuten: number): string {
  const h = minuten / 60;
  return `${h.toLocaleString("de-DE", { maximumFractionDigits: 1 })} h`;
}

export function prozent(anteil: number, ganzes: number): number {
  if (!ganzes) return 0;
  return Math.round((anteil / ganzes) * 100);
}

export function initialen(name: string): string {
  const teile = name.trim().split(/\s+/).filter(Boolean);
  if (teile.length === 0) return "?";
  if (teile.length === 1) return teile[0].slice(0, 2).toUpperCase();
  return (teile[0][0] + teile[teile.length - 1][0]).toUpperCase();
}

export function vorname(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "agentur";
}

export function plural(n: number, eins: string, viele: string): string {
  return `${n} ${n === 1 ? eins : viele}`;
}
