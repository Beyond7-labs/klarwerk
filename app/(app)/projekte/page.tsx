import type { Metadata } from "next";
import Link from "next/link";
import { AvatarRow, Button, Card, EmptyState, PageHeader, Progress, StatusDot, Tag } from "@/components/ui";
import { sitzungErforderlich } from "@/lib/auth";
import { projekteMitKennzahlen } from "@/lib/data";
import { PROJEKT_TYP_LABEL, faelligkeitsText, plural } from "@/lib/format";

export const metadata: Metadata = { title: "Projekte" };

export default async function Projekte() {
  const s = await sitzungErforderlich();
  const liste = await projekteMitKennzahlen(s.mandant.id);

  if (liste.length === 0) {
    return (
      <>
        <PageHeader title="Projekte" />
        <Card padding="none">
          <EmptyState
            title="Noch keine Projekte"
            text="Starte mit einer Vorlage für ein typisches Agenturprojekt oder lege ein leeres Projekt an."
            action={
              <div className="row" style={{ justifyContent: "center" }}>
                <Button href="/projekte/vorlage">Mit Vorlage starten</Button>
                <Button variant="ghost" href="/projekte/neu">Leeres Projekt</Button>
              </div>
            }
          />
        </Card>
      </>
    );
  }

  const laufend = liste.filter((p) => p.status === "laufend").length;
  const offen = liste.reduce((sum, p) => sum + (p.aufgabenGesamt - p.aufgabenErledigt), 0);

  return (
    <>
      <PageHeader
        title="Projekte"
        lede={`${plural(liste.length, "Projekt", "Projekte")}, ${laufend} laufen · ${plural(offen, "offene Aufgabe", "offene Aufgaben")}`}
        actions={
          <>
            <Button variant="ghost" href="/projekte/vorlage">Mit Vorlage</Button>
            <Button href="/projekte/neu">Neues Projekt</Button>
          </>
        }
      />
      <div className="grid-3">
        {liste.map((p) => {
          const naechste = p.status === "laufend" ? faelligkeitsText(p.naechsteFaelligkeit) : { text: "", ueberfaellig: false };
          return (
            <Link key={p.id} href={`/projekte/${p.id}`} className="kw-card proj" data-status={p.status}>
              <div className="proj-top">
                <div>
                  <h3>{p.name}</h3>
                  <div className="proj-meta">{p.kundeName ?? "Ohne Kunde"}</div>
                </div>
                <Tag kind="neutral">{PROJEKT_TYP_LABEL[p.typ]}</Tag>
              </div>
              <div className="proj-progress">
                <small>
                  <span>
                    {p.aufgabenGesamt === 0
                      ? "Noch keine Aufgaben"
                      : `${p.aufgabenErledigt} von ${p.aufgabenGesamt} Aufgaben erledigt`}
                  </span>
                  {naechste.text && (
                    <span style={{ color: naechste.ueberfaellig ? "var(--danger)" : undefined }}>
                      {naechste.ueberfaellig ? "eine Aufgabe überfällig" : `nächste ${naechste.text}`}
                    </span>
                  )}
                </small>
                <Progress wert={p.aufgabenErledigt} max={p.aufgabenGesamt} />
              </div>
              <div className="proj-foot">
                <StatusDot status={p.status} />
                {p.team.length > 0 ? <AvatarRow namen={p.team} /> : <span className="faint" style={{ fontSize: 12.5 }}>Niemand zugeteilt</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
