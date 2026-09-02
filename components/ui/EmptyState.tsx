/**
 * Leerzustand: Überschrift, ein Satz, eine Aktion.
 * Props: title, text, action (ReactNode).
 * Beispiel: <EmptyState title="Noch keine Kunden" text="…" action={<Button href="/kunden/neu">Neuer Kunde</Button>} />
 */
import type { ReactNode } from "react";

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}
