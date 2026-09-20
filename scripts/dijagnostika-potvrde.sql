-- ============================================================================
-- PAROVI „emisija po potvrdi → usklađivanje" — DIJAGNOSTIKA U NEON SQL EDITORU
--
-- 🔴 Sva četiri upita su SAMO SELECT. Ništa ne upisuju, ne menjaju i ne brišu.
--    Mogu se pustiti i nad produkcionom bazom.
--
-- Gde: console.neon.tech → projekat → SQL Editor
--      produkcija = endpoint ep-empty-forest-alajuasx
--      test       = endpoint ep-old-sky-aleg2alm
--
-- Pušta se upit po upit (Neon izvršava označeni tekst ili ceo editor).
-- ============================================================================


-- ── 1. Osnovno ─────────────────────────────────────────────────────────────
-- zero_sum MORA biti 0. Ako nije, stati i javiti — to je teži problem od ovoga.
SELECT
  (SELECT SUM(balance) FROM "Wallet")                                       AS zero_sum_mora_biti_0,
  (SELECT ABS(balance) FROM "Wallet" WHERE id = 'banka-singleton')          AS opticaj,
  (SELECT COUNT(*) FROM "Transaction")                                      AS ukupno_zapisa,
  (SELECT COUNT(*) FROM "Transaction" WHERE type = 'USKLADJIVANJE_POTVRDE') AS povlacenja;


-- ── 2. Uparivanje — OVO JE ODLUČUJUĆI UPIT ─────────────────────────────────
-- Veza ka originalu je obrisana pri povlačenju (verifikatorTxId = null itd.),
-- pa se par traži po novčaniku + iznosu + redosledu: n-to povlačenje se pari
-- sa n-tom emisijom istog iznosa na istom novčaniku.
--
-- 🔴 `neuparenih` MORA biti 0 da bi brisanje bilo bezbedno. Povlačenje bez
--    svoje emisije znači da je istorija drugačija nego što pretpostavljamo.
-- 🔴 `sumnjiv_redosled` MORA biti 0 — emisija uparena posle svog povlačenja
--    je ponovni upis, a njega ne smemo dirati.
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
),
parovi AS (
  SELECT p.id AS povlacenje_id, e.id AS emisija_id, p.amount,
         p."createdAt" AS povuceno_at, e."createdAt" AS emitovano_at
  FROM povlacenja p
  LEFT JOIN emisije e
         ON e.w = p.w AND e.amount = p.amount AND e.rn = p.rn
)
SELECT
  COUNT(*)                                                                   AS povlacenja_ukupno,
  COUNT(emisija_id)                                                          AS uparenih,
  COUNT(*) - COUNT(emisija_id)                                               AS neuparenih,
  COUNT(emisija_id) * 2                                                      AS redova_bi_nestalo,
  COUNT(*) FILTER (WHERE emisija_id IS NOT NULL AND emitovano_at >= povuceno_at)
                                                                             AS sumnjiv_redosled
FROM parovi;


-- ── 3. Ko je pogođen — spisak po čoveku ────────────────────────────────────
-- Sortirano tako da su oni sa najnižim stanjem (minus) na vrhu.
-- To je spisak ljudi koje treba rešiti lično.
SELECT
  COALESCE(u.pseudonim, '(bez korisnika)') AS clan,
  w.balance                                AS stanje,
  CASE WHEN w.balance < 0 THEN 'MINUS' ELSE '' END AS oznaka,
  COUNT(t.id)                              AS povlacenja,
  SUM(t.amount)                            AS povuceno_poen
FROM "Transaction" t
JOIN "Wallet" w       ON w.id = t."fromWalletId"
LEFT JOIN "User" u    ON u.id = w."userId"
WHERE t.type = 'USKLADJIVANJE_POTVRDE'
GROUP BY u.pseudonim, w.balance, w.id
ORDER BY w.balance ASC;


-- ── 4. Slaže li se stanje sa istorijom — PRE bilo kakve izmene ─────────────
-- Ova provera u sistemu NE POSTOJI: `checkZeroSum` gleda samo da je ZBIR svih
-- stanja nula, pa pojedinačno stanje može da odluta a da alarm ćuti.
--
-- 🟢 PRAZAN REZULTAT = sve se slaže. To je ono što želimo da vidimo.
-- 🔴 Svaki red koji izađe je zatečen nesklad i treba ga razumeti PRE brisanja,
--    inače se posle pomeša sa posledicama brisanja.
SELECT
  COALESCE(u.pseudonim, w.id)                     AS clan,
  w.balance                                       AS stanje,
  COALESCE(ul.s, 0) - COALESCE(iz.s, 0)           AS iz_istorije,
  w.balance - (COALESCE(ul.s, 0) - COALESCE(iz.s, 0)) AS razlika
FROM "Wallet" w
LEFT JOIN "User" u ON u.id = w."userId"
LEFT JOIN (SELECT "toWalletId"   AS id, SUM(amount) AS s FROM "Transaction" GROUP BY 1) ul ON ul.id = w.id
LEFT JOIN (SELECT "fromWalletId" AS id, SUM(amount) AS s FROM "Transaction" GROUP BY 1) iz ON iz.id = w.id
WHERE w.balance <> COALESCE(ul.s, 0) - COALESCE(iz.s, 0)
ORDER BY ABS(w.balance - (COALESCE(ul.s, 0) - COALESCE(iz.s, 0))) DESC;
