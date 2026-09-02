import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-page">
      <div className="auth-top">
        <Link href="/" className="brand">
          Klar<em>werk</em>
        </Link>
        <Link href="/" className="link" style={{ fontSize: 13 }}>
          Zur Anwendung
        </Link>
      </div>
      <div className="legal">{children}</div>
      <footer className="auth-foot">
        <span>Beyond7 GmbH</span>
        <Link href="/impressum">Impressum</Link>
        <Link href="/datenschutz">Datenschutz</Link>
      </footer>
    </div>
  );
}
