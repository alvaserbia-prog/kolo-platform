-- ============================================================================
--  PREGLED: tačno šta bi se uklonilo — samo SELECT, ništa se ne menja
--
--  Pušta se PRE `ukloni-parove-potvrde.sql`, da se vidi obim poteza.
--  Uklanjanje pogađa SVE članove, ne samo onoga ko ga pokreće.
-- ============================================================================

-- Zajednička osnova za sva tri upita ispod.
-- (Nalepi ceo fajl odjednom — Neon izvršava upit po upit.)


-- ── 1. UKUPNO: koliko parova i koliko redova ───────────────────────────────
WITH povlacenja AS (
  SELECT id, "fromWalletId" AS w, amount, "createdAt",
         ROW_NUMBER() OVER (PARTITION BY "fromWalletId", amount ORDER BY "createdAt") AS rn
  FROM "Transaction" WHERE type = 'USKLADJIVANJE_POTVRDE'
),
emisije AS (
  SELECT id, "toWalletId" AS w, amount, "createdAt",
         ROW_NUMBER() OVER (PARTITION BY "toWalletId", amount ORDER BY "createdAt") AS rn
  FROM "Transaction" WHERE type IN ('EMISIJA_VERIFIKACIJA', 'EMISIJA_NADZOR')
),
parovi AS (
  SELECT p.id AS povlacenje_id, e.id AS emisija_id, p.w AS wallet_id, p.amount
  FROM povlacenja p
  LEFT JOIN emisije e ON e.w = p.w AND e.amount = p.amount AND e.rn = p.rn
)
SELECT
  COUNT(*) FILTER (WHERE emisija_id IS NOT NULL)      AS parova,
  COUNT(*) FILTER (WHERE emisija_id IS NOT NULL) * 2  AS REDOVA_KOJI_SE_UKLANJAJU,
  COUNT(DISTINCT wallet_id)                           AS pogodjenih_naloga,
  (SELECT COUNT(*) FROM "Transaction")                AS ukupno_zapisa_sada
FROM parovi;


-- ── 2. PO ČLANU: koga sve pogađa i koliko ──────────────────────────────────
-- Ovo je spisak SVIH članova kojih se potez tiče — ne samo tebe.
WITH povlacenja AS (
  SELECT id, "fromWalletId" AS w, amount, "createdAt",
         ROW_NUMBER() OVER (PARTITION BY "fromWalletId", amount ORDER BY "createdAt") AS rn
  FROM "Transaction" WHERE type = 'USKLADJIVANJE_POTVRDE'
),
emisije AS (
  SELECT id, "toWalletId" AS w, amount, "createdAt",
         ROW_NUMBER() OVER (PARTITION BY "toWalletId", amount ORDER BY "createdAt") AS rn
  FROM "Transaction" WHERE type IN ('EMISIJA_VERIFIKACIJA', 'EMISIJA_NADZOR')
),
parovi AS (
  SELECT p.id AS povlacenje_id, e.id AS emisija_id, p.w AS wallet_id, p.amount
  FROM povlacenja p
  LEFT JOIN emisije e ON e.w = p.w AND e.amount = p.amount AND e.rn = p.rn
  WHERE e.id IS NOT NULL
)
SELECT
  COALESCE(u.pseudonim, '(bez korisnika)')          AS clan,
  COUNT(*)                                          AS parova,
  COUNT(*) * 2                                      AS redova,
  SUM(pr.amount)                                    AS poena_u_parovima,
  w.balance                                         AS stanje_sada,
  CASE WHEN w.balance < 0 THEN 'MINUS' ELSE '' END  AS oznaka
FROM parovi pr
JOIN "Wallet" w    ON w.id = pr.wallet_id
LEFT JOIN "User" u ON u.id = w."userId"
GROUP BY u.pseudonim, w.balance, w.id
ORDER BY w.balance ASC;


-- ── 3. SVAKI POJEDINAČAN RED koji bi otišao ────────────────────────────────
-- Dva reda po paru: emisija (+) i njeno povlačenje (−).
WITH povlacenja AS (
  SELECT id, "fromWalletId" AS w, amount, "createdAt",
         ROW_NUMBER() OVER (PARTITION BY "fromWalletId", amount ORDER BY "createdAt") AS rn
  FROM "Transaction" WHERE type = 'USKLADJIVANJE_POTVRDE'
),
emisije AS (
  SELECT id, "toWalletId" AS w, amount, "createdAt",
         ROW_NUMBER() OVER (PARTITION BY "toWalletId", amount ORDER BY "createdAt") AS rn
  FROM "Transaction" WHERE type IN ('EMISIJA_VERIFIKACIJA', 'EMISIJA_NADZOR')
),
parovi AS (
  SELECT p.id AS povlacenje_id, e.id AS emisija_id, p.w AS wallet_id
  FROM povlacenja p
  LEFT JOIN emisije e ON e.w = p.w AND e.amount = p.amount AND e.rn = p.rn
  WHERE e.id IS NOT NULL
),
zaUklanjanje AS (
  SELECT emisija_id    AS tx_id, wallet_id FROM parovi
  UNION ALL
  SELECT povlacenje_id AS tx_id, wallet_id FROM parovi
)
SELECT
  COALESCE(u.pseudonim, '(bez korisnika)') AS clan,
  t."createdAt"                            AS kada,
  t.type::text                             AS tip,
  CASE WHEN t.type = 'USKLADJIVANJE_POTVRDE' THEN '−' ELSE '+' END AS smer,
  t.amount                                 AS poen
FROM zaUklanjanje z
JOIN "Transaction" t ON t.id = z.tx_id
JOIN "Wallet" w      ON w.id = z.wallet_id
LEFT JOIN "User" u   ON u.id = w."userId"
ORDER BY u.pseudonim, t."createdAt";
