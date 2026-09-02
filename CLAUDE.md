# CLAUDE.md — Klarwerk (Produkt-Repo)

Wir befinden uns im Jahr 2026. Sprache: Deutsch, Du. Oberfläche, Texte, Commits: Deutsch.

## Was das hier ist

Klarwerk ist ein Projektmanagement-Tool für Agenturen (5 bis 30 Mitarbeitende). Module: Projekte (Boards mit Aufgaben, Verantwortlichen, Fälligkeiten), Auslastung, Zeiten, Kunden, Einstellungen. Mandantenfähig: eine Agentur ist ein Mandant, Nutzer:innen kommen per Einladung dazu. Beispiel-Mandant: Agentur Nordlicht.

Es ist ein fiktives Produkt mit echtem Code. Es entsteht für einen Onlinekurs (t3n, „Prototyping für Product Manager", 14.10.2026) und dient dort als bestehendes Produkt, an das ein Product Manager mit Claude Code andockt. Deshalb zählt hier zweierlei: es muss nach einem echten Produkt aussehen, und der Code muss so aufgeräumt sein, dass Claude in einem anderen Ordner daraus Prototypen im gleichen Look bauen kann.

## Stack

| Baustein | Entscheidung | Status |
|---|---|---|
| Framework | Next.js, App Router, JavaScript oder TypeScript | offen: TS empfohlen |
| Datenbank | Postgres bei Neon, Region Frankfurt (EU) | gesetzt |
| Anmeldung | per E-Mail, jede Person kann sich registrieren und einen Mandanten anlegen oder per Einladung beitreten | offen: Magic Link vs. Passwort |
| Hosting | Vercel, Team `beyond7products` | gesetzt |
| Styling | CSS-Variablen aus `STYLEGUIDE.md`, keine UI-Bibliothek mit eigenem Look | gesetzt |
| Analytics | nur Vercel Web Analytics, kein weiteres Tracking | gesetzt |

## Regeln

1. **`STYLEGUIDE.md` ist bindend.** Farben nur über die dort definierten Tokens, Schriften Bricolage Grotesque und IBM Plex Sans, Radius 10, Sidebar Navy. Wenn etwas im Steckbrief fehlt, erst dort ergänzen, dann bauen.
2. **Komponenten wiederverwendbar halten.** Alle UI-Bausteine liegen unter `components/ui/` mit kurzer Doku im Dateikopf (Zweck, Props, Beispiel). Der Kurs-Ordner importiert oder kopiert von dort.
3. **Realistische Daten.** Seed-Daten für den Mandanten Agentur Nordlicht: 12 Plätze, 4 belegt, laufende Projekte mit deutschen Agentur-Namen (Website-Relaunch, Kampagne, Retainer). Keine Lorem-ipsum-Texte, keine echten Personen.
4. **Onboarding bleibt absichtlich schwach.** Nach dem ersten Login: leerer Projekte-Screen mit dem Button „Neues Projekt". Das ist die offene Produktfrage des Kurses. Kein Wizard, keine Vorlagen, keine Hilfestellungen einbauen, auch wenn es sich aufdrängt.
5. **Öffentliche Anmeldung braucht Rechtsseiten.** Impressum und Datenschutzerklärung (Betreiber Beyond7 GmbH, Hamburg; Datenhaltung EU; Löschung auf Anfrage) müssen live sein, bevor die Registrierung offen ist.
6. **Keine Geheimnisse im Repo.** `.env*` ist ignoriert, Zugangsdaten kommen aus den Vercel-Umgebungsvariablen.
7. **Prototypen gehören nicht hierher.** Sie entstehen im Kurs-Ordner. Hier landet nur, was als Produktentscheidung getroffen und gebaut wurde.

## Vercel

Deploy nur aus diesem Ordner. Vor jedem Vercel-Befehl `.vercel/project.json` prüfen: die `orgId` muss zum Team `beyond7products` gehören. Kein `vercel link` auf ein anderes Team.

## Start hier (für die Bau-Session)

**Was schon existiert:**
- `STYLEGUIDE.md`: die CI, bindend.
- `design/referenz-shell-und-onboarding-variante-a.html`: ein klickbarer Prototyp vom 28.08.2026. **Nutze daraus die Shell** (Sidebar, Kopfzeile, Karten, Auswahlkarten, Buttons, Tokens hell/dunkel) als visuelle Referenz für das Produkt. **Baue den Onboarding-Wizard darin nicht nach**, das ist Variante A einer Kursfrage, die im Produkt bewusst offen bleibt (Regel 4). Live als Artifact: https://claude.ai/code/artifact/b8700156-4ea1-4a8d-b8e6-74e42fe58ea1
- Es gibt kein weiteres Produkt. Alles ab hier ist neu.

**Zuerst klären, dann bauen** (Antworten in die Stack-Tabelle oben eintragen):
1. TypeScript oder JavaScript (Empfehlung: TypeScript)
2. Anmeldung: Magic Link oder Passwort (Empfehlung: Magic Link)
3. Lizenz des öffentlichen Repos (offen; MIT, falls Teilnehmer klonen und weiterbauen sollen)

**Meilensteine in dieser Reihenfolge:**
1. Next.js-Scaffold mit Shell im Klarwerk-Look, Seed-Daten Agentur Nordlicht, lokal lauffähig
2. Postgres bei Neon (Frankfurt), Datenmodell: Mandant, Nutzer:in, Einladung, Projekt, Aufgabe, Kunde, Zeiteintrag
3. Anmeldung und Einladung, Mandant anlegen oder beitreten
4. Module Projekte (Boards), Kunden, Zeiten, Auslastung in dieser Reihenfolge, jeweils schmal
5. Impressum und Datenschutz, dann Vercel-Deploy im Team `beyond7products`, Registrierung öffnen
6. Screenshots der Live-Instanz nach `~/Desktop/klarwerk-pm/produkt/screenshots/`

Der Kurs braucht Meilenstein 1 bis 3 und ein sichtbares Modul Projekte. Der Rest ist Kür.
