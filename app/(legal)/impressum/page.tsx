import type { Metadata } from "next";

export const metadata: Metadata = { title: "Impressum" };

export default function Impressum() {
  return (
    <>
      <h2>Impressum</h2>
      <p>Angaben nach § 5 DDG.</p>

      <h3>Betreiber</h3>
      <address>
        Beyond7 GmbH
        <br />
        Kühnehöfe 13d
        <br />
        22761 Hamburg
        <br />
        Deutschland
      </address>

      <h3>Vertreten durch</h3>
      <p>Geschäftsführer: Hendrik Hemken</p>

      <h3>Kontakt</h3>
      <p>
        E-Mail: <a className="link" href="mailto:hendrik@beyond7.ai">hendrik@beyond7.ai</a>
      </p>

      <h3>Registereintrag</h3>
      <p>
        Registergericht: Amtsgericht Hamburg
        <br />
        Handelsregisternummer: HRB 199492
      </p>

      <h3>Umsatzsteuer-Identifikationsnummer</h3>
      <p>DE463913281 (nach § 27a UStG)</p>

      <h3>Verantwortlich für den Inhalt</h3>
      <p>Hendrik Hemken, Anschrift wie oben.</p>

      <h3>Hinweis zur Anwendung</h3>
      <p>
        Klarwerk ist eine Anwendung der Beyond7 GmbH für Schulungen zu Produktentwicklung und Prototyping.
        Die Beispielagentur „Agentur Nordlicht" und ihre Kund:innen, Projekte und Personen sind fiktiv.
      </p>

      <h3>Streitbeilegung</h3>
      <p>
        Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        teilzunehmen.
      </p>
    </>
  );
}
