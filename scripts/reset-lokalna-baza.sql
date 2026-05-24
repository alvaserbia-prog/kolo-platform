-- ─────────────────────────────────────────────────────────────────────────────
-- Reset lokalne baze: zadržati samo 3 korisnika sa stanjem 1000 POEN
-- Zadržani:
--   nikolaso    (84f637eb-f3d5-4a24-843e-66d5154ef888)
--   jelena      (782510e2-a7ad-4506-86a9-e1dab9118588)
--   Dragonkiss  (f7b602a6-ec30-4e32-a45a-25ac041a0476)
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

-- ─── 1. Dokaz stvarnosti (verifikacioni graf) ──────────────────────────────
DELETE FROM "VerifikacionaVeza";
DELETE FROM "VerifikacijaToken";

-- ─── 2. Prigovori, audit, blog, chat, notifikacije ─────────────────────────
DELETE FROM "PrigovorNaOdluku";
DELETE FROM "AuditLog";
DELETE FROM "ChatMessage";
DELETE FROM "BlogPost";
DELETE FROM "Notifikacija";

-- ─── 3. Poruke (chat 1-na-1) ───────────────────────────────────────────────
DELETE FROM "Poruka";
DELETE FROM "Konverzacija";

-- ─── 4. Glasanje ───────────────────────────────────────────────────────────
DELETE FROM "GlasanjeGlas";
DELETE FROM "GlasanjePredlog";

-- ─── 5. ZRNO sistem ────────────────────────────────────────────────────────
DELETE FROM "ZrnoDelegacija";
DELETE FROM "ZrnoDailyRate";
DELETE FROM "ZrnoStatusZahtev";
DELETE FROM "ZrnoProdajaZahtev";
DELETE FROM "ZrnoKupovinaZahtev";
DELETE FROM "ZrnoStanje";

-- ─── 6. Doprinos-oglasi (operativni program) ───────────────────────────────
DELETE FROM "OglasEvidencija";
DELETE FROM "OglasPrijava";
DELETE FROM "DoprinosOglas";

-- ─── 7. Programi Protokola (PED, socijalni) ────────────────────────────────
DELETE FROM "DoprinosEvidencija";
DELETE FROM "ProgramEnrollment";

-- ─── 8. Pokrovitelji ───────────────────────────────────────────────────────
DELETE FROM "PokroviteljBonusEmisija";
DELETE FROM "PokroviteljDoprinos";
DELETE FROM "Pokrovitelj";

-- ─── 9. Donacije ───────────────────────────────────────────────────────────
DELETE FROM "DonationRecord";

-- ─── 10. Pijaca ────────────────────────────────────────────────────────────
DELETE FROM "MarketplaceListing";

-- ─── 11. Krug (članstva, bonusi, projekti, pristupnice) ────────────────────
DELETE FROM "KrugBonusLog";
DELETE FROM "KrugProjekat";
DELETE FROM "KrugPristupnica";
DELETE FROM "KrugClanstvo";
DELETE FROM "KrugOsnivanjeZahtev";

-- ─── 12. Transakcije (sve) ─────────────────────────────────────────────────
DELETE FROM "Transaction";
DELETE FROM "DailyEmissionSummary";

-- ─── 13. Walleti (KRUG, pa Krug, pa USER van 3) ────────────────────────────
DELETE FROM "Wallet" WHERE type = 'KRUG';
DELETE FROM "Krug";
DELETE FROM "Wallet"
WHERE type = 'USER'
  AND "userId" NOT IN (
    'f7b602a6-ec30-4e32-a45a-25ac041a0476',
    '782510e2-a7ad-4506-86a9-e1dab9118588',
    '84f637eb-f3d5-4a24-843e-66d5154ef888'
  );

-- ─── 14. Pristanci, verifikacije i ostali user-vezani zapisi van 3 ─────────
DELETE FROM "PolitikaPrihvatanje"
WHERE "userId" NOT IN (
  'f7b602a6-ec30-4e32-a45a-25ac041a0476',
  '782510e2-a7ad-4506-86a9-e1dab9118588',
  '84f637eb-f3d5-4a24-843e-66d5154ef888'
);

DELETE FROM "VerifikacijaPristanak"
WHERE "userId" NOT IN (
  'f7b602a6-ec30-4e32-a45a-25ac041a0476',
  '782510e2-a7ad-4506-86a9-e1dab9118588',
  '84f637eb-f3d5-4a24-843e-66d5154ef888'
);

DELETE FROM "VerificationRequest"
WHERE "userId" NOT IN (
  'f7b602a6-ec30-4e32-a45a-25ac041a0476',
  '782510e2-a7ad-4506-86a9-e1dab9118588',
  '84f637eb-f3d5-4a24-843e-66d5154ef888'
);

DELETE FROM "Referral";

DELETE FROM "UserPodaci"
WHERE "userId" NOT IN (
  'f7b602a6-ec30-4e32-a45a-25ac041a0476',
  '782510e2-a7ad-4506-86a9-e1dab9118588',
  '84f637eb-f3d5-4a24-843e-66d5154ef888'
);

DELETE FROM "PasswordResetToken"
WHERE "userId" NOT IN (
  'f7b602a6-ec30-4e32-a45a-25ac041a0476',
  '782510e2-a7ad-4506-86a9-e1dab9118588',
  '84f637eb-f3d5-4a24-843e-66d5154ef888'
);

-- ─── 15. Self-reference referredBy → NULL (da bi DELETE User prošao) ──────
UPDATE "User" SET "referredById" = NULL;

-- ─── 16. Konačno: korisnici van 3 ──────────────────────────────────────────
DELETE FROM "User"
WHERE id NOT IN (
  'f7b602a6-ec30-4e32-a45a-25ac041a0476',
  '782510e2-a7ad-4506-86a9-e1dab9118588',
  '84f637eb-f3d5-4a24-843e-66d5154ef888'
);

-- ─── 17. Setup za 3 zadržana: svi verifikovani ─────────────────────────────
UPDATE "User"
SET verified = true,
    "verifiedAt" = COALESCE("verifiedAt", NOW()),
    "slotoviPotroseni" = 0
WHERE id IN (
  'f7b602a6-ec30-4e32-a45a-25ac041a0476',
  '782510e2-a7ad-4506-86a9-e1dab9118588',
  '84f637eb-f3d5-4a24-843e-66d5154ef888'
);

-- ─── 18. Wallet balansi: 1000 POEN po korisniku, Protokol = -3000 ─────────
UPDATE "Wallet" SET balance = 1000
WHERE "userId" IN (
  'f7b602a6-ec30-4e32-a45a-25ac041a0476',
  '782510e2-a7ad-4506-86a9-e1dab9118588',
  '84f637eb-f3d5-4a24-843e-66d5154ef888'
);

UPDATE "Wallet" SET balance = -3000 WHERE type = 'PROTOKOL';

-- ─── 19. ZrnoTrziste reset ─────────────────────────────────────────────────
UPDATE "ZrnoTrziste" SET "isActive" = false, "activatedAt" = NULL;

-- ─── 20. Provera zero-sum ──────────────────────────────────────────────────
SELECT
  (SELECT COUNT(*) FROM "User") AS broj_korisnika,
  (SELECT SUM(balance) FROM "Wallet") AS zero_sum_provera,
  (SELECT SUM(balance) FROM "Wallet" WHERE type = 'USER') AS user_total,
  (SELECT balance FROM "Wallet" WHERE type = 'PROTOKOL') AS protokol;

COMMIT;
