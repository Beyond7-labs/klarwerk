import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthFrame, Button, Field, Input, Notice } from "@/components/ui";
import { registrieren } from "@/lib/actions";
import { aktuelleSitzung } from "@/lib/auth";

export const metadata: Metadata = { title: "Agentur anlegen" };

export default async function Registrieren({
  searchParams,
}: {
  searchParams: Promise<{ fehler?: string }>;
}) {
  if (await aktuelleSitzung()) redirect("/projekte");
  const { fehler } = await searchParams;

  return (
    <AuthFrame
      title="Agentur anlegen"
      lede="Du legst deine Agentur als eigenen Bereich an und lädst dein Team danach ein."
      alt={
        <span>
          Schon ein Konto?{" "}
          <Link className="link" href="/anmelden">
            Anmelden
          </Link>
        </span>
      }
    >
      <form action={registrieren} className="form">
        {fehler && <Notice kind="error">{fehler}</Notice>}
        <Field label="Name der Agentur" htmlFor="agentur">
          <Input id="agentur" name="agentur" required autoFocus placeholder="z. B. Studio Elbufer" />
        </Field>
        <Field label="Dein Name" htmlFor="name">
          <Input id="name" name="name" autoComplete="name" required />
        </Field>
        <Field label="E-Mail" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Passwort" htmlFor="passwort" hint="Mindestens 8 Zeichen.">
          <Input id="passwort" name="passwort" type="password" autoComplete="new-password" minLength={8} required />
        </Field>
        <div className="form-actions">
          <Button type="submit">Agentur anlegen</Button>
        </div>
        <p className="faint" style={{ fontSize: 12.5 }}>
          Mit dem Anlegen stimmst du der Verarbeitung deiner Daten nach unserer{" "}
          <Link className="link" href="/datenschutz">Datenschutzerklärung</Link> zu.
        </p>
      </form>
    </AuthFrame>
  );
}
