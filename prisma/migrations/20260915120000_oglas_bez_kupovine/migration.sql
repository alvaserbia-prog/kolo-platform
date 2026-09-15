-- R-07 (nelojalna i obmanjujuća poslovna praksa) — trgovinski rečnik izlazi iz šeme.
--
-- 🔴 Isključivo RENAME. Nijedan red se ne menja, nijedan podatak se ne gubi.
-- Isti postupak kao `20260913130000_zrno_bez_trzista_i_kursa` (R-04): repo je javan
-- pod AGPL, pa je `schema.prisma` prvi dokument koji ozbiljan čitalac otvori. Uslovi
-- čl. 22 kažu da Fondacija nije strana u razmeni i da razmena nije kupoprodaja, a
-- šema je govorila `buyer` / `soldAt` / `SOLD`.
--
-- `ALTER TYPE ... RENAME VALUE` je transakciono bezbedno (za razliku od ADD VALUE),
-- pa enum i kolone smeju u isti fajl.

ALTER TYPE "ListingStatus" RENAME VALUE 'SOLD' TO 'RAZMENJEN';

ALTER TABLE "MarketplaceListing" RENAME COLUMN "buyerId" TO "primalacId";
ALTER TABLE "MarketplaceListing" RENAME COLUMN "soldAt" TO "razmenjenoAt";

-- Ime FK ograničenja prati ime kolone u Prisma konvenciji; bez ovoga bi `migrate dev`
-- prijavljivao drift. DO blok jer Postgres nema `RENAME CONSTRAINT IF EXISTS`.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'MarketplaceListing_buyerId_fkey'
      AND conrelid = '"MarketplaceListing"'::regclass
  ) THEN
    ALTER TABLE "MarketplaceListing"
      RENAME CONSTRAINT "MarketplaceListing_buyerId_fkey" TO "MarketplaceListing_primalacId_fkey";
  END IF;
END $$;
