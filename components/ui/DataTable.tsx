/**
 * Tabelle mit Kopfzeile in Versalien, Zebra beim Hover, horizontal scrollbar.
 * Props: children (thead/tbody).
 * Beispiel:
 *   <DataTable>
 *     <thead><tr><th>Name</th><th className="num">Projekte</th></tr></thead>
 *     <tbody>…</tbody>
 *   </DataTable>
 */
import type { ReactNode } from "react";

export function DataTable({ children }: { children: ReactNode }) {
  return (
    <div className="table-wrap">
      <table className="table">{children}</table>
    </div>
  );
}
