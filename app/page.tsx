import { redirect } from "next/navigation";
import { aktuelleSitzung } from "@/lib/auth";

export default async function Start() {
  const sitzung = await aktuelleSitzung();
  redirect(sitzung ? "/projekte" : "/anmelden");
}
