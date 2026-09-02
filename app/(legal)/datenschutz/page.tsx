import type { Metadata } from "next";

export const metadata: Metadata = { title: "Datenschutzerklärung" };

export default function Datenschutz() {
  return (
    <>
      <h2>Datenschutzerklärung</h2>
      <p>Stand: 2. September 2026</p>

      <h3>1. Verantwortliche Stelle</h3>
      <address>
        Beyond7 GmbH
        <br />
        Kühnehöfe 13d, 22761 Hamburg
        <br />
        E-Mail: <a className="link" href="mailto:hendrik@beyond7.ai">hendrik@beyond7.ai</a>
      </address>

      <h3>2. Was Klarwerk ist</h3>
      <p>
        Klarwerk ist ein Projektmanagement-Werkzeug für Agenturen, das die Beyond7 GmbH für Schulungen zu Produktentwicklung
        und Prototyping betreibt. Jede Person kann sich registrieren, eine Agentur als eigenen Bereich anlegen oder per
        Einladung einer bestehenden Agentur beitreten.
      </p>

      <h3>3. Welche Daten wir verarbeiten</h3>
      <ul>
        <li>
          <strong>Konto:</strong> Name, E-Mail-Adresse und ein Passwort, das wir nur als Hash (bcrypt) speichern.
        </li>
        <li>
          <strong>Inhalte deiner Agentur:</strong> Name der Agentur, Kunden, Projekte, Aufgaben, Zeiteinträge und Einladungen,
          so wie du und dein Team sie eingeben.
        </li>
        <li>
          <strong>Sitzung:</strong> ein technisch notwendiges Cookie (<code>klarwerk_sitzung</code>), das dich nach der Anmeldung
          erkennt. Es enthält nur eine zufällige Kennung und läuft nach 30 Tagen ab.
        </li>
        <li>
          <strong>Server-Protokolle:</strong> unser Hosting-Anbieter verarbeitet beim Aufruf IP-Adresse, Zeitpunkt, aufgerufene
          Seite und Browser-Kennung zur Auslieferung und Absicherung des Dienstes.
        </li>
      </ul>

      <h3>4. Zweck und Rechtsgrundlage</h3>
      <p>
        Wir verarbeiten diese Daten, um dir Klarwerk zur Verfügung zu stellen (Art. 6 Abs. 1 lit. b DSGVO) und den Dienst sicher
        zu betreiben (Art. 6 Abs. 1 lit. f DSGVO). Es gibt kein Tracking zu Werbezwecken und keine Weitergabe an Dritte zu
        eigenen Zwecken.
      </p>

      <h3>5. Hosting und Datenbank</h3>
      <p>
        Die Anwendung läuft bei Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, USA) in der Region Frankfurt am Main.
        Die Datenbank betreibt Neon Inc. auf Servern in Frankfurt am Main (AWS eu-central-1). Mit beiden Anbietern bestehen
        Auftragsverarbeitungsverträge nach Art. 28 DSGVO; soweit eine Übermittlung in die USA nicht ausgeschlossen werden kann,
        stützt sie sich auf die EU-Standardvertragsklauseln und das EU-US Data Privacy Framework.
      </p>

      <h3>6. Reichweitenmessung</h3>
      <p>
        Wir nutzen Vercel Web Analytics. Der Dienst zählt Seitenaufrufe ohne Cookies und ohne geräteübergreifende Profile;
        IP-Adressen werden nicht gespeichert. Rechtsgrundlage ist unser berechtigtes Interesse an einer funktionierenden
        Anwendung (Art. 6 Abs. 1 lit. f DSGVO).
      </p>

      <h3>7. Speicherdauer und Löschung</h3>
      <p>
        Konto- und Agenturdaten bleiben gespeichert, solange das Konto besteht. Auf Anfrage per E-Mail löschen wir dein Konto
        und, wenn du die letzte Person in deiner Agentur bist, alle Daten der Agentur innerhalb von 14 Tagen. Server-Protokolle
        werden vom Hosting-Anbieter nach kurzer Zeit automatisch gelöscht.
      </p>

      <h3>8. Deine Rechte</h3>
      <p>
        Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der
        Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Wende dich dafür an die oben genannte
        E-Mail-Adresse. Du kannst dich außerdem bei einer Aufsichtsbehörde beschweren, zum Beispiel beim Hamburgischen
        Beauftragten für Datenschutz und Informationsfreiheit, Ludwig-Erhard-Straße 22, 20459 Hamburg.
      </p>

      <h3>9. Änderungen</h3>
      <p>
        Wenn sich Klarwerk oder die eingesetzten Dienste ändern, passen wir diese Erklärung an. Das Datum oben zeigt den
        aktuellen Stand.
      </p>
    </>
  );
}
