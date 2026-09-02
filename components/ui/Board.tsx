/**
 * Board mit drei Spalten (Offen, In Arbeit, Erledigt) und Aufgabenkarten.
 * BoardColumn: title, count, children, footer (z. B. Formular „Aufgabe hinzufügen").
 * TaskCard: titel, person, faelligAm, tag, spalte, actions.
 * Beispiel:
 *   <div className="board">
 *     <BoardColumn title="Offen" count={2}> <TaskCard titel="Kickoff bestätigen" person="Jana" /> </BoardColumn>
 *   </div>
 */
import type { ReactNode } from "react";
import type { Spalte } from "@/db/schema";
import { faelligkeitsText, vorname } from "@/lib/format";
import { Tag } from "./Tag";

export function BoardColumn({
  title,
  count,
  children,
  footer,
  emptyText = "Nichts hier",
}: {
  title: string;
  count: number;
  children?: ReactNode;
  footer?: ReactNode;
  emptyText?: string;
}) {
  return (
    <section className="col" aria-label={title}>
      <h3>
        {title} <span>{count}</span>
      </h3>
      {count === 0 ? (
        <div className="empty-col">
          <span>{emptyText}</span>
        </div>
      ) : (
        <div className="col-list">{children}</div>
      )}
      {footer && <div className="col-add-wrap">{footer}</div>}
    </section>
  );
}

export function TaskCard({
  titel,
  person,
  faelligAm,
  tag,
  spalte,
  actions,
}: {
  titel: string;
  person?: string | null;
  faelligAm?: string | null;
  tag?: string | null;
  spalte: Spalte;
  actions?: ReactNode;
}) {
  const faellig = spalte === "erledigt" ? { text: "", ueberfaellig: false } : faelligkeitsText(faelligAm);
  const zeile = [person ? vorname(person) : null, faellig.text || null].filter(Boolean).join(" · ");
  return (
    <article className="task" data-spalte={spalte}>
      <b>{titel}</b>
      {zeile && <small data-ueberfaellig={faellig.ueberfaellig || undefined}>{zeile}</small>}
      <div className="task-foot">
        {tag ? <Tag kind={spalte === "in_arbeit" ? "teal" : "brass"}>{tag}</Tag> : <span />}
        {actions && <div className="task-actions">{actions}</div>}
      </div>
    </article>
  );
}
