import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PRIVREMENI endpoint — manuelno kreira PasswordResetToken tabelu i belezi migraciju.
// Admin-only.
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Pristup odbijen — samo admin." }, { status: 403 });
  }

  const koraci: { korak: string; ok: boolean; info?: unknown }[] = [];

  try {
    // 1. Kreiraj tabelu (ako ne postoji)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "tokenHash" TEXT NOT NULL,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "usedAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
      );
    `);
    koraci.push({ korak: "1. CREATE TABLE PasswordResetToken", ok: true });

    // 2. Kreiraj indekse
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");
    `);
    koraci.push({ korak: "2. CREATE UNIQUE INDEX tokenHash", ok: true });

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");
    `);
    koraci.push({ korak: "3. CREATE INDEX userId", ok: true });

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");
    `);
    koraci.push({ korak: "4. CREATE INDEX expiresAt", ok: true });

    // 3. Foreign key (može da pukne ako već postoji — ignoriši)
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "PasswordResetToken"
        ADD CONSTRAINT "PasswordResetToken_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      `);
      koraci.push({ korak: "5. ADD FOREIGN KEY userId", ok: true });
    } catch (err) {
      koraci.push({
        korak: "5. ADD FOREIGN KEY userId",
        ok: false,
        info: "Možda već postoji: " + (err instanceof Error ? err.message : String(err)),
      });
    }

    // 4. Belezi migraciju u _prisma_migrations da `prisma migrate deploy` u buducnosti ne pokusava ponovo
    try {
      await prisma.$executeRawUnsafe(`
        INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
        VALUES (
          gen_random_uuid()::text,
          'manual_application',
          NOW(),
          '20260504120000_add_password_reset',
          NULL,
          NULL,
          NOW(),
          1
        )
        ON CONFLICT DO NOTHING;
      `);
      koraci.push({ korak: "6. Zabelezi migraciju u _prisma_migrations", ok: true });
    } catch (err) {
      koraci.push({
        korak: "6. Zabelezi migraciju u _prisma_migrations",
        ok: false,
        info: err instanceof Error ? err.message : String(err),
      });
    }

    return NextResponse.json({ koraci, ishod: "✅ Tabela kreirana — sad probaj reset" });
  } catch (err) {
    return NextResponse.json({
      koraci,
      ishod: "❌ Greška",
      greska: err instanceof Error ? err.message : String(err),
    });
  }
}

// GET varijanta da bi se mogao klikati direktno iz browser-a
export async function GET() {
  return POST();
}
