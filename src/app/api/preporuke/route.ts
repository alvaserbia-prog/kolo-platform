import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { preporukaNagrada } from "@/lib/protokol/emisija";

// Rang tabela za širenje (Prilog 1, tačka 2)
const RANG_SIRENJEM = [
  { do: 0,         rang: 0 },
  { do: 5,         rang: 1 },
  { do: 10,        rang: 2 },
  { do: 15,        rang: 3 },
  { do: 20,        rang: 4 },
  { do: 30,        rang: 5 },
  { do: 40,        rang: 6 },
  { do: 50,        rang: 7 },
  { do: 70,        rang: 8 },
  { do: 100,       rang: 9 },
  { do: Infinity,  rang: 10 },
];

function rangZaBroj(n: number): number {
  return RANG_SIRENJEM.find((r) => n <= r.do)?.rang ?? 10;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified) return NextResponse.json({ error: "Nije verifikovan." }, { status: 403 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      memberHash: true,
      referralsMade: {
        include: {
          referred: { select: { pseudonim: true, verified: true, verifiedAt: true, createdAt: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!user) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });

  const verifikovani = user.referralsMade.filter((r) => r.rewardPaid).length;
  const trenutniRang = rangZaBroj(verifikovani);
  const sledecaNagrada = preporukaNagrada(verifikovani + 1);

  const preporuke = user.referralsMade.map((r) => ({
    pseudonim: r.referred.pseudonim,
    registrovanAt: r.createdAt.toISOString(),
    verified: r.referred.verified,
    bonus: r.rewardPaid ? r.rewardAmount : null,
  }));

  // Tabela svih rangova
  const rangTabela = [
    { rang: 0, od: 0, do: 0, nagrada: 0 },
    { rang: 1, od: 1, do: 5, nagrada: 1_000 },
    { rang: 2, od: 6, do: 10, nagrada: 2_000 },
    { rang: 3, od: 11, do: 15, nagrada: 3_000 },
    { rang: 4, od: 16, do: 20, nagrada: 4_000 },
    { rang: 5, od: 21, do: 30, nagrada: 5_000 },
    { rang: 6, od: 31, do: 40, nagrada: 6_000 },
    { rang: 7, od: 41, do: 50, nagrada: 7_000 },
    { rang: 8, od: 51, do: 70, nagrada: 8_000 },
    { rang: 9, od: 71, do: 100, nagrada: 9_000 },
    { rang: 10, od: 101, do: null, nagrada: 10_000 },
  ];

  return NextResponse.json({
    memberHash: user.memberHash,
    verifikovani,
    trenutniRang,
    sledecaNagrada,
    preporuke,
    rangTabela,
  });
}
