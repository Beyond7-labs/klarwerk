/**
 * Rahmen für Anmelden, Registrieren, Einladung: Marke oben, Karte mittig, Rechtslinks unten.
 * Props: title, lede, children, alt (Bereich unter dem Formular).
 * Beispiel: <AuthFrame title="Anmelden" lede="Mit E-Mail und Passwort."> <form …/> </AuthFrame>
 */
import Link from "next/link";
import type { ReactNode } from "react";

export function AuthFrame({
  title,
  lede,
  children,
  alt,
}: {
  title: string;
  lede?: string;
  children: ReactNode;
  alt?: ReactNode;
}) {
  return (
    <div className="auth-page">
      <div className="auth-top">
        <Link href="/" className="brand">
          Klar<em>werk</em>
        </Link>
        <span className="muted" style={{ fontSize: 13 }}>
          Projektmanagement für Agenturen
        </span>
      </div>
      <div className="auth-wrap">
        <div className="kw-card pad auth-card">
          <h2>{title}</h2>
          {lede && <p className="lede">{lede}</p>}
          {children}
          {alt && <div className="auth-alt">{alt}</div>}
        </div>
      </div>
      <footer className="auth-foot">
        <span>Beyond7 GmbH</span>
        <Link href="/impressum">Impressum</Link>
        <Link href="/datenschutz">Datenschutz</Link>
      </footer>
    </div>
  );
}
