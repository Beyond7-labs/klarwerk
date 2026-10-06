/**
 * Projektvorlagen für den Start: typische Agenturprojekte mit Phasen und Beispielaufgaben.
 * Die Spalten im Board sind fest (Offen, In Arbeit, Erledigt). Die Phase einer Vorlage
 * landet deshalb als Etikett auf der Aufgabe, nicht als eigene Spalte.
 * Beispiel: vorlageFinden("relaunch")?.phasen[0].name === "Konzept"
 */
import type { ProjektTyp } from "@/db/schema";

export type Vorlage = {
  id: string;
  titel: string;
  text: string;
  typ: ProjektTyp;
  phasen: { name: string; aufgaben: string[] }[];
};

export const VORLAGEN: Vorlage[] = [
  {
    id: "relaunch",
    titel: "Relaunch in Phasen",
    text: "Website oder Shop, mit Abnahme nach jeder Phase",
    typ: "website",
    phasen: [
      { name: "Konzept", aufgaben: ["Kickoff mit dem Kunden", "Sitemap entwerfen"] },
      { name: "Design", aufgaben: ["Moodboard abstimmen", "Startseite gestalten"] },
      { name: "Umsetzung", aufgaben: ["Seiten umsetzen"] },
      { name: "Launch", aufgaben: ["Weiterleitungen prüfen", "Go-live mit dem Kunden"] },
    ],
  },
  {
    id: "kampagne",
    titel: "Kampagne mit Flights",
    text: "Kampagne in Wellen, Motive pro Flight",
    typ: "kampagne",
    phasen: [
      { name: "Vorbereitung", aufgaben: ["Briefing abstimmen", "Mediaplan erstellen"] },
      { name: "Flight 1", aufgaben: ["Motive Flight 1", "Schaltung starten"] },
      { name: "Flight 2", aufgaben: ["Motive nachschärfen"] },
      { name: "Auswertung", aufgaben: ["Kennzahlen zusammenfassen"] },
    ],
  },
  {
    id: "retainer",
    titel: "Content-Retainer",
    text: "Laufende Betreuung, Monat für Monat",
    typ: "retainer",
    phasen: [
      { name: "Oktober", aufgaben: ["Redaktionsplan Oktober", "Vier Beiträge"] },
      { name: "November", aufgaben: ["Redaktionsplan November"] },
      { name: "Dezember", aufgaben: ["Jahresrückblick vorbereiten", "Monatsreport an den Kunden"] },
    ],
  },
  {
    id: "event",
    titel: "Event",
    text: "Von der Einladung bis zur Nachbereitung",
    typ: "sonstiges",
    phasen: [
      { name: "Planung", aufgaben: ["Location anfragen", "Einladungsliste klären"] },
      { name: "Vorbereitung", aufgaben: ["Programm festlegen", "Material drucken"] },
      { name: "Veranstaltung", aufgaben: ["Ablaufplan vor Ort"] },
      { name: "Nachbereitung", aufgaben: ["Fotos an Gäste", "Feedback einholen"] },
    ],
  },
  {
    id: "branding",
    titel: "Branding",
    text: "Neue Marke oder Auffrischung",
    typ: "marke",
    phasen: [
      { name: "Analyse", aufgaben: ["Wettbewerb sichten", "Interviews mit dem Team"] },
      { name: "Strategie", aufgaben: ["Markenkern-Workshop"] },
      { name: "Gestaltung", aufgaben: ["Logo-Entwürfe", "Farben und Schriften"] },
      { name: "Übergabe", aufgaben: ["Markenhandbuch"] },
    ],
  },
];

export function vorlageFinden(id: string) {
  return VORLAGEN.find((v) => v.id === id) ?? null;
}
