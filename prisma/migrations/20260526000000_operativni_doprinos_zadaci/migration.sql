-- Operativni doprinos — konsolidacija PED + Doprinos-oglasi u jedinstveni tok "Zadatak za zajedničko dobro"
-- (Pravilnik o operativnom doprinosu v3.7.0)

-- 1. Uklanjanje starih tabela (Doprinos-oglasi + PED evidencija)
ALTER TABLE "OglasEvidencija" DROP CONSTRAINT IF EXISTS "OglasEvidencija_userId_fkey";
ALTER TABLE "OglasEvidencija" DROP CONSTRAINT IF EXISTS "OglasEvidencija_oglasId_fkey";
ALTER TABLE "OglasEvidencija" DROP CONSTRAINT IF EXISTS "OglasEvidencija_prijavaId_fkey";
ALTER TABLE "OglasPrijava" DROP CONSTRAINT IF EXISTS "OglasPrijava_oglasId_fkey";
ALTER TABLE "OglasPrijava" DROP CONSTRAINT IF EXISTS "OglasPrijava_userId_fkey";
ALTER TABLE "DoprinosOglas" DROP CONSTRAINT IF EXISTS "DoprinosOglas_createdById_fkey";
ALTER TABLE "DoprinosOglas" DROP CONSTRAINT IF EXISTS "DoprinosOglas_krugId_fkey";
ALTER TABLE "DoprinosEvidencija" DROP CONSTRAINT IF EXISTS "DoprinosEvidencija_userId_fkey";
ALTER TABLE "DoprinosEvidencija" DROP CONSTRAINT IF EXISTS "DoprinosEvidencija_enrollmentId_fkey";

DROP TABLE IF EXISTS "OglasEvidencija";
DROP TABLE IF EXISTS "OglasPrijava";
DROP TABLE IF EXISTS "DoprinosOglas";
DROP TABLE IF EXISTS "DoprinosEvidencija";

-- 2. Uklanjanje starih enum tipova
DROP TYPE IF EXISTS "OglasStatus";
DROP TYPE IF EXISTS "OglasSource";
DROP TYPE IF EXISTS "OglasPrijavaStatus";
DROP TYPE IF EXISTS "EvidencijaStatus";

-- 3. Novi enum tipovi
CREATE TYPE "ZadatakStatus" AS ENUM ('OTVOREN', 'U_IZVRSENJU', 'IZVRSEN', 'NEIZVRSEN', 'POVUCEN');
CREATE TYPE "ZadatakMod" AS ENUM ('PO_SATU', 'U_CELOSTI');
CREATE TYPE "ZadatakIzvor" AS ENUM ('FONDACIJA', 'KRUG', 'PROJEKAT');
CREATE TYPE "PrijavaStatus" AS ENUM ('PODNETA', 'PRIMLJENA', 'ODBIJENA', 'ODUSTAO');
CREATE TYPE "IzvrsenjeStatus" AS ENUM ('PODNETO', 'POTVRDJENO', 'USLOVNO', 'ODBIJENO', 'EVIDENTIRANO');

-- 4. Zadatak
CREATE TABLE "Zadatak" (
    "id" TEXT NOT NULL,
    "naslov" TEXT NOT NULL,
    "opis" TEXT NOT NULL,
    "cilj" TEXT NOT NULL,
    "kriterijumi" TEXT NOT NULL,
    "izvor" "ZadatakIzvor" NOT NULL DEFAULT 'FONDACIJA',
    "mod" "ZadatakMod" NOT NULL,
    "stopaPoSatu" INTEGER,
    "maxSati" INTEGER,
    "iznosUCelosti" INTEGER,
    "gornjaGranica" INTEGER,
    "predlozeniPoen" INTEGER NOT NULL,
    "brojIzvrsilaca" INTEGER NOT NULL DEFAULT 1,
    "minIndeks" INTEGER NOT NULL DEFAULT 10,
    "saOdobravanjem" BOOLEAN NOT NULL DEFAULT false,
    "kvalFilter" TEXT,
    "rokPrijave" TIMESTAMP(3),
    "rokIzvrsenja" TIMESTAMP(3),
    "status" "ZadatakStatus" NOT NULL DEFAULT 'OTVOREN',
    "createdById" TEXT NOT NULL,
    "krugId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Zadatak_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Zadatak_status_createdAt_idx" ON "Zadatak"("status", "createdAt" DESC);
ALTER TABLE "Zadatak" ADD CONSTRAINT "Zadatak_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Zadatak" ADD CONSTRAINT "Zadatak_krugId_fkey" FOREIGN KEY ("krugId") REFERENCES "Krug"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 5. ZadatakPrijava
CREATE TABLE "ZadatakPrijava" (
    "id" TEXT NOT NULL,
    "zadatakId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planIzvrsenja" TEXT NOT NULL,
    "status" "PrijavaStatus" NOT NULL DEFAULT 'PRIMLJENA',
    "verifikatorId" TEXT,
    "primljenaAt" TIMESTAMP(3),
    "odbijenaRazlog" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ZadatakPrijava_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ZadatakPrijava_zadatakId_userId_key" ON "ZadatakPrijava"("zadatakId", "userId");
CREATE INDEX "ZadatakPrijava_status_zadatakId_idx" ON "ZadatakPrijava"("status", "zadatakId");
ALTER TABLE "ZadatakPrijava" ADD CONSTRAINT "ZadatakPrijava_zadatakId_fkey" FOREIGN KEY ("zadatakId") REFERENCES "Zadatak"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ZadatakPrijava" ADD CONSTRAINT "ZadatakPrijava_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 6. ZadatakIzvrsenje
CREATE TABLE "ZadatakIzvrsenje" (
    "id" TEXT NOT NULL,
    "prijavaId" TEXT NOT NULL,
    "zadatakId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "datum" DATE NOT NULL,
    "sati" INTEGER,
    "dokaz" TEXT NOT NULL,
    "tezina" INTEGER NOT NULL,
    "zavrsno" BOOLEAN NOT NULL DEFAULT true,
    "status" "IzvrsenjeStatus" NOT NULL DEFAULT 'PODNETO',
    "verifikatorId" TEXT,
    "potvrdjenaAt" TIMESTAMP(3),
    "obrazlozenje" TEXT,
    "evidentiraniPoen" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ZadatakIzvrsenje_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ZadatakIzvrsenje_prijavaId_datum_key" ON "ZadatakIzvrsenje"("prijavaId", "datum");
CREATE INDEX "ZadatakIzvrsenje_datum_status_idx" ON "ZadatakIzvrsenje"("datum", "status");
ALTER TABLE "ZadatakIzvrsenje" ADD CONSTRAINT "ZadatakIzvrsenje_prijavaId_fkey" FOREIGN KEY ("prijavaId") REFERENCES "ZadatakPrijava"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ZadatakIzvrsenje" ADD CONSTRAINT "ZadatakIzvrsenje_zadatakId_fkey" FOREIGN KEY ("zadatakId") REFERENCES "Zadatak"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ZadatakIzvrsenje" ADD CONSTRAINT "ZadatakIzvrsenje_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
