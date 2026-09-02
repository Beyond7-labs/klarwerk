/**
 * Projektstatus mit farbigem Punkt: läuft (Teal), pausiert (Messing), abgeschlossen (grau).
 * Props: status.
 * Beispiel: <StatusDot status="laufend" />
 */
import type { ProjektStatus } from "@/db/schema";
import { PROJEKT_STATUS_LABEL } from "@/lib/format";

export function StatusDot({ status }: { status: ProjektStatus }) {
  return (
    <span className="status" data-status={status}>
      {PROJEKT_STATUS_LABEL[status]}
    </span>
  );
}
