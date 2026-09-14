-- R-05 / M-7: brisanje mrtvih polja oglasa (`buyerId`, `soldAt`, `jedinica`,
-- `kolicina`) i vrednosti `ListingStatus.SOLD`.
--
-- Nijedna ruta ih nije postavljala: tok „kupi" (`/api/pijaca/[id]/kupi`) ne
-- postoji, `PATCH /api/pijaca/[id]` menja status samo na `EXPIRED`, a jedino
-- mesto koje je `soldAt` dodirivalo bio je reset naloga — koji ga je nulovao.
-- Polja su pri tom stvarala `seller`/`buyer`/`price`/`soldAt` sliku iz koje se
-- oglašavanje čita kao posredovanje u prodaji (R-05, nalazi za PDV i
-- fiskalizaciju), i poreski dokaz koji u sistemu nikad nije ni nastao.

-- Zatečeni redovi sa statusom SOLD (ako ih ima od starog toka) prelaze u
-- EXPIRED — oglas je van ponude, a prodaja se više ne evidentira.
-- 🔴 Mora PRE zamene tipa: Postgres ne zna da izbaci vrednost iz enuma, pa se
-- tip zamenjuje novim, a zamena pada ako ijedan red još drži staru vrednost.
UPDATE "MarketplaceListing" SET "status" = 'EXPIRED' WHERE "status" = 'SOLD';

ALTER TABLE "MarketplaceListing" DROP CONSTRAINT IF EXISTS "MarketplaceListing_buyerId_fkey";
ALTER TABLE "MarketplaceListing" DROP COLUMN IF EXISTS "buyerId";
ALTER TABLE "MarketplaceListing" DROP COLUMN IF EXISTS "soldAt";
ALTER TABLE "MarketplaceListing" DROP COLUMN IF EXISTS "jedinica";
ALTER TABLE "MarketplaceListing" DROP COLUMN IF EXISTS "kolicina";

-- Zamena enum tipa bez vrednosti SOLD.
ALTER TYPE "ListingStatus" RENAME TO "ListingStatus_old";
CREATE TYPE "ListingStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'UKLONJEN');
ALTER TABLE "MarketplaceListing"
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "ListingStatus" USING ("status"::text::"ListingStatus"),
  ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
DROP TYPE "ListingStatus_old";
