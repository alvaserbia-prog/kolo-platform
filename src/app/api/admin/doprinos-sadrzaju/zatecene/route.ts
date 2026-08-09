import { NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jeSuperadmin } from "@/lib/dozvole";
import { logAdminAkcija } from "@/lib/audit";
import { evidentirajZateceneVerifikovane } from "@/lib/protokol/doprinos-sadrzaju";

/**
 * POST /api/admin/doprinos-sadrzaju/zatecene
 *
 * Jednokratno razrešava doprinose koji stoje ZABELEZEN kod verifikovanih korisnika
 * (čl. 40a, prelazni stav). Idempotentno — ponovno pokretanje ne evidentira dvaput.
 *
 * Namerno je na dugmetu, a ne u migraciji: emisija ide kroz `emitujPoen` (zero-sum,
 * audit), i opticaj skače za 1.000 × broj razrešenih, što može da upali osnivački
 * korak. Trenutak tog skoka treba da bira čovek.
 */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);
  if (!jeSuperadmin(session.user)) return await greska("Samo superadmin.", 403);

  try {
    const rezultat = await evidentirajZateceneVerifikovane();
    await logAdminAkcija(
      session.user.id,
      "DOPRINOS_SADRZAJU_ZATECENI_EVIDENTIRANI",
      undefined,
      `${rezultat.evidentirano} razrešeno, ${rezultat.poenUOpticaj} POEN u opticaj`,
    );
    return NextResponse.json(rezultat);
  } catch (e) {
    return await greska(String(e), 500);
  }
}
