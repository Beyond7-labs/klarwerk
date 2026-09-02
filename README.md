# Klarwerk

**Klarwerk** ist ein Projektmanagement-Tool für Agenturen mit 5 bis 30 Mitarbeitenden: Projekte als Boards, Auslastung, Zeiterfassung, Kunden. Ein fiktives, aber echtes Produkt: es läuft, man kann sich anmelden und damit arbeiten.

Es entsteht als „bestehendes Produkt" für den t3n-Onlinekurs **Prototyping für Product Manager** (14.10.2026) von Hendrik Hemken, Beyond7. Im Kurs wird gezeigt, wie ein Product Manager aus Nutzerinterviews eine Produktentscheidung ableitet, dafür drei Lösungsansätze im Look des eigenen Produkts prototypisiert und die riskanteste Annahme testet. Dafür braucht es ein Produkt mit eigener Gestaltung und echtem Code, das Claude Code als Kontext bekommt. Das ist Klarwerk.

*Klarwerk is a fictional agency project-management SaaS, built as the "existing product" for a German product-management course. UI and docs are in German.*

## Ausprobieren

Live: [klarwerk-theta.vercel.app](https://klarwerk-theta.vercel.app)

Demo-Agentur „Agentur Nordlicht" mit vier Personen, fünf Kunden, fünf Projekten und drei Wochen Zeiteinträgen:

- auf der Anmeldeseite „Demo-Agentur Nordlicht öffnen", oder
- `tessa.mahler@agentur-nordlicht.de` mit Passwort `nordlicht2026`

Oder eine eigene Agentur anlegen: „Agentur anlegen" auf der Anmeldeseite. Danach siehst du das Produkt so, wie es eine neue Nutzerin sieht.

## Was drin ist

| Modul | Inhalt |
|---|---|
| Projekte | Übersicht als Karten, pro Projekt ein Board mit Offen, In Arbeit, Erledigt. Aufgaben mit Verantwortlichen, Fälligkeit, Etikett |
| Auslastung | Gebuchte Stunden gegen Wochenstunden je Person, Budgets laufender Projekte |
| Zeiten | Zeiteinträge auf Projekte, Wochen-Summe |
| Kunden | Kundenliste mit Ansprechpersonen und Projektzahl |
| Einstellungen | Team, Einladungslinks mit Rolle, Agenturname, eigenes Konto |

Mandantenfähig: jede Agentur ist ein eigener Bereich. Nutzer:innen registrieren sich und legen eine Agentur an oder treten per Einladungslink bei.

## Stack

Next.js 16 (App Router, TypeScript, Server Actions), Postgres bei Neon in Frankfurt (über den Vercel-Marketplace am Vercel-Projekt), Drizzle ORM, Anmeldung mit E-Mail und Passwort, Hosting auf Vercel in der Region Frankfurt, Vercel Web Analytics. Keine UI-Bibliothek: Styles kommen aus `app/globals.css` mit den Tokens aus `STYLEGUIDE.md`.

## Lokal starten

```bash
pnpm install
vercel env pull .env.local   # zieht DATABASE_URL aus dem Vercel-Projekt
pnpm dev
```

Schema anlegen oder ändern: `pnpm db:push`. Demo-Mandanten zurücksetzen: `pnpm db:seed` (löscht nur Agentur Nordlicht und legt sie neu an).

## Ordner

| Pfad | Inhalt |
|---|---|
| `STYLEGUIDE.md` | Farben (hell/dunkel), Schriften, Bausteine, Tonalität. Bindend |
| `CLAUDE.md` | Arbeitsregeln für Claude Code in diesem Repo |
| `components/ui/` | Alle UI-Bausteine mit Kopfkommentar (Zweck, Props, Beispiel) |
| `app/globals.css` | Tokens und Komponentenklassen |
| `db/schema.ts` | Datenmodell: Mandant, Nutzer:in, Mitgliedschaft, Einladung, Kunde, Projekt, Aufgabe, Zeiteintrag |
| `lib/` | Sitzungen, Abfragen, Server Actions, Formatierung |
| `scripts/seed.ts` | Demo-Daten Agentur Nordlicht |
| `design/` | Klickbarer Prototyp vom 28.08.2026 als Referenz für die Shell |

## Verwendung im Kurs

Der Kurs arbeitet in einem separaten Ordner (`klarwerk-pm`), in den dieses Repo geklont wird. Prototypen entstehen dort und nutzen die Komponenten und den Stil-Steckbrief von hier. Prototypen gehen nie zurück in dieses Repo, sie sind Wegwerfware mit Restwert.

## Lizenz und Betrieb

Betreiber der Live-Instanz ist die Beyond7 GmbH, Hamburg. Impressum und Datenschutzerklärung sind Teil der Anwendung. Lizenz: MIT.
