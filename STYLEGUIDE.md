---
description: "Stil-Steckbrief Klarwerk: Farben (hell und dunkel), Schriften, Bausteine, Tonalität. Gilt für alle Prototypen. Abgeleitet aus dem Onboarding-Prototyp vom 28.08.2026."
---

# Klarwerk Stil-Steckbrief

Klarwerk soll ruhig, handwerklich und vertrauenswürdig wirken: Papierton statt Weiß, Navy statt Schwarz, ein Messing-Akzent statt Signalfarben.

## Farben

| Token | Hell | Dunkel | Verwendung |
|---|---|---|---|
| `--paper` | `#F9F7F3` | `#121A2B` | Seitenhintergrund |
| `--surface` | `#FFFFFF` | `#1A2335` | Karten, Formulare |
| `--surface-2` | `#F2EFE8` | `#212B40` | abgesetzte Flächen, Tabs |
| `--ink` | `#1B2A4A` | `#EBE8E1` | Text, Sidebar-Hintergrund (hell), Primärbutton |
| `--ink-soft` | `#5A6479` | `#9BA4B6` | Sekundärtext |
| `--ink-faint` | `#8B93A5` | `#6E7891` | Hinweise, inaktive Schritte |
| `--line` | `#E3DFD6` | `#2C3750` | Linien, Rahmen |
| `--brass` | `#A8761F` | `#D6A44B` | Akzent: aktive Auswahl, Schrittzahl, Prototyp-Banner |
| `--brass-soft` | `#F0E4CB` | `#332C1C` | Akzent-Hintergrund |
| `--teal` | `#2E7D7B` | `#55A8A5` | Avatare, Status „läuft" |

Schatten: `0 1px 2px rgba(27,42,74,.06), 0 8px 24px rgba(27,42,74,.07)`. Radius: `10px`.

## Schrift

- **Überschriften:** Bricolage Grotesque, 500 und 700, Google Fonts
- **Fließtext:** IBM Plex Sans, 400/500/600, 15 px, Zeilenhöhe 1.5
- Fallback: `ui-sans-serif, system-ui, sans-serif`

## Bausteine

- **Sidebar** links, 216 px, Hintergrund `--ink`, heller Text, Logo „Klar**werk**" (zweiter Teil in Messing). Navigation: Projekte, Auslastung, Zeiten, Kunden, Einstellungen. Unten der Mandant mit Platzbelegung („Agentur Nordlicht · 4 von 12 Plätzen belegt").
- **Kopfzeile** mit Seitentitel links und Avatar rechts (Initialen auf Teal).
- **Karten** auf `--surface` mit `--line`-Rahmen, Radius 10.
- **Auswahlkarten** (Checkbox-Karten) mit Titel und Unterzeile; gewählt: Messing-Rahmen auf `--brass-soft`.
- **Stepper** mit nummerierten Kreisen, aktiver Schritt Messing.
- **Primärbutton** Navy mit hellem Text; **Sekundäraktion** als unterstrichener Textlink („Überspringen", „Später einladen").
- **Prototyp-Banner** ganz oben: Messing-Punkt, Versalien „PROTOTYP", dann „Variante A von 3 · erkundend gebaut, kein Produktionsstand".

## Tonalität

Deutsch, Du, kurze Sätze, erklärt den Nutzen: „Wir richten das erste Board danach ein. Ändern lässt sich das jederzeit." Kein Marketing-Ton, keine Ausrufezeichen. Hinweise nennen einen Grund: „Boards mit mindestens zwei Personen werden dreimal so oft weitergeführt."

## Vermeiden

Lila-Verläufe, Standard-Systemschrift, Emojis in der Oberfläche, Karten mit großen Schatten, generische Dashboard-Kacheln.
