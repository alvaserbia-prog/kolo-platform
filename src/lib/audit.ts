import { prisma } from "@/lib/prisma";

export async function logAdminAkcija(adminId: string, akcija: string, targetId?: string, detalji?: string) {
  try {
    await prisma.auditLog.create({ data: { adminId, akcija, targetId, detalji } });
  } catch (err) {
    console.error("[AuditLog] Greška pri logovanju:", err);
  }
}
