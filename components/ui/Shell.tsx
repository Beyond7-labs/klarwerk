/**
 * Anwendungsrahmen: Sidebar links, Kopfzeile oben, Inhalt in der Fläche.
 * Props: mandantName, plaetzeBelegt, plaetze, nutzerName, children.
 * Beispiel:
 *   <Shell mandantName="Agentur Nordlicht" plaetzeBelegt={4} plaetze={12} nutzerName="Tessa Mahler">
 *     <PageHeader title="Projekte" />
 *   </Shell>
 */
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type Props = {
  mandantName: string;
  plaetzeBelegt: number;
  plaetze: number;
  nutzerName: string;
  children: ReactNode;
};

export function Shell({ mandantName, plaetzeBelegt, plaetze, nutzerName, children }: Props) {
  return (
    <div className="shell">
      <Sidebar mandantName={mandantName} plaetzeBelegt={plaetzeBelegt} plaetze={plaetze} />
      <main className="main">
        <Topbar nutzerName={nutzerName} />
        <div className="canvas">{children}</div>
      </main>
    </div>
  );
}
