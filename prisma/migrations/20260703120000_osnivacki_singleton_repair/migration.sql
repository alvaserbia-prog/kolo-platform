-- Repair: garantuje da OsnivackiKanal "singleton" red postoji.
--
-- Na nekim bazama (uočeno na produkciji) ovaj red je nedostajao iako je tabela
-- postojala. Posledica: dohvatiStatusKanala() je bacao gresku ("nije
-- inicijalizovan") -> GET /api/javno/osnivacki-doprinos je vracao 500 -> admin
-- kartica Osnivaci je prikazivala PRAZNU listu (iako osnivaci postoje) i padala
-- pri pokusaju upisa. Inicijalni INSERT iz migracije 20260524160000 ovde se
-- ponavlja idempotentno (ON CONFLICT DO NOTHING), pa je bezbedan i na bazama
-- gde red vec postoji.
INSERT INTO "OsnivackiKanal" (id, "updatedAt")
VALUES ('singleton', NOW())
ON CONFLICT (id) DO NOTHING;
