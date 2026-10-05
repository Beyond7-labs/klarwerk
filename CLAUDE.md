# CLAUDE.md — Klarwerk (Produkt-Repo)

Wir befinden uns im Jahr 2026. Sprache: Deutsch, Du. Oberfläche, Texte, Commits: Deutsch.

## Was das hier ist

Klarwerk ist ein Projektmanagement-Tool für Agenturen (5 bis 30 Mitarbeitende). Module: Projekte (Boards mit Aufgaben, Verantwortlichen, Fälligkeiten), Auslastung, Zeiten, Kunden, Einstellungen. Mandantenfähig: eine Agentur ist ein Mandant, Nutzer:innen kommen per Einladung dazu. Beispiel-Mandant: Agentur Nordlicht.

Es ist ein fiktives Produkt mit echtem Code (Beyond7). Es muss nach einem echten Produkt aussehen, und der Code muss so aufgeräumt sein, dass Prototypen in einem anderen Ordner im gleichen Look entstehen können.

## Stack

| Baustein | Entscheidung | Status |
|---|---|---|
| Framework | Next.js 16, App Router, TypeScript, Drizzle ORM | gesetzt |
| Datenbank | Postgres bei Neon, Region Frankfurt (EU), als Vercel-Marketplace-Ressource `klarwerk-db` am Vercel-Projekt | gesetzt |
| Anmeldung | E-Mail und Passwort (bcrypt, Sitzung als httpOnly-Cookie). Jede Person kann eine Agentur anlegen oder per Einladungslink beitreten. Einladungen werden als Link erzeugt, kein Mailversand | gesetzt (Magic Link später möglich, braucht Mailanbieter) |
| Hosting | Vercel, Team `beyond7products` | gesetzt |
| Styling | CSS-Variablen aus `STYLEGUIDE.md`, keine UI-Bibliothek mit eigenem Look | gesetzt |
| Analytics | nur Vercel Web Analytics, kein weiteres Tracking | gesetzt |
| Lizenz | MIT | gesetzt |

## Regeln

1. **`STYLEGUIDE.md` ist bindend.** Farben nur über die dort definierten Tokens, Schriften Bricolage Grotesque und IBM Plex Sans, Radius 10, Sidebar Navy. Wenn etwas im Steckbrief fehlt, erst dort ergänzen, dann bauen.
2. **Komponenten wiederverwendbar halten.** Alle UI-Bausteine liegen unter `components/ui/` mit kurzer Doku im Dateikopf (Zweck, Props, Beispiel). Prototypen in anderen Ordnern importieren oder kopieren von dort.
3. **Realistische Daten.** Seed-Daten für den Mandanten Agentur Nordlicht: 12 Plätze, 4 belegt, laufende Projekte mit deutschen Agentur-Namen (Website-Relaunch, Kampagne, Retainer). Keine Lorem-ipsum-Texte, keine echten Personen.
4. **Onboarding nur per Produktentscheidung ändern.** Heute: nach dem ersten Login ein Projekte-Screen mit dem Button „Neues Projekt". Änderungen daran (Wizard, Vorlagen, Hilfestellungen) erst, wenn sie als Produktentscheidung getroffen sind.
5. **Öffentliche Anmeldung braucht Rechtsseiten.** Impressum und Datenschutzerklärung (Betreiber Beyond7 GmbH, Hamburg; Datenhaltung EU; Löschung auf Anfrage) müssen live sein, bevor die Registrierung offen ist.
6. **Keine Geheimnisse im Repo.** `.env*` ist ignoriert, Zugangsdaten kommen aus den Vercel-Umgebungsvariablen.
7. **Prototypen gehören nicht hierher.** Sie entstehen in einem eigenen Arbeitsordner. Hier landet nur, was als Produktentscheidung getroffen und gebaut wurde.

## Vercel

Deploy nur aus diesem Ordner. Vor jedem Vercel-Befehl `.vercel/project.json` prüfen: die `orgId` muss zum Team `beyond7products` gehören. Kein `vercel link` auf ein anderes Team.

## Stand und Arbeitsweise

**Gebaut (02.09.2026):** Meilensteine 1 bis 5. Shell, Anmeldung, Einladung, Module Projekte (Boards), Kunden, Zeiten, Auslastung, Einstellungen, Impressum, Datenschutz. Deploy im Vercel-Team `beyond7products`, Projekt `klarwerk`.

**Ordner:**
- `app/` Seiten. `(auth)` Anmelden, Registrieren, Einladung. `(app)` alles hinter dem Login mit der Shell im Layout. `(legal)` Impressum, Datenschutz.
- `components/ui/` alle UI-Bausteine, je Datei ein Kopfkommentar mit Zweck, Props, Beispiel. `index.ts` exportiert alles.
- `app/globals.css` Tokens (hell/dunkel) und Komponentenklassen. Keine UI-Bibliothek.
- `db/schema.ts` Datenmodell (Drizzle), `db/index.ts` Client (Neon HTTP).
- `lib/auth.ts` Sitzungen, `lib/data.ts` lesende Abfragen, `lib/actions.ts` Server Actions, `lib/format.ts` Datum, Dauer, Labels.
- `scripts/seed.ts` Demo-Mandant Agentur Nordlicht, per `pnpm db:seed` zurücksetzbar.
- `design/` Prototyp-Referenz vom 28.08.2026 (Shell übernommen, Wizard bewusst nicht).

**Befehle:** `pnpm dev` (lokal), `pnpm build`, `pnpm db:push` (Schema in Neon), `pnpm db:seed`. Env-Variablen: `vercel env pull .env.local`.

**Demo-Zugang:** `tessa.mahler@agentur-nordlicht.de` / `nordlicht2026`, oder auf der Anmeldeseite „Demo-Agentur Nordlicht öffnen".

**Onboarding (Regel 4) konkret:** Neue Agentur, erster Login, `/projekte` zeigt eine Karte „Noch keine Projekte" mit einem Satz und dem Button „Neues Projekt".

**Offen (Kür):** Drag-and-drop auf dem Board, Konto löschen in der Oberfläche.
