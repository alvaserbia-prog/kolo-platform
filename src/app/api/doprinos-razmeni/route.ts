/**
 * Putanja doprinosa razmeni — stanje lestvice za vlasnika naloga.
 * Osnov: Pravilnik o KOLO sistemu čl. 40a, čl. 67 (tuđ napredak se ne prikazuje).
 */
import { NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dohvatiPutanju } from "@/lib/protokol/doprinos-razmeni";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);
  return NextResponse.json(await dohvatiPutanju(session.user.id));
}
