-- R-05 / M-13: nov razlog prijave oglasa — traženje plaćanja u novcu ili drugom
-- sredstvu van sistema (Uslovi korišćenja čl. 21, set 4.6.1).
--
-- 🔴 ZASEBAN FAJL: Postgres ne dopušta upotrebu nove enum vrednosti u istoj
-- transakciji u kojoj je dodata. Ista konvencija kao kod
-- `20260913120000_donacija_naplaceno` i `20260911140000_ispravka_nabavka_enum`.
ALTER TYPE "PrijavaRazlog" ADD VALUE 'PLACANJE_VAN_SISTEMA';
