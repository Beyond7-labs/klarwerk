import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, Field, Input, Notice, PageHeader, Select, Textarea } from "@/components/ui";
import { projektAnlegen } from "@/lib/actions";
import { sitzungErforderlich } from "@/lib/auth";
import { kundenListe } from "@/lib/data";
import { PROJEKT_TYP_LABEL, heuteISO } from "@/lib/format";

export const metadata: Metadata = { title: "Neues Projekt" };

export default async function NeuesProjekt({
  searchParams,
}: {
  searchParams: Promise<{ fehler?: string }>;
}) {
  const s = await sitzungErforderlich();
  const { fehler } = await searchParams;
  const kunden = await kundenListe(s.mandant.id);

  return (
    <>
      <PageHeader
        title="Neues Projekt"
        crumbs={<Link href="/projekte">Projekte</Link>}
        lede="Name und Kunde reichen für den Anfang. Alles andere lässt sich später ergänzen."
      />
      <Card style={{ maxWidth: 680 }}>
        <form action={projektAnlegen} className="form">
          {fehler && <Notice kind="error">{fehler}</Notice>}
          <Field label="Projektname" htmlFor="name">
            <Input id="name" name="name" required autoFocus />
          </Field>
          <div className="form-row">
            <Field label="Kunde" htmlFor="kundeId">
              <Select id="kundeId" name="kundeId" defaultValue="">
                <option value="">Kein Kunde oder neuer Kunde</option>
                {kunden.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Neuer Kunde" htmlFor="neuerKunde" hint="Wird angelegt, wenn oben kein Kunde gewählt ist.">
              <Input id="neuerKunde" name="neuerKunde" />
            </Field>
          </div>
          <div className="form-row">
            <Field label="Art" htmlFor="typ">
              <Select id="typ" name="typ" defaultValue="website">
                {Object.entries(PROJEKT_TYP_LABEL).map(([wert, label]) => (
                  <option key={wert} value={wert}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Budget in Stunden" htmlFor="budgetStunden">
              <Input id="budgetStunden" name="budgetStunden" type="number" min={1} step={1} />
            </Field>
          </div>
          <div className="form-row">
            <Field label="Start" htmlFor="startAm">
              <Input id="startAm" name="startAm" type="date" defaultValue={heuteISO()} />
            </Field>
            <Field label="Ende" htmlFor="endeAm">
              <Input id="endeAm" name="endeAm" type="date" />
            </Field>
          </div>
          <Field label="Beschreibung" htmlFor="beschreibung">
            <Textarea id="beschreibung" name="beschreibung" />
          </Field>
          <div className="form-actions">
            <Button type="submit">Projekt anlegen</Button>
            <Button variant="ghost" href="/projekte">Abbrechen</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
