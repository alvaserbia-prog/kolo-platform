-- ============================================================================
--  PROVERA POSLE UKLANJANJA PAROVA — samo SELECT, ništa se ne menja
--  Pušta se u Neon SQL Editoru odmah posle `ukloni-parove-potvrde.sql`.
-- ============================================================================

-- ── 1. Da li je uklanjanje zaista prošlo ───────────────────────────────────
-- `povlacenja_ostalo` treba da bude 0 — sva su uklonjena zajedno sa emisijama.
-- `zero_sum` treba da bude 0 i `opticaj` isti kao pre.
SELECT
  (SELECT COUNT(*) FROM "Transaction" WHERE type = 'USKLADJIVANJE_POTVRDE') AS povlacenja_ostalo,
  (SELECT COUNT(*) FROM "Transaction")                                      AS ukupno_zapisa,
  (SELECT SUM(balance) FROM "Wallet")                                       AS zero_sum_mora_biti_0,
  (SELECT ABS(balance) FROM "Wallet" WHERE id = 'banka-singleton')          AS opticaj;


-- ── 2. Slaže li se svako stanje sa svojom istorijom ────────────────────────
-- 🟢 PRAZAN REZULTAT = sve je u redu. To je ono što želimo da vidimo.
-- 🔴 Bilo koji red znači nesklad — javi ga odmah.
SELECT
  COALESCE(u.pseudonim, w.id)                         AS clan,
  w.balance                                           AS stanje,
  COALESCE(ul.s, 0) - COALESCE(iz.s, 0)               AS iz_istorije,
  w.balance - (COALESCE(ul.s, 0) - COALESCE(iz.s, 0)) AS razlika
FROM "Wallet" w
LEFT JOIN "User" u ON u.id = w."userId"
LEFT JOIN (SELECT "toWalletId"   AS id, SUM(amount) AS s FROM "Transaction" GROUP BY 1) ul ON ul.id = w.id
LEFT JOIN (SELECT "fromWalletId" AS id, SUM(amount) AS s FROM "Transaction" GROUP BY 1) iz ON iz.id = w.id
WHERE w.balance <> COALESCE(ul.s, 0) - COALESCE(iz.s, 0);


-- ── 3. Revizijski trag ─────────────────────────────────────────────────────
-- Treba da izađe tačno jedan red, sa brojem uklonjenih zapisa.
SELECT a."createdAt", u.pseudonim AS sproveo, a.akcija, a.detalji
FROM "AuditLog" a
JOIN "User" u ON u.id = a."adminId"
WHERE a.akcija = 'POTVRDE_PAROVI_UKLONJENI'
ORDER BY a."createdAt" DESC;
