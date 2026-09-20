-- ============================================================================
--  UKLANJANJE PAROVA „emisija po potvrdi → usklađivanje"
--  Za Neon SQL Editor. Odluka vlasnika, 19.09.2026.
--
--  🔴 PRE POKRETANJA: u redu ispod (v_pseudonim) upiši SVOJ pseudonim.
--     Bez toga blok staje i ništa ne menja.
--
--  🟢 SVE JE U JEDNOM BLOKU, DAKLE SVE ILI NIŠTA. Ako bilo koja provera ne
--     prođe, Postgres poništava ceo blok i baza ostaje tačno kakva je bila.
--     Nema stanja „pola urađeno".
--
--  Šta radi: uklanja prva dva reda od tri (emisija po potvrdi, pa njeno
--  povlačenje po čl. 22a). Treći red — ponovni upis po nastupanju uslova —
--  ostaje netaknut.
--
--  Šta NE menja: nijedno stanje, opticaj ni zero-sum. Par je +X i −X, pa se u
--  svakom zbiru poništava. `Wallet.balance` je zaseban upisan broj i ovaj blok
--  ga ne dodiruje nijednom naredbom.
-- ============================================================================

DO $$
DECLARE
  -- 🔴 UPIŠI SVOJ PSEUDONIM OVDE, između navodnika:
  v_pseudonim  text := 'UPISI_SVOJ_PSEUDONIM';

  v_admin_id   text;
  v_admin_nivo text;
  v_neupareni  int;
  v_sumnjivi   int;
  v_parova     int;
  v_obrisano   int;
  v_ocekivano  int;
  v_zero       bigint;
  v_nesklad    int;
BEGIN
  -- ── 0. Ko sprovodi — revizijski trag mora da imenuje čoveka ──────────────
  SELECT id, admin::text INTO v_admin_id, v_admin_nivo
  FROM "User" WHERE "pseudonimLower" = lower(v_pseudonim);

  IF v_admin_id IS NULL THEN
    RAISE EXCEPTION 'STOP: nalog "%" ne postoji. Nista nije promenjeno.', v_pseudonim;
  END IF;
  IF v_admin_nivo <> 'SUPERADMIN' THEN
    RAISE EXCEPTION 'STOP: nalog "%" nije superadmin (nivo: %). Nista nije promenjeno.',
      v_pseudonim, v_admin_nivo;
  END IF;

  -- ── 1. Zero-sum pre svega ────────────────────────────────────────────────
  SELECT COALESCE(SUM(balance), 0) INTO v_zero FROM "Wallet";
  IF v_zero <> 0 THEN
    RAISE EXCEPTION 'STOP: zero-sum nije nula (%). To je tezi problem. Nista nije promenjeno.', v_zero;
  END IF;

  -- ── 2. Uparivanje ────────────────────────────────────────────────────────
  -- Veza ka originalu je obrisana pri povlacenju (verifikatorTxId = null itd.),
  -- pa se par trazi po novcaniku + iznosu + redosledu. ROW_NUMBER sa obe strane
  -- daje uparivanje 1:1: n-to povlacenje ide uz n-tu emisiju istog iznosa.
  CREATE TEMP TABLE _parovi ON COMMIT DROP AS
  WITH povlacenja AS (
    SELECT id, "fromWalletId" AS w, amount, "createdAt",
           ROW_NUMBER() OVER (PARTITION BY "fromWalletId", amount ORDER BY "createdAt") AS rn
    FROM "Transaction"
    WHERE type = 'USKLADJIVANJE_POTVRDE'
  ),
  emisije AS (
    SELECT id, "toWalletId" AS w, amount, "createdAt",
           ROW_NUMBER() OVER (PARTITION BY "toWalletId", amount ORDER BY "createdAt") AS rn
    FROM "Transaction"
    WHERE type IN ('EMISIJA_VERIFIKACIJA', 'EMISIJA_NADZOR')
  )
  SELECT p.id AS povlacenje_id, e.id AS emisija_id, p.w AS wallet_id, p.amount,
         p."createdAt" AS povuceno_at, e."createdAt" AS emitovano_at
  FROM povlacenja p
  LEFT JOIN emisije e ON e.w = p.w AND e.amount = p.amount AND e.rn = p.rn;

  SELECT COUNT(*) FILTER (WHERE emisija_id IS NULL),
         COUNT(*) FILTER (WHERE emisija_id IS NOT NULL AND emitovano_at >= povuceno_at),
         COUNT(*) FILTER (WHERE emisija_id IS NOT NULL)
    INTO v_neupareni, v_sumnjivi, v_parova
  FROM _parovi;

  IF v_neupareni > 0 THEN
    RAISE EXCEPTION 'STOP: % povlacenja nema svoju emisiju. Nista nije promenjeno.', v_neupareni;
  END IF;
  IF v_sumnjivi > 0 THEN
    RAISE EXCEPTION 'STOP: % para ima emisiju POSLE povlacenja (to je ponovni upis). Nista nije promenjeno.', v_sumnjivi;
  END IF;
  IF v_parova = 0 THEN
    RAISE EXCEPTION 'STOP: nema nijednog para — nema sta da se ukloni.';
  END IF;

  -- ── 3. Slaze li se stanje sa istorijom PRE uklanjanja ────────────────────
  -- Protokol ulazi u skup: emisije su isle IZ njega, povlacenja U njega.
  CREATE TEMP TABLE _pogodjeni ON COMMIT DROP AS
  SELECT DISTINCT wallet_id FROM _parovi
  UNION
  SELECT 'banka-singleton';

  SELECT COUNT(*) INTO v_nesklad
  FROM "Wallet" w
  JOIN _pogodjeni g ON g.wallet_id = w.id
  WHERE w.balance <>
        COALESCE((SELECT SUM(amount) FROM "Transaction" WHERE "toWalletId"   = w.id), 0)
      - COALESCE((SELECT SUM(amount) FROM "Transaction" WHERE "fromWalletId" = w.id), 0);

  IF v_nesklad > 0 THEN
    RAISE EXCEPTION 'STOP: kod % naloga se stanje vec sada ne slaze sa istorijom. Nista nije promenjeno.', v_nesklad;
  END IF;

  -- ── 4. Uklanjanje ────────────────────────────────────────────────────────
  v_ocekivano := v_parova * 2;

  DELETE FROM "Transaction"
  WHERE id IN (
    SELECT povlacenje_id FROM _parovi
    UNION ALL
    SELECT emisija_id FROM _parovi WHERE emisija_id IS NOT NULL
  );
  GET DIAGNOSTICS v_obrisano = ROW_COUNT;

  IF v_obrisano <> v_ocekivano THEN
    RAISE EXCEPTION 'STOP: uklonjeno %, ocekivano %. Ponistavam sve.', v_obrisano, v_ocekivano;
  END IF;

  -- ── 5. Provere POSLE uklanjanja — jos unutar istog bloka ─────────────────
  -- 🔴 Ovo je prava brana. Ceo par je +X i −X, pa mora ostaviti zbir zapisa
  -- nepromenjenim. Uklonjena samo jedna polovina pomerila bi zbir a stanje
  -- ostavila isto — nesklad koji nijedna zatecena provera u sistemu ne vidi.
  SELECT COUNT(*) INTO v_nesklad
  FROM "Wallet" w
  JOIN _pogodjeni g ON g.wallet_id = w.id
  WHERE w.balance <>
        COALESCE((SELECT SUM(amount) FROM "Transaction" WHERE "toWalletId"   = w.id), 0)
      - COALESCE((SELECT SUM(amount) FROM "Transaction" WHERE "fromWalletId" = w.id), 0);

  IF v_nesklad > 0 THEN
    RAISE EXCEPTION 'STOP: posle uklanjanja se kod % naloga stanje razislo sa istorijom. Ponistavam sve.', v_nesklad;
  END IF;

  SELECT COALESCE(SUM(balance), 0) INTO v_zero FROM "Wallet";
  IF v_zero <> 0 THEN
    RAISE EXCEPTION 'STOP: zero-sum narusen (%). Ponistavam sve.', v_zero;
  END IF;

  -- ── 6. Revizijski trag ───────────────────────────────────────────────────
  -- 🔴 `AuditLog.id` nema podrazumevanu vrednost u bazi (Prisma ga pravi u
  -- kodu), pa se ovde mora generisati — inace upis puca.
  INSERT INTO "AuditLog" ("id", "adminId", "akcija", "detalji", "createdAt")
  VALUES (
    gen_random_uuid()::text,
    v_admin_id,
    'POTVRDE_PAROVI_UKLONJENI',
    format('Uklonjeno %s zapisa (%s parova emisija+uskladjivanje). Stanja, opticaj i zero-sum nepromenjeni.',
           v_obrisano, v_parova),
    now()
  );

  RAISE NOTICE '✅ GOTOVO: uklonjeno % zapisa (% parova). Zero-sum: %.', v_obrisano, v_parova, v_zero;
END $$;
