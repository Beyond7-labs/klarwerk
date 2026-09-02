import type { Metadata } from "next";
import { Button, Card, DataTable, EmptyState, Field, Input, Notice, PageHeader, Textarea } from "@/components/ui";
import { kundeAnlegen } from "@/lib/actions";
import { sitzungErforderlich } from "@/lib/auth";
import { kundenListe } from "@/lib/data";
import { plural } from "@/lib/format";

export const metadata: Metadata = { title: "Kunden" };

export default async function Kunden({
  searchParams,
}: {
  searchParams: Promise<{ fehler?: string }>;
}) {
  const s = await sitzungErforderlich();
  const { fehler } = await searchParams;
  const liste = await kundenListe(s.mandant.id);

  return (
    <>
      <PageHeader
        title="Kunden"
        lede={liste.length ? `${plural(liste.length, "Kunde", "Kunden")}, ${liste.filter((k) => k.laufend > 0).length} mit laufenden Projekten` : undefined}
      />
      <div className="grid-2" style={{ gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)", alignItems: "start" }}>
        <Card padding="none">
          {liste.length === 0 ? (
            <EmptyState title="Noch keine Kunden" text="Kunden entstehen auch automatisch, wenn du beim Anlegen eines Projekts einen neuen Kunden einträgst." />
          ) : (
            <DataTable>
              <thead>
                <tr>
                  <th>Kunde</th>
                  <th>Ansprechperson</th>
                  <th className="num">Projekte</th>
                </tr>
              </thead>
              <tbody>
                {liste.map((k) => (
                  <tr key={k.id}>
                    <td>
                      <strong style={{ fontWeight: 600 }}>{k.name}</strong>
                      {k.notiz && <span className="sub">{k.notiz}</span>}
                    </td>
                    <td>
                      {k.ansprechpartner ?? <span className="faint">–</span>}
                      {k.email && <span className="sub">{k.email}</span>}
                    </td>
                    <td className="num">
                      {k.projekte}
                      {k.laufend > 0 && <span className="sub">{k.laufend} laufend</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          )}
        </Card>
        <Card title="Neuer Kunde">
          <form action={kundeAnlegen} className="form">
            {fehler && <Notice kind="error">{fehler}</Notice>}
            <Field label="Name" htmlFor="name">
              <Input id="name" name="name" required />
            </Field>
            <Field label="Ansprechperson" htmlFor="ansprechpartner">
              <Input id="ansprechpartner" name="ansprechpartner" />
            </Field>
            <Field label="E-Mail" htmlFor="email">
              <Input id="email" name="email" type="email" />
            </Field>
            <Field label="Notiz" htmlFor="notiz">
              <Textarea id="notiz" name="notiz" style={{ minHeight: 60 }} />
            </Field>
            <div className="form-actions">
              <Button type="submit">Kunde anlegen</Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
