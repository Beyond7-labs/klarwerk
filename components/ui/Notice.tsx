/**
 * Hinweis mit farbiger Kante links. Standard Teal, "error" rot, "brass" Messing.
 * Props: kind, children.
 * Beispiel: <Notice kind="error">E-Mail oder Passwort stimmen nicht.</Notice>
 */
import type { ReactNode } from "react";

export function Notice({
  kind = "info",
  children,
}: {
  kind?: "info" | "error" | "brass";
  children: ReactNode;
}) {
  return (
    <div className="notice" data-kind={kind === "info" ? undefined : kind} role={kind === "error" ? "alert" : undefined}>
      {children}
    </div>
  );
}
