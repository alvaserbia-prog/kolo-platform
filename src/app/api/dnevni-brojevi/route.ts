import { NextResponse } from "next/server";
import { sesija } from "@/lib/sesija";
import { izracunajDnevniBrojeve } from "@/lib/chrome-podaci";

export async function GET() {
  const session = await sesija();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const brojevi = await izracunajDnevniBrojeve(session.user.id, session.user);
  return NextResponse.json(brojevi);
}
