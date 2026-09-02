/**
 * Sidebar: Logo, Navigation, unten Mandant mit Platzbelegung.
 * Props: mandantName, plaetzeBelegt, plaetze.
 * Beispiel: <Sidebar mandantName="Agentur Nordlicht" plaetzeBelegt={4} plaetze={12} />
 */
import Link from "next/link";
import { NavLinks } from "./NavLinks";

type Props = { mandantName: string; plaetzeBelegt: number; plaetze: number };

export function Sidebar({ mandantName, plaetzeBelegt, plaetze }: Props) {
  return (
    <aside className="side">
      <Link href="/projekte" className="brand" aria-label="Klarwerk, zur Projektübersicht">
        Klar<em>werk</em>
      </Link>
      <NavLinks />
      <div className="side-foot">
        <strong>{mandantName}</strong>
        {plaetzeBelegt} von {plaetze} Plätzen belegt
        <div className="side-legal">
          <Link href="/impressum">Impressum</Link> · <Link href="/datenschutz">Datenschutz</Link>
        </div>
      </div>
    </aside>
  );
}
