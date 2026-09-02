/**
 * Navigations-Icons, 16 px, Strichstärke 1.6. Keine Emojis in der Oberfläche.
 * Beispiel: <IconProjekte />
 */
import type { SVGProps } from "react";

const basis: SVGProps<SVGSVGElement> = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export function IconProjekte(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...basis} {...props}>
      <rect x="3" y="4" width="5.5" height="16" rx="1.2" />
      <rect x="9.25" y="4" width="5.5" height="11" rx="1.2" />
      <rect x="15.5" y="4" width="5.5" height="7" rx="1.2" />
    </svg>
  );
}

export function IconAuslastung(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...basis} {...props}>
      <path d="M4 19h16" />
      <path d="M7 19V11" />
      <path d="M12 19V6" />
      <path d="M17 19v-5" />
    </svg>
  );
}

export function IconZeiten(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...basis} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function IconKunden(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...basis} {...props}>
      <path d="M4 20V6.5A1.5 1.5 0 0 1 5.5 5h7A1.5 1.5 0 0 1 14 6.5V20" />
      <path d="M14 10h4.5A1.5 1.5 0 0 1 20 11.5V20" />
      <path d="M3 20h18" />
      <path d="M7.5 9h3M7.5 12.5h3M7.5 16h3" />
    </svg>
  );
}

export function IconEinstellungen(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...basis} {...props}>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </svg>
  );
}

export function IconPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...basis} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
