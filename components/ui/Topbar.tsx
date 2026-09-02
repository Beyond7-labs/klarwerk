"use client";
/**
 * Kopfzeile: Bereichstitel links (aus dem Pfad), Person mit Avatar rechts.
 * Props: nutzerName.
 * Beispiel: <Topbar nutzerName="Tessa Mahler" />
 */
import { usePathname } from "next/navigation";
import { Avatar } from "./Avatar";
import { NAVIGATION } from "./NavLinks";

export function Topbar({ nutzerName }: { nutzerName: string }) {
  const pfad = usePathname();
  const bereich = NAVIGATION.find((n) => pfad === n.href || pfad.startsWith(`${n.href}/`));
  const titel = pfad === "/projekte/neu" ? "Neues Projekt" : bereich?.label ?? "Klarwerk";
  return (
    <header className="top">
      <h1>{titel}</h1>
      <div className="top-right">
        <span className="who">{nutzerName}</span>
        <Avatar name={nutzerName} />
      </div>
    </header>
  );
}
