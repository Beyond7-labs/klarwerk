"use client";
/**
 * Kopiert einen Text in die Zwischenablage und bestätigt kurz.
 * Props: text, label.
 * Beispiel: <CopyButton text={link} label="Link kopieren" />
 */
import { useState } from "react";

export function CopyButton({ text, label = "Kopieren" }: { text: string; label?: string }) {
  const [kopiert, setKopiert] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setKopiert(true);
          setTimeout(() => setKopiert(false), 1800);
        } catch {
          setKopiert(false);
        }
      }}
    >
      {kopiert ? "Kopiert" : label}
    </button>
  );
}
