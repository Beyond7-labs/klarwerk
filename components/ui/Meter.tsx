/**
 * Auslastungsbalken: Anteil gegen Kapazität, ab 85 % Messing, über 100 % rot.
 * Props: wert, max, label (Text rechts).
 * Beispiel: <Meter wert={26} max={32} label="26 von 32 h" />
 */
export function Meter({ wert, max, label }: { wert: number; max: number; label?: string }) {
  const anteil = max > 0 ? wert / max : 0;
  const level = anteil > 1 ? "ueber" : anteil >= 0.85 ? "hoch" : undefined;
  return (
    <div className="meter">
      <div className="bar" role="meter" aria-valuenow={wert} aria-valuemin={0} aria-valuemax={max}>
        <i style={{ width: `${Math.min(100, Math.round(anteil * 100))}%` }} data-level={level} />
      </div>
      {label && <b>{label}</b>}
    </div>
  );
}

/** Schlanker Fortschrittsbalken ohne Beschriftung (z. B. Aufgaben erledigt). */
export function Progress({ wert, max }: { wert: number; max: number }) {
  const anteil = max > 0 ? Math.round((wert / max) * 100) : 0;
  return (
    <div className="bar" role="progressbar" aria-valuenow={anteil} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${anteil}%` }} />
    </div>
  );
}
