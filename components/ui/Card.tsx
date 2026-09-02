/**
 * Karte auf --surface mit Rahmen, Radius 10, leichtem Schatten.
 * Props: padding ("md" | "sm" | "none"), title, lede, actions, children.
 * Beispiel: <Card title="Team" lede="Wer in der Agentur arbeitet."> … </Card>
 */
import type { HTMLAttributes, ReactNode } from "react";

type Props = {
  padding?: "md" | "sm" | "none";
  title?: string;
  lede?: string;
  actions?: ReactNode;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export function Card({ padding = "md", title, lede, actions, children, className, ...rest }: Props) {
  const pad = padding === "md" ? "pad" : padding === "sm" ? "pad-sm" : "";
  return (
    <section className={["kw-card", pad, className].filter(Boolean).join(" ")} {...rest}>
      {(title || actions) && (
        <div className="card-head">
          <div>
            {title && <h3>{title}</h3>}
            {lede && <p className="card-lede" style={{ marginBottom: 0 }}>{lede}</p>}
          </div>
          {actions}
        </div>
      )}
      {!title && lede && <p className="card-lede">{lede}</p>}
      {children}
    </section>
  );
}
