import { prisma } from "./prisma";

export async function posaljiNotifikaciju(
  userId: string,
  tip: string,
  naslov: string,
  tekst: string,
  link?: string
) {
  await prisma.notifikacija.create({
    data: { userId, tip, naslov, tekst, link },
  });
}
