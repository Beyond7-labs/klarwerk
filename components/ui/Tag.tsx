/**
 * Kleines Etikett. Messing (Standard), Teal, Neutral oder Danger.
 * Props: kind, children.
 * Beispiel: <Tag kind="teal">Design</Tag>
 */
import type { ReactNode } from "react";

export function Tag({
  kind = "brass",
  children,
}: {
  kind?: "brass" | "teal" | "neutral" | "danger";
  children: ReactNode;
}) {
  return (
    <span className="tag" data-kind={kind === "brass" ? undefined : kind}>
      {children}
    </span>
  );
}
