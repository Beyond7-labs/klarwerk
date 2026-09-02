import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BoardColumn, Button, Field, Input, PageHeader, Select, StatusDot, Tag, TaskCard } from "@/components/ui";
import { aufgabeAnlegen, aufgabeLoeschen, aufgabeVerschieben, projektStatusSetzen } from "@/lib/actions";
import { sitzungErforderlich } from "@/lib/auth";
import { mitglieder, projektMitAufgaben } from "@/lib/data";
import { PROJEKT_STATUS_LABEL, PROJEKT_TYP_LABEL, SPALTEN, formatDatum, formatStunden, plural } from "@/lib/format";
import type { Spalte } from "@/db/schema";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const s = await sitzungErforderlich();
  const { id } = await params;
  const p = await projektMitAufgaben(s.mandant.id, id);
  return { title: p?.name ?? "Projekt" };
}

export default async function Projekt({ params }: { params: Promise<{ id: string }> }) {
  const s = await sitzungErforderlich();
  const { id } = await params;
  const projekt = await projektMitAufgaben(s.mandant.id, id);
  if (!projekt) notFound();
  const team = await mitglieder(s.mandant.id);

  const meta = [
    projekt.kundeName,
    PROJEKT_TYP_LABEL[projekt.typ],
    projekt.startAm ? `seit ${formatDatum(projekt.startAm)}` : null,
    projekt.endeAm ? `bis ${formatDatum(projekt.endeAm)}` : null,
    projekt.budgetStunden
      ? `${formatStunden(projekt.minutenGebucht)} von ${projekt.budgetStunden} h gebucht`
      : projekt.minutenGebucht > 0
        ? `${formatStunden(projekt.minutenGebucht)} gebucht`
        : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const statusForm = projektStatusSetzen.bind(null, projekt.id);

  return (
    <>
      <PageHeader
        title={projekt.name}
        crumbs={<Link href="/projekte">Projekte</Link>}
        lede={
          <>
            {meta}
            {projekt.beschreibung && (
              <>
                <br />
                <span style={{ display: "inline-block", marginTop: 6 }}>{projekt.beschreibung}</span>
              </>
            )}
          </>
        }
        actions={
          <form action={statusForm} className="row">
            <StatusDot status={projekt.status} />
            <Select name="status" defaultValue={projekt.status} className="input" style={{ width: "auto", padding: "6px 10px", fontSize: 13.5 }} aria-label="Status ändern">
              {Object.entries(PROJEKT_STATUS_LABEL).map(([wert, label]) => (
                <option key={wert} value={wert}>
                  {label}
                </option>
              ))}
            </Select>
            <Button variant="ghost" size="sm" type="submit">Status setzen</Button>
          </form>
        }
      />

      <div className="board">
        {SPALTEN.map(({ key, label }, index) => {
          const karten = projekt.aufgaben.filter((a) => a.spalte === key);
          const vorher = SPALTEN[index - 1]?.key;
          const nachher = SPALTEN[index + 1]?.key;
          const anlegen = aufgabeAnlegen.bind(null, projekt.id);
          return (
            <BoardColumn
              key={key}
              title={label}
              count={karten.length}
              emptyText={key === "erledigt" ? "Noch nichts abgeschlossen" : key === "in_arbeit" ? "Gerade nichts in Arbeit" : "Keine offenen Aufgaben"}
              footer={
                <details className="col-add">
                  <summary>+ Aufgabe hinzufügen</summary>
                  <form action={anlegen} className="form">
                    <input type="hidden" name="spalte" value={key} />
                    <Field label="Titel" htmlFor={`titel-${key}`}>
                      <Input id={`titel-${key}`} name="titel" required />
                    </Field>
                    <Field label="Verantwortlich" htmlFor={`wer-${key}`}>
                      <Select id={`wer-${key}`} name="verantwortlichId" defaultValue={s.nutzer.id}>
                        <option value="">Niemand</option>
                        {team.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <div className="form-row">
                      <Field label="Fällig" htmlFor={`faellig-${key}`}>
                        <Input id={`faellig-${key}`} name="faelligAm" type="date" />
                      </Field>
                      <Field label="Etikett" htmlFor={`tag-${key}`}>
                        <Input id={`tag-${key}`} name="tag" placeholder="z. B. Design" />
                      </Field>
                    </div>
                    <div className="form-actions">
                      <Button type="submit" size="sm">Hinzufügen</Button>
                    </div>
                  </form>
                </details>
              }
            >
              {karten.map((a) => (
                <TaskCard
                  key={a.id}
                  titel={a.titel}
                  person={a.verantwortlichName}
                  faelligAm={a.faelligAm}
                  tag={a.tag}
                  spalte={a.spalte}
                  actions={
                    <>
                      {vorher && (
                        <form action={aufgabeVerschieben.bind(null, a.id, vorher as Spalte)}>
                          <button className="btn btn-ghost btn-xs" type="submit" title={`Nach „${SPALTEN[index - 1].label}"`} aria-label={`Nach ${SPALTEN[index - 1].label} verschieben`}>
                            ←
                          </button>
                        </form>
                      )}
                      {nachher && (
                        <form action={aufgabeVerschieben.bind(null, a.id, nachher as Spalte)}>
                          <button className="btn btn-ghost btn-xs" type="submit" title={`Nach „${SPALTEN[index + 1].label}"`} aria-label={`Nach ${SPALTEN[index + 1].label} verschieben`}>
                            →
                          </button>
                        </form>
                      )}
                      <form action={aufgabeLoeschen.bind(null, a.id)}>
                        <button className="btn btn-ghost btn-xs" type="submit" title="Aufgabe löschen" aria-label="Aufgabe löschen">
                          ×
                        </button>
                      </form>
                    </>
                  }
                />
              ))}
            </BoardColumn>
          );
        })}
      </div>

      {projekt.aufgaben.length > 0 && (
        <p className="faint" style={{ fontSize: 12.5, marginTop: 14 }}>
          {plural(projekt.aufgaben.length, "Aufgabe", "Aufgaben")} insgesamt. Karten lassen sich mit den Pfeilen zwischen den Spalten verschieben.
        </p>
      )}
      {projekt.status !== "laufend" && (
        <p style={{ marginTop: 14 }}>
          <Tag kind="neutral">{PROJEKT_STATUS_LABEL[projekt.status]}</Tag>{" "}
          <span className="muted" style={{ fontSize: 13 }}>
            Dieses Projekt zählt nicht in die Auslastung.
          </span>
        </p>
      )}
    </>
  );
}
