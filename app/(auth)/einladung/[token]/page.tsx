import type { Metadata } from "next";
import Link from "next/link";
import { AuthFrame, Button, Field, Input, Notice } from "@/components/ui";
import { einladungAnnehmen } from "@/lib/actions";
import { einladungPerToken } from "@/lib/data";

export const metadata: Metadata = { title: "Einladung" };

export default async function Einladung({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ fehler?: string }>;
}) {
  const { token } = await params;
  const { fehler } = await searchParams;
  const einladung = await einladungPerToken(token);

  if (!einladung || einladung.angenommenAm || einladung.gueltigBis < new Date()) {
    return (
      <AuthFrame title="Einladung nicht mehr gültig" lede="Der Link wurde schon benutzt, ist abgelaufen oder existiert nicht.">
        <p className="muted">Bitte die Person, die dich eingeladen hat, um eine neue Einladung.</p>
        <div className="form-actions" style={{ marginTop: 18 }}>
          <Button variant="ghost" href="/anmelden">Zur Anmeldung</Button>
        </div>
      </AuthFrame>
    );
  }

  const annehmen = einladungAnnehmen.bind(null, token);

  return (
    <AuthFrame
      title={`Einladung zu ${einladung.mandantName}`}
      lede={`${einladung.eingeladenVonName ?? "Jemand"} hat dich als ${einladung.rolle === "admin" ? "Admin" : "Mitglied"} eingeladen. Leg ein Passwort fest, dann geht es los.`}
      alt={
        <span>
          Du hast schon ein Klarwerk-Konto mit dieser E-Mail? Dann gib unten einfach dein bestehendes Passwort ein.{" "}
          <Link className="link" href="/anmelden">Oder melde dich zuerst an.</Link>
        </span>
      }
    >
      <form action={annehmen} className="form">
        {fehler && <Notice kind="error">{fehler}</Notice>}
        <Field label="E-Mail">
          <Input value={einladung.email} readOnly className="input" />
        </Field>
        <Field label="Dein Name" htmlFor="name">
          <Input id="name" name="name" autoComplete="name" required autoFocus />
        </Field>
        <Field label="Passwort" htmlFor="passwort" hint="Mindestens 8 Zeichen.">
          <Input id="passwort" name="passwort" type="password" autoComplete="new-password" minLength={8} required />
        </Field>
        <div className="form-actions">
          <Button type="submit">Beitreten</Button>
        </div>
      </form>
    </AuthFrame>
  );
}
