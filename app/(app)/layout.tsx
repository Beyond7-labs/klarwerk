import { Shell } from "@/components/ui";
import { sitzungErforderlich } from "@/lib/auth";
import { platzbelegung } from "@/lib/data";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const s = await sitzungErforderlich();
  const belegt = await platzbelegung(s.mandant.id);
  return (
    <Shell
      mandantName={s.mandant.name}
      plaetzeBelegt={belegt}
      plaetze={s.mandant.plaetze}
      nutzerName={s.nutzer.name}
    >
      {children}
    </Shell>
  );
}
