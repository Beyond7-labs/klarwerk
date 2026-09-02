import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthFrame, Button, Field, Input, Notice } from "@/components/ui";
import { anmelden, demoAnmelden } from "@/lib/actions";
import { aktuelleSitzung } from "@/lib/auth";

export const metadata: Metadata = { title: "Anmelden" };

export default async function Anmelden({
  searchParams,
}: {
  searchParams: Promise<{ fehler?: string }>;
}) {
  if (await aktuelleSitzung()) redirect("/projekte");
  const { fehler } = await searchParams;

  return (
    <AuthFrame
      title="Anmelden"
      lede="Mit der E-Mail-Adresse, mit der du eingeladen wurdest oder dich registriert hast."
      alt={
        <>
          <span>
            Noch kein Konto?{" "}
            <Link className="link" href="/registrieren">
              Agentur anlegen
            </Link>
          </span>
          <form action={demoAnmelden}>
            <span>
              Zum Ausprobieren:{" "}
              <button type="submit" className="link" style={{ background: "none", border: 0, padding: 0, font: "inherit", cursor: "pointer" }}>
                Demo-Agentur Nordlicht öffnen
              </button>
            </span>
          </form>
        </>
      }
    >
      <form action={anmelden} className="form">
        {fehler && <Notice kind="error">{fehler}</Notice>}
        <Field label="E-Mail" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" required autoFocus />
        </Field>
        <Field label="Passwort" htmlFor="passwort">
          <Input id="passwort" name="passwort" type="password" autoComplete="current-password" required />
        </Field>
        <div className="form-actions">
          <Button type="submit">Anmelden</Button>
        </div>
      </form>
    </AuthFrame>
  );
}
