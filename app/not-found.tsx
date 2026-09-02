import Link from "next/link";

export default function NichtGefunden() {
  return (
    <div className="auth-page">
      <div className="auth-top">
        <Link href="/" className="brand">
          Klar<em>werk</em>
        </Link>
      </div>
      <div className="auth-wrap">
        <div className="kw-card pad auth-card">
          <h2>Seite nicht gefunden</h2>
          <p className="lede">Der Link führt ins Leere. Vielleicht wurde das Projekt gelöscht.</p>
          <Link className="btn btn-primary" href="/projekte">
            Zu den Projekten
          </Link>
        </div>
      </div>
      <footer className="auth-foot" />
    </div>
  );
}
