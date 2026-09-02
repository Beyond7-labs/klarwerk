# Klarwerk

**Klarwerk** ist ein Projektmanagement-Tool für Agenturen mit 5 bis 30 Mitarbeitenden: Projekte als Boards, Auslastung, Zeiterfassung, Kunden. Ein fiktives, aber echtes Produkt: es läuft, man kann sich anmelden und damit arbeiten.

Es entsteht als „bestehendes Produkt" für den t3n-Onlinekurs **Prototyping für Product Manager** (14.10.2026) von Hendrik Hemken, Beyond7. Im Kurs wird gezeigt, wie ein Product Manager aus Nutzerinterviews eine Produktentscheidung ableitet, dafür drei Lösungsansätze im Look des eigenen Produkts prototypisiert und die riskanteste Annahme testet. Dafür braucht es ein Produkt mit eigener Gestaltung und echtem Code, das Claude Code als Kontext bekommt. Das ist Klarwerk.

*Klarwerk is a fictional agency project-management SaaS, built as the "existing product" for a German product-management course. UI and docs are in German.*

## Status

Scaffold. Stil-Steckbrief steht, Anwendung folgt.

| Datei | Inhalt |
|---|---|
| `STYLEGUIDE.md` | Farben (hell/dunkel), Schriften, Bausteine, Tonalität. Bindend für alles, was hier gebaut wird |
| `CLAUDE.md` | Arbeitsregeln für Claude Code in diesem Repo |

## Geplanter Stack

Next.js (App Router), Postgres (Neon, Region Frankfurt), Anmeldung per E-Mail, Hosting auf Vercel. Stack-Entscheidungen stehen in `CLAUDE.md`, offene sind dort markiert.

## Verwendung im Kurs

Der Kurs arbeitet in einem separaten Ordner (`klarwerk-pm`), in den dieses Repo geklont wird. Prototypen entstehen dort und nutzen die Komponenten und den Stil-Steckbrief von hier. Prototypen gehen nie zurück in dieses Repo, sie sind Wegwerfware mit Restwert.

## Lizenz und Betrieb

Betreiber der Live-Instanz ist die Beyond7 GmbH, Hamburg. Impressum und Datenschutzerklärung werden vor der öffentlichen Anmeldung ergänzt. Lizenz: noch nicht festgelegt.
