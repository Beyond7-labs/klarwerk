import type { Metadata } from "next";
import Link from "next/link";
import { Avatar, Card, DataTable, EmptyState, Meter, PageHeader } from "@/components/ui";
import { sitzungErforderlich } from "@/lib/auth";
import { auslastungDieseWoche, projektbudgets } from "@/lib/data";
import { formatDatum, formatStunden, prozent } from "@/lib/format";

export const metadata: Metadata = { title: "Auslastung" };

export default async function Auslastung() {
  const s = await sitzungErforderlich();
  const [woche, budgets] = await Promise.all([
    auslastungDieseWoche(s.mandant.id),
    projektbudgets(s.mandant.id),
  ]);

  const kapazitaet = woche.personen.reduce((sum, p) => sum + p.wochenstunden * 60, 0);
  const gebucht = woche.personen.reduce((sum, p) => sum + p.minutenGebucht, 0);

  return (
    <>
      <PageHeader
        title="Auslastung"
        lede={`Woche ${formatDatum(woche.von)} bis ${formatDatum(woche.bis)} · ${formatStunden(gebucht)} von ${formatStunden(kapazitaet)} Kapazität gebucht (${prozent(gebucht, kapazitaet)} %)`}
      />
      <div className="stack">
        <Card padding="none" style={{ paddingTop: 18 }}>
          <div style={{ padding: "0 24px 4px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Team diese Woche</h3>
            <p className="card-lede">Gebuchte Stunden gegen die Wochenstunden jeder Person. Offene Aufgaben nur aus laufenden Projekten.</p>
          </div>
          <DataTable>
            <thead>
              <tr>
                <th>Person</th>
                <th>Auslastung</th>
                <th className="num">Gebucht</th>
                <th className="num">Offene Aufgaben</th>
              </tr>
            </thead>
            <tbody>
              {woche.personen.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className="row" style={{ gap: 10, flexWrap: "nowrap" }}>
                      <Avatar name={p.name} size="sm" />
                      <span>
                        {p.name}
                        <span className="sub">{p.wochenstunden} h pro Woche{p.rolle === "admin" ? " · Admin" : ""}</span>
                      </span>
                    </span>
                  </td>
                  <td style={{ minWidth: 220 }}>
                    <Meter wert={p.minutenGebucht} max={p.wochenstunden * 60} label={`${prozent(p.minutenGebucht, p.wochenstunden * 60)} %`} />
                  </td>
                  <td className="num">{formatStunden(p.minutenGebucht)}</td>
                  <td className="num">
                    {p.offeneAufgaben}
                    {p.ueberfaellig > 0 && (
                      <span className="sub" style={{ color: "var(--danger)" }}>
                        {p.ueberfaellig} überfällig
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </Card>

        <Card padding="none" style={{ paddingTop: 18 }}>
          <div style={{ padding: "0 24px 4px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Budgets laufender Projekte</h3>
            <p className="card-lede">Alle gebuchten Stunden seit Projektstart gegen das Stundenbudget.</p>
          </div>
          {budgets.length === 0 ? (
            <EmptyState title="Keine laufenden Projekte" text="Sobald ein Projekt läuft und Zeiten gebucht sind, erscheint es hier." />
          ) : (
            <DataTable>
              <thead>
                <tr>
                  <th>Projekt</th>
                  <th>Budget</th>
                  <th className="num">Gebucht</th>
                  <th className="num">Rest</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((b) => {
                  const max = (b.budgetStunden ?? 0) * 60;
                  return (
                    <tr key={b.id}>
                      <td>
                        <Link href={`/projekte/${b.id}`} style={{ textDecoration: "none", fontWeight: 600 }}>
                          {b.name}
                        </Link>
                      </td>
                      <td style={{ minWidth: 220 }}>
                        {b.budgetStunden ? (
                          <Meter wert={b.minutenGebucht} max={max} label={`${prozent(b.minutenGebucht, max)} %`} />
                        ) : (
                          <span className="faint">Kein Budget hinterlegt</span>
                        )}
                      </td>
                      <td className="num">{formatStunden(b.minutenGebucht)}</td>
                      <td className="num">
                        {b.budgetStunden ? (
                          <span style={{ color: max - b.minutenGebucht < 0 ? "var(--danger)" : undefined }}>
                            {formatStunden(max - b.minutenGebucht)}
                          </span>
                        ) : (
                          <span className="faint">–</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          )}
        </Card>
      </div>
    </>
  );
}
