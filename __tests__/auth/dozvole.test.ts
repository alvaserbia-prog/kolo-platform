import { describe, it, expect } from "vitest";
import { jeAdmin, jeSuperadmin, mozeNadzor, jeKorenJemstva } from "@/lib/dozvole";

// Refaktor uloga: admin osa (kolona `admin`) je nezavisna od članskog tipa.
// jeAdmin/jeSuperadmin čitaju `admin`; mozeNadzor/jeKorenJemstva (privremeno)
// i `tipKorisnika` dok osnivači nose POCETNI (do koraka 7).

describe("dozvole — admin osa (kolona admin)", () => {
  it("jeSuperadmin samo za SUPERADMIN", () => {
    expect(jeSuperadmin({ admin: "SUPERADMIN" })).toBe(true);
    expect(jeSuperadmin({ admin: "ADMIN" })).toBe(false);
    expect(jeSuperadmin({ admin: "NONE" })).toBe(false);
    expect(jeSuperadmin({ admin: null })).toBe(false);
    expect(jeSuperadmin(null)).toBe(false);
  });

  it("jeAdmin za ADMIN i SUPERADMIN", () => {
    expect(jeAdmin({ admin: "ADMIN" })).toBe(true);
    expect(jeAdmin({ admin: "SUPERADMIN" })).toBe(true);
    expect(jeAdmin({ admin: "NONE" })).toBe(false);
    expect(jeAdmin(undefined)).toBe(false);
  });

  it("članski tip ne daje admin ovlašćenja", () => {
    // Nosilac ZRNA bez admin role nije admin.
    expect(jeAdmin({ tipKorisnika: "NOSILAC_ZRNA", admin: "NONE" })).toBe(false);
    expect(jeSuperadmin({ tipKorisnika: "NOSILAC_ZRNA", admin: "NONE" })).toBe(false);
  });
});

describe("dozvole — nadzor (distribuirano)", () => {
  it("nosioci ZRNA mogu nadzor, regularni ne", () => {
    expect(mozeNadzor({ tipKorisnika: "NOSILAC_ZRNA", admin: "NONE" })).toBe(true);
    expect(mozeNadzor({ tipKorisnika: "REGULARNI", admin: "NONE" })).toBe(false);
    expect(mozeNadzor({ tipKorisnika: "NEVERIFIKOVAN", admin: "NONE" })).toBe(false);
  });

  it("admin/superadmin takođe može nadzor", () => {
    expect(mozeNadzor({ tipKorisnika: "REGULARNI", admin: "ADMIN" })).toBe(true);
    expect(mozeNadzor({ tipKorisnika: "REGULARNI", admin: "SUPERADMIN" })).toBe(true);
  });
});

describe("dozvole — koren jemstva", () => {
  it("koren je isključivo superadmin", () => {
    expect(jeKorenJemstva({ admin: "SUPERADMIN" })).toBe(true);
    expect(jeKorenJemstva({ admin: "ADMIN" })).toBe(false);
    expect(jeKorenJemstva({ tipKorisnika: "NOSILAC_ZRNA", admin: "NONE" })).toBe(false);
  });
});
