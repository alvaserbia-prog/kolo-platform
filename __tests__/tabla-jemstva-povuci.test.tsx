// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import TablaJemstvaKlijent from "@/app/(app)/tabla-jemstva/TablaJemstvaKlijent";

vi.mock("next-intl", () => ({
  useTranslations: () => (k: string) => k,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Komponenta koristi React Query — testovi je moraju umotati u provider.
function renderSaQuery(ui: ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

const ZAHTEV = {
  id: "zahtev-1",
  pseudonim: "TestKorisnik",
  tekstPredstavljanja: "Zdravo, predstavljam se mreži radi verifikacije.",
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
  mojZahtev: true,
};

function mockFetch(zahtev = ZAHTEV) {
  const calls: { url: string; method: string }[] = [];
  global.fetch = vi.fn(async (url: any, opts: any = {}) => {
    const method = opts.method ?? "GET";
    calls.push({ url: String(url), method });
    if (method === "GET") {
      return { ok: true, json: async () => ({ mojeVerifikovan: false, zahtevi: [zahtev] }) } as any;
    }
    return { ok: true, json: async () => ({ ok: true }) } as any;
  }) as any;
  return calls;
}

beforeEach(() => { vi.clearAllMocks(); });
afterEach(() => { cleanup(); });

describe("TablaJemstvaKlijent — povlačenje zahteva", () => {
  it("klik Povuci → Da, povuci šalje DELETE na /api/tabla-jemstva/[id]", async () => {
    const calls = mockFetch();
    renderSaQuery(<TablaJemstvaKlijent verified={false} isAdmin={false} mozeVerifikovati={false} />);

    // Sačekaj da se učita lista
    await waitFor(() => expect(screen.getByText("dugme_povuci")).toBeTruthy());

    // Korak 1: klik na "Povuci" → otkriva inline potvrdu
    fireEvent.click(screen.getByText("dugme_povuci"));

    // Korak 2: klik na "Da, povuci"
    const potvrdi = await screen.findByText("dugme_potvrdi_povuci");
    fireEvent.click(potvrdi);

    await waitFor(() => {
      const del = calls.find((c) => c.method === "DELETE");
      expect(del, `DELETE nije poslat. Pozivi: ${JSON.stringify(calls)}`).toBeTruthy();
      expect(del!.url).toContain("/api/tabla-jemstva/zahtev-1");
    });
  });

  it("admin Ukloni → inline razlog → Potvrdi šalje POST bez native prompt()", async () => {
    // Ako se osloni na prompt(), na Brave/mobilnim browserima vraća null i POST se ne pošalje.
    // Inline tok ne sme da zavisi od prompt-a.
    const promptSpy = vi.spyOn(window, "prompt").mockReturnValue(null);
    const calls = mockFetch({ ...ZAHTEV, id: "zahtev-1", mojZahtev: false });
    renderSaQuery(<TablaJemstvaKlijent verified={true} isAdmin={true} mozeVerifikovati={false} />);

    await waitFor(() => expect(screen.getByText("dugme_ukloni")).toBeTruthy());
    fireEvent.click(screen.getByText("dugme_ukloni"));

    // Unesi razlog u inline polje
    const polje = await screen.findByPlaceholderText("placeholder_razlog_uklanjanja");
    fireEvent.change(polje, { target: { value: "neprikladan sadržaj" } });

    fireEvent.click(screen.getByText("dugme_potvrdi_uklanjanje"));

    await waitFor(() => {
      const post = calls.find((c) => c.method === "POST" && c.url.includes("/ukloni"));
      expect(post, `POST /ukloni nije poslat. Pozivi: ${JSON.stringify(calls)}`).toBeTruthy();
      expect(post!.url).toContain("/api/admin/tabla-jemstva/zahtev-1/ukloni");
    });
    expect(promptSpy).not.toHaveBeenCalled();
  });
});
