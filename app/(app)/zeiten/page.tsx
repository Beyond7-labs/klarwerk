import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, DataTable, EmptyState, Field, Input, Notice, PageHeader, Select } from "@/components/ui";
import { zeitErfassen, zeitLoeschen } from "@/lib/actions";
import { sitzungErforderlich } from "@/lib/auth";
import { projekteKurz, zeiteintraegeListe } from "@/lib/data";
import { formatDatumLang, formatStunden, heuteISO, tageAddieren, wochenStart } from "@/lib/format";

export const metadata: Metadata = { title: "Zeiten" };

export default async function Zeiten({
  searchParams,
}: {
  searchParams: Promise<{ fehler?: string }>;
}) {
  const s = await sitzungErforderlich();
  const { fehler } = await searchParams;
  const [eintraege, projekte] = await Promise.all([
    zeiteintraegeListe(s.mandant.id),
    projekteKurz(s.mandant.id),
  ]);

  const heute = heuteISO();
  const von = wochenStart(heute);
  const bis = tageAddieren(von, 6);
  const meineWoche = eintraege
    .filter((e) => e.nutzerId === s.nutzer.id && e.datum >= von && e.datum <= bis)
    .reduce((sum, e) => sum + e.minuten, 0);
  const teamWoche = eintraege
    .filter((e) => e.datum >= von && e.datum <= bis)
    .reduce((sum, e) => sum + e.minuten, 0);

  const laufende = projekte.filter((p) => p.status === "laufend");

  return (
    <>
      <PageHeader
        title="Zeiten"
        lede={
          eintraege.length
            ? `Diese Woche: ${formatStunden(meineWoche)} von dir, ${formatStunden(teamWoche)} im Team`
            : undefined
        }
      />
      <div className="grid-2" style={{ gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)", alignItems: "start" }}>
        <Card padding="none">
          {eintraege.length === 0 ? (
            <EmptyState
              title="Noch keine Zeiten erfasst"
              text={laufende.length ? "Trag rechts die erste Zeit ein." : "Zeiten brauchen ein Projekt. Leg zuerst eines an."}
              action={!laufende.length ? <Button href="/projekte/neu">Neues Projekt</Button> : undefined}
            />
          ) : (
            <DataTable>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Person</th>
                  <th>Projekt</th>
                  <th className="num">Dauer</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {eintraege.map((e) => (
                  <tr key={e.id}>
                    <td style={{ whiteSpace: "nowrap" }}>{formatDatumLang(e.datum)}</td>
                    <td>{e.nutzerName}</td>
                    <td>
                      <Link href={`/projekte/${e.projektId}`} style={{ textDecoration: "none" }}>
                        {e.projektName}
                      </Link>
                      {e.notiz && <span className="sub">{e.notiz}</span>}
                    </td>
                    <td className="num">{formatStunden(e.minuten)}</td>
                    <td className="num" style={{ width: 40 }}>
                      {e.nutzerId === s.nutzer.id && (
                        <form action={zeitLoeschen.bind(null, e.id)}>
                          <button className="btn btn-ghost btn-xs" type="submit" aria-label="Eintrag löschen" title="Eintrag löschen">
                            ×
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          )}
        </Card>
        <Card title="Zeit erfassen">
          <form action={zeitErfassen} className="form">
            {fehler && <Notice kind="error">{fehler}</Notice>}
            <Field label="Projekt" htmlFor="projektId">
              <Select id="projektId" name="projektId" required defaultValue="">
                <option value="" disabled>
                  Projekt wählen
                </option>
                {laufende.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="form-row">
              <Field label="Datum" htmlFor="datum">
                <Input id="datum" name="datum" type="date" defaultValue={heute} max={heute} required />
              </Field>
              <Field label="Stunden" htmlFor="stunden">
                <Input id="stunden" name="stunden" type="number" step="0.25" min="0.25" max="24" placeholder="1,5" required />
              </Field>
            </div>
            <Field label="Notiz" htmlFor="notiz">
              <Input id="notiz" name="notiz" placeholder="Woran hast du gearbeitet?" />
            </Field>
            <div className="form-actions">
              <Button type="submit">Eintragen</Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
