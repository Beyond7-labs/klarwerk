/**
 * Avatar mit Initialen auf Teal.
 * Props: name, size ("md" | "sm").
 * Beispiel: <Avatar name="Jana Petersen" size="sm" />
 */
import { initialen } from "@/lib/format";

export function Avatar({ name, size = "md" }: { name: string; size?: "md" | "sm" }) {
  return (
    <span className={`avatar${size === "sm" ? " sm" : ""}`} title={name} aria-label={name}>
      {initialen(name)}
    </span>
  );
}

/** Mehrere Avatare überlappend, z. B. das Team eines Projekts. */
export function AvatarRow({ namen, max = 4 }: { namen: string[]; max?: number }) {
  const sichtbar = namen.slice(0, max);
  const rest = namen.length - sichtbar.length;
  return (
    <span className="avatar-row">
      {sichtbar.map((n) => (
        <Avatar key={n} name={n} size="sm" />
      ))}
      {rest > 0 && (
        <span className="avatar sm" style={{ background: "var(--ink-faint)" }}>
          +{rest}
        </span>
      )}
    </span>
  );
}
