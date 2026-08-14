import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gdePseudonim } from "@/lib/pseudonim";
import { DoprinosOkidac, TransactionType } from "@/generated/prisma/client";
import { obavesti } from "@/lib/notifikacije";
import { probajEvidentirati, smeDaSalje } from "@/lib/protokol/doprinos-sadrzaju";
import { probajEvidentiratiKorake, probajNapredovati } from "@/lib/protokol/doprinos-razmeni";
import { jeNadoknada, iznosNadoknade } from "@/lib/protokol/nadoknada";
import { smeDaPrepise, uMirovanju, ucitajUcesnika } from "@/lib/protokol/deca";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  let body: { pseudonim?: string; amount?: unknown; description?: string };
  try {
    body = await req.json();
  } catch {
    return await greska("Neispravan zahtev.", 400);
  }
  const { pseudonim, amount, description } = body;

  // Validacija ulaza
  if (!pseudonim || !amount) {
    return await greska("Primalac i iznos su obavezni.", 400);
  }
  const iznos = Math.floor(Number(amount));
  if (!Number.isInteger(iznos) || iznos <= 0) {
    return await greska("Iznos mora biti pozitivan ceo broj.", 400);
  }

  // Pronađi primaoca
  // Pseudonim se traži bez obzira na veličinu slova — ko ukuca `marko` misli na
  // `Marko`, a drugog `marko` po jedinstvenosti ne može ni biti.
  const primalac = await prisma.user.findFirst({
    where: gdePseudonim(pseudonim),
    include: { wallet: true },
  });
  if (!primalac) {
    return await greska("Korisnik sa tim pseudonimom ne postoji.", 404);
  }
  if (primalac.id === session.user.id) {
    return await greska("Ne možete prepisati POEN samom sebi.", 400);
  }
  if (!primalac.wallet) {
    return await greska("Primalac nema zapis u Protokolu.", 500);
  }

  // Pronađi pošiljaoca
  const posiljac = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { wallet: true },
  });
  if (!posiljac?.wallet) {
    return await greska("Nemate zapis u Protokolu.", 500);
  }
  // Neverifikovani korisnik u ažuriranju evidencije učestvuje ISKLJUČIVO kao
  // primalac (Pravilnik 4.1.1 čl. 28 st. 2). Uslov se vezuje za tip naloga, ne za
  // indeks stvarnosti: ko je jednom verifikovan sme da prepisuje POEN i ako mu indeks
  // kasnije padne. Čita se iz baze, ne iz sesije — token se osvežava sa zakašnjenjem,
  // pa bi tek verifikovan korisnik još neko vreme bio odbijan.
  // ── Modul Deca (čl. 14) ────────────────────────────────────────────────────
  //
  // Kad je bar jedna strana maloletna, o prepisu odlučuje `smeDaPrepise`, a ne opšte
  // pravilo o neverifikovanom nalogu: maloletni korisnik jeste NEVERIFIKOVAN u smislu
  // šeme, ali u dečjem prostoru sme da prepisuje. Zato ova provera ide PRE
  // `smeDaSalje`, i preuzima odluku za sve parove u kojima ima deteta.
  const [odUcesnik, kaUcesnik] = await Promise.all([
    ucitajUcesnika(posiljac.id),
    ucitajUcesnika(primalac.id),
  ]);
  if (!odUcesnik || !kaUcesnik) return await greska("Nalog ne postoji.", 401);
  const jeDecjiPar = odUcesnik.maloletan || kaUcesnik.maloletan;

  if (jeDecjiPar) {
    if ((await uMirovanju(posiljac.id)) || (await uMirovanju(primalac.id))) {
      return await greska(
        "Nalog miruje dok stvarnost roditelja ne bude ponovo potvrđena. Ništa nije obrisano.",
        403,
      );
    }
    const dozvoljeno = smeDaPrepise(odUcesnik, kaUcesnik);
    if (!dozvoljeno.ok) return await greska(dozvoljeno.razlog, dozvoljeno.status);
  } else if (!smeDaSalje(posiljac.tipKorisnika)) {
    return await greska(
      "Dok nisi verifikovan/a možeš samo da primaš POEN. Prepis u tuđi zapis otvara se po verifikaciji.",
      403,
    );
  }
  // Nadoknada (negativan zapis po čl. 20b Pravilnika o dokazu stvarnosti) ne
  // sprečava razmenu dobara i usluga, ali POEN-i koji pristignu prvo popunjavaju
  // nadoknadu — dok zapis ne pređe nulu nema čime da se prepisuje drugome.
  if (jeNadoknada(posiljac.wallet.balance)) {
    return await greska(
      `Na tvom zapisu stoji nadoknada od ${iznosNadoknade(posiljac.wallet.balance)} POEN-a. ` +
        `POEN-i koji ti pristignu prvo je popunjavaju; prepis u tuđi zapis je moguć tek kad zapis pređe nulu. ` +
        `Razmena dobara i usluga ti nije ograničena.`,
      400
    );
  }
  if (posiljac.wallet.balance < iznos) {
    return await greska(`Nemate dovoljno POEN-a. Stanje: ${posiljac.wallet.balance}.`, 400);
  }

  // Ažuriranje evidencije 1:1 — bez posrednika, bez provizije; nije prenos monetarne vrednosti (Pravilnik čl. 16)
  // Skidanje POEN-a je ATOMSKO (updateMany sa uslovom balance >= iznos): garantuje da
  // dva paralelna transfera ne mogu oba da prođu i odvedu stanje u minus (anti double-spend).
  try {
    await prisma.$transaction(async (tx) => {
      const skinuto = await tx.wallet.updateMany({
        where: { id: posiljac.wallet!.id, balance: { gte: iznos } },
        data: { balance: { decrement: iznos } },
      });
      if (skinuto.count !== 1) {
        // Stanje se u međuvremenu promenilo (paralelni transfer) — prekini ceo posao.
        throw new Error("NEDOVOLJNO_SREDSTAVA");
      }
      await tx.wallet.update({
        where: { id: primalac.wallet!.id },
        data: { balance: { increment: iznos } },
      });
      await tx.transaction.create({
        data: {
          fromWalletId: posiljac.wallet!.id,
          toWalletId: primalac.wallet!.id,
          amount: iznos,
          type: TransactionType.TRANSFER,
          description: description?.trim() || null,
        },
      });
    });
  } catch (e) {
    if (e instanceof Error && e.message === "NEDOVOLJNO_SREDSTAVA") {
      return await greska("Nemate dovoljno POEN-a.", 400);
    }
    throw e;
  }

  // Primljen POEN je jedan od dva okidača za evidentiranje doprinosa sadržaju
  // (čl. 40a st. 3). Zove se VAN transakcije — `emitujPoen()` otvara sopstvenu.
  // Ne baca: prenos je već upisan i ne sme da padne zbog ovog kanala.
  await probajEvidentirati(primalac.id, DoprinosOkidac.PRIMLJEN_POEN, posiljac.id);
  // Primljen POEN je okidač i za zabeležene korake putanje doprinosa razmeni.
  await probajEvidentiratiKorake(primalac.id);

  // Prenos POEN-a pomera brojač OBEMA stranama: pošiljaocu može da otvori korak 2
  // (POEN ka sagovorniku van lanca), a obojici može da zatvori sagovornika ako je
  // ovim POEN vraćen u roku od 60 dana. Sekvencijalno i van transakcije; ne baca.
  await probajNapredovati(posiljac.id);
  await probajNapredovati(primalac.id);

  // Iznos se NE formatira ovde: broj ide kao parametar, a razdvajač hiljada se
  // bira pri prikazu, po jeziku primaoca (sr 1.000 · en 1,000 · ru 1 000).
  await obavesti(primalac.id, {
    tip: "transfer_primljen",
    kljuc: description
      ? "notifikacije.transfer_primljen_poruka"
      : "notifikacije.transfer_primljen",
    parametri: { iznos, pseudonim: posiljac.pseudonim, poruka: description ?? "" },
    naslov: `Prepisano ti je ${iznos.toLocaleString("sr-RS")} POEN`,
    tekst: `${posiljac.pseudonim} ti je prepisao/la ${iznos.toLocaleString("sr-RS")} POEN u tvoj zapis.${description ? ` Poruka: "${description}"` : ""}`,
    link: "/novcanik",
  });

  return NextResponse.json({ ok: true });
}
