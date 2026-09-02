import type { Metadata } from "next";
import { headers } from "next/headers";
import { Avatar, Button, Card, ChoiceCard, CopyButton, DataTable, Field, Input, Notice, PageHeader, Tag } from "@/components/ui";
import { abmelden, einladungErstellen, einladungWiderrufen, mandantAktualisieren, profilAktualisieren } from "@/lib/actions";
import { sitzungErforderlich } from "@/lib/auth";
import { mitglieder, offeneEinladungen } from "@/lib/data";

export const metadata: Metadata = { title: "Einstellungen" };

export default async function Einstellungen({
  searchParams,
}: {
  searchParams: Promise<{ fehler?: string }>;
}) {
  const s = await sitzungErforderlich();
  const { fehler } = await searchParams;
  const [team, einladungen, h] = await Promise.all([
    mitglieder(s.mandant.id),
    offeneEinladungen(s.mandant.id),
    headers(),
  ]);
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const basis = `${proto}://${host}`;
  const ich = team.find((m) => m.id === s.nutzer.id);
  const istAdmin = s.rolle === "admin";
  const frei = s.mandant.plaetze - team.length;

  return (
    <>
      <PageHeader title="Einstellungen" lede={`${s.mandant.name} · ${team.length} von ${s.mandant.plaetze} Plätzen belegt`} />
      {fehler && (
        <div style={{ marginBottom: 18 }}>
          <Notice kind="error">{fehler}</Notice>
        </div>
      )}
      <div className="stack">
        <Card padding="none" style={{ paddingTop: 18 }}>
          <div style={{ padding: "0 24px 4px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Team</h3>
            <p className="card-lede">Wer in {s.mandant.name} arbeitet. {frei > 0 ? `${frei} Plätze sind noch frei.` : "Alle Plätze sind belegt."}</p>
          </div>
          <DataTable>
            <thead>
              <tr>
                <th>Person</th>
                <th>E-Mail</th>
                <th>Rolle</th>
                <th className="num">Wochenstunden</th>
              </tr>
            </thead>
            <tbody>
              {team.map((m) => (
                <tr key={m.id}>
                  <td>
                    <span className="row" style={{ gap: 10, flexWrap: "nowrap" }}>
                      <Avatar name={m.name} size="sm" />
                      {m.name}
                      {m.id === s.nutzer.id && <span className="faint" style={{ fontSize: 12.5 }}>du</span>}
                    </span>
                  </td>
                  <td>{m.email}</td>
                  <td>{m.rolle === "admin" ? <Tag>Admin</Tag> : <Tag kind="neutral">Mitglied</Tag>}</td>
                  <td className="num">{m.wochenstunden} h</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </Card>

        <div className="grid-2" style={{ alignItems: "start" }}>
          <Card title="Einladen" lede="Der Link gilt 14 Tage. Schick ihn per Mail oder Chat weiter.">
            <form action={einladungErstellen} className="form">
              <Field label="E-Mail" htmlFor="einladung-email">
                <Input id="einladung-email" name="email" type="email" required placeholder="name@agentur.de" />
              </Field>
              <div className="field">
                <span className="label">Rolle</span>
                <div className="choices">
                  <ChoiceCard name="rolle" value="mitglied" title="Mitglied" text="Sieht und bearbeitet Projekte, Kunden und Zeiten" defaultChecked />
                  <ChoiceCard name="rolle" value="admin" title="Admin" text="Kann zusätzlich Personen einladen und die Agentur ändern" />
                </div>
              </div>
              <div className="form-actions">
                <Button type="submit" disabled={frei <= 0}>Einladungslink erstellen</Button>
                {frei <= 0 && <span className="muted" style={{ fontSize: 13 }}>Kein Platz mehr frei.</span>}
              </div>
            </form>
            {einladungen.length > 0 && (
              <div style={{ marginTop: 22, display: "grid", gap: 12 }}>
                <span className="label" style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-soft)" }}>Offene Einladungen</span>
                {einladungen.map((e) => {
                  const link = `${basis}/einladung/${e.token}`;
                  return (
                    <div key={e.id} style={{ display: "grid", gap: 6, padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 8, background: "var(--surface-2)" }}>
                      <div className="row between">
                        <span>
                          <strong style={{ fontWeight: 600 }}>{e.email}</strong>{" "}
                          <span className="muted" style={{ fontSize: 13 }}>als {e.rolle === "admin" ? "Admin" : "Mitglied"}</span>
                        </span>
                        <form action={einladungWiderrufen.bind(null, e.id)}>
                          <Button variant="link" type="submit">Widerrufen</Button>
                        </form>
                      </div>
                      <div className="row" style={{ flexWrap: "nowrap" }}>
                        <input className="input mono" readOnly value={link} aria-label="Einladungslink" />
                        <CopyButton text={link} label="Link kopieren" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <div className="stack">
            <Card title="Agentur">
              <form action={mandantAktualisieren} className="form">
                <Field label="Name" htmlFor="agentur-name" hint={istAdmin ? undefined : "Nur Admins können den Namen ändern."}>
                  <Input id="agentur-name" name="name" defaultValue={s.mandant.name} disabled={!istAdmin} required />
                </Field>
                <div className="form-actions">
                  <Button type="submit" variant="ghost" disabled={!istAdmin}>Speichern</Button>
                  <span className="muted" style={{ fontSize: 13 }}>{s.mandant.plaetze} Plätze im Tarif</span>
                </div>
              </form>
            </Card>

            <Card title="Dein Konto">
              <form action={profilAktualisieren} className="form">
                <Field label="Name" htmlFor="konto-name">
                  <Input id="konto-name" name="name" defaultValue={s.nutzer.name} required />
                </Field>
                <div className="form-row">
                  <Field label="E-Mail">
                    <Input value={s.nutzer.email} readOnly />
                  </Field>
                  <Field label="Wochenstunden" htmlFor="wochenstunden" hint="Grundlage für die Auslastung.">
                    <Input id="wochenstunden" name="wochenstunden" type="number" min={1} max={60} defaultValue={ich?.wochenstunden ?? 40} />
                  </Field>
                </div>
                <div className="form-actions">
                  <Button type="submit" variant="ghost">Speichern</Button>
                </div>
              </form>
              <form action={abmelden} style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
                <Button type="submit" variant="link">Abmelden</Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
