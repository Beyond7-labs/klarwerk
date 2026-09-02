/**
 * Auswahlkarte (Radio als Karte): Titel und Unterzeile, gewählt mit Messing-Rahmen.
 * Funktioniert ohne JavaScript über ein verstecktes Radio-Input.
 * Props: name, value, title, text, defaultChecked.
 * Beispiel:
 *   <div className="choices">
 *     <ChoiceCard name="rolle" value="mitglied" title="Mitglied" text="Sieht und bearbeitet Projekte" defaultChecked />
 *     <ChoiceCard name="rolle" value="admin" title="Admin" text="Kann zusätzlich einladen" />
 *   </div>
 */
export function ChoiceCard({
  name,
  value,
  title,
  text,
  defaultChecked,
}: {
  name: string;
  value: string;
  title: string;
  text?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="choice">
      <input type="radio" name={name} value={value} defaultChecked={defaultChecked} />
      <span className="choice-mark" aria-hidden="true" />
      <span>
        <b>{title}</b>
        {text && <small>{text}</small>}
      </span>
    </label>
  );
}
