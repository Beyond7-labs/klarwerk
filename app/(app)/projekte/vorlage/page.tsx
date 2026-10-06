import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, ChoiceCard, Field, Input, Notice, PageHeader } from "@/components/ui";
import { projektAusVorlage } from "@/lib/actions";
import { sitzungErforderlich } from "@/lib/auth";
import { VORLAGEN } from "@/lib/vorlagen";

export const metadata: Metadata = { title: "Mit Vorlage starten" };

export default async function MitVorlage({
  searchParams,
}: {
  searchParams: Promise<{ fehler?: string }>;
}) {
  await sitzungErforderlich();
  const { fehler } = await searchParams;

  return (
    <>
      <PageHeader
        title="Mit Vorlage starten"
        crumbs={<Link href="/projekte">Projekte</Link>}
        lede="Wähl ein typisches Agenturprojekt. Das Board steht dann mit Beispielaufgaben, die du anpasst."
      />
      <form action={projektAusVorlage} className="stack">
        {fehler && <Notice kind="error">{fehler}</Notice>}
        <div className="choices horizontal">
          {VORLAGEN.map((v) => (
            <ChoiceCard
              key={v.id}
              name="vorlage"
              value={v.id}
              title={v.titel}
              text={`${v.text}. Phasen: ${v.phasen.map((p) => p.name).join(", ")}`}
            />
          ))}
        </div>
        <Card style={{ maxWidth: 680 }}>
          <div className="form">
            <Field label="Projektname" htmlFor="name" hint="Leer lassen, dann heißt das Projekt wie die Vorlage.">
              <Input id="name" name="name" />
            </Field>
            <div className="form-actions">
              <Button type="submit">Board anlegen</Button>
              <Button variant="ghost" href="/projekte/neu">Lieber leer starten</Button>
            </div>
          </div>
        </Card>
      </form>
    </>
  );
}
