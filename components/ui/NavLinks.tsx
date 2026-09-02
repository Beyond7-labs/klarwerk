"use client";
/**
 * Hauptnavigation der Sidebar. Markiert den aktiven Bereich über den Pfad.
 * Beispiel: <NavLinks />
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconAuslastung,
  IconEinstellungen,
  IconKunden,
  IconProjekte,
  IconZeiten,
} from "./Icons";

export const NAVIGATION = [
  { href: "/projekte", label: "Projekte", Icon: IconProjekte },
  { href: "/auslastung", label: "Auslastung", Icon: IconAuslastung },
  { href: "/zeiten", label: "Zeiten", Icon: IconZeiten },
  { href: "/kunden", label: "Kunden", Icon: IconKunden },
  { href: "/einstellungen", label: "Einstellungen", Icon: IconEinstellungen },
] as const;

export function NavLinks() {
  const pfad = usePathname();
  return (
    <nav className="nav" aria-label="Hauptnavigation">
      {NAVIGATION.map(({ href, label, Icon }) => {
        const aktiv = pfad === href || pfad.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} aria-current={aktiv ? "page" : undefined}>
            <Icon />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
