/**
 * Seitenkopf in der Fläche: Titel, optional Breadcrumb, Unterzeile und Aktionen rechts.
 * Props: title, lede, crumbs (ReactNode), actions (ReactNode).
 * Beispiel: <PageHeader title="Projekte" lede="5 Projekte, 3 laufen" actions={<Button href="/projekte/neu">Neues Projekt</Button>} />
 */
import type { ReactNode } from "react";

export function PageHeader({
  title,
  lede,
  crumbs,
  actions,
}: {
  title: string;
  lede?: ReactNode;
  crumbs?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        {crumbs && <div className="crumbs">{crumbs}</div>}
        <h2>{title}</h2>
        {lede && <p className="lede">{lede}</p>}
      </div>
      {actions && <div className="actions">{actions}</div>}
    </div>
  );
}
