"use client";

/**
 * Graf verifikacija — SVG prikaz cele mreže jemstva.
 *
 * - Čvor je javno samo BROJ (donatorski broj); klik otvara panel sa pseudonimom,
 *   indeksom, kapacitetom i vezama (ko ga je verifikovao / koga je verifikovao).
 * - Raspored je deterministički radijalan (rasporediGraf): prva primljena
 *   verifikacija je radijalna grana, ostale veze su tetive preko kruga.
 * - Boje nose stanje IZ UGLA posmatrača: zlatno = ja, plavo = mogu da
 *   verifikujem (isprekidano = nemam slobodan slot), sivo = zabranjena zona,
 *   tamnosivo = niko ga ne može verifikovati (osnivač / indeks 100% / čl. 22).
 * - Namerno NEMA pretrage, liste "dostupnih" ni pokretanja verifikacije iz
 *   grafa — graf je pregled i alat nadzora, verifikacija ostaje na /verifikacija.
 * - Zoom/pan mišem, točkićem i pinch gestom; do nekoliko stotina čvorova SVG
 *   je dovoljan (bez canvas/WebGL).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { rasporediGraf, type Koordinata } from "@/lib/protokol/graf";
import { formatIndeksZaPrikaz } from "@/lib/protokol/dokaz-stvarnosti";
import MiniStablo from "@/components/verifikacija/MiniStablo";

type CvorStanje = "JA" | "MOGU" | "ZONA" | "PUN";

type Cvor = {
  id: string;
  broj: number;
  pseudonim: string;
  tip: "NEVERIFIKOVAN" | "REGULARNI" | "NOSILAC_ZRNA";
  jeOsnivac: boolean;
  indeks: number;
  kapacitet: number | null; // null = neograničeno (nosilac ZRNA)
  slotoviPotroseni: number;
  stanje: CvorStanje;
  razlog: string | null;
};

type Ivica = {
  od: string;
  ka: string;
  datum: string;
  stablo: boolean;
  nadzor: "ne-podleze" | "nadzirano" | "ceka-nadzor";
};

type GrafPodaci = {
  ja: string;
  opticaj: number;
  posmatrac: { imaSlot: boolean; slobodnihSlotova: number | null };
  cvorovi: Cvor[];
  ivice: Ivica[];
};

// Paleta iz globals.css (SVG atributi ne čitaju Tailwind klase pouzdano).
const BOJE = {
  ja: { fill: "#F5B842", stroke: "#D99520" },
  mogu: { fill: "#2B6CB0", stroke: "#22568C" },
  bezSlota: { fill: "#EBF4FF", stroke: "#2B6CB0" },
  zona: { fill: "#F1F0EC", stroke: "#C9C6BF" },
  pun: { fill: "#DDDAD3", stroke: "#6B6860" },
  indeksLuk: "#2E9D54",
  ivicaStablo: "#D7D4CD",
  ivicaTetiva: "#C9C6BF",
  istaknuto: "#D99520",
  tekst: "#6B6860",
} as const;

const VB = { x: -500, y: -350, w: 1000, h: 700 };
const MIN_ZUM = 0.05;
const MAX_ZUM = 4;

type Transform = { k: number; tx: number; ty: number };

function stilCvora(stanje: CvorStanje, imaSlot: boolean) {
  if (stanje === "JA") return { ...BOJE.ja, dash: undefined };
  if (stanje === "MOGU")
    return imaSlot
      ? { ...BOJE.mogu, dash: undefined }
      : { ...BOJE.bezSlota, dash: "4 3" };
  if (stanje === "ZONA") return { ...BOJE.zona, dash: undefined };
  return { ...BOJE.pun, dash: undefined };
}

/** Klijentske koordinate → koordinate viewBox prostora (pre <g> transforma). */
function uViewBox(svg: SVGSVGElement, clientX: number, clientY: number) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const p = pt.matrixTransform(ctm.inverse());
  return { x: p.x, y: p.y };
}

export default function GrafKlijent() {
  const t = useTranslations("graf");

  const [podaci, setPodaci] = useState<GrafPodaci | null>(null);
  const [greska, setGreska] = useState<string | null>(null);
  const [izabran, setIzabran] = useState<string | null>(null);
  const [transform, setTransform] = useState<Transform>({ k: 1, tx: 0, ty: 0 });

  const svgRef = useRef<SVGSVGElement | null>(null);
  const pokazivaci = useRef(new Map<number, { x: number; y: number }>());
  const vukao = useRef(false);
  const pocetak = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let aktivan = true;
    fetch("/api/graf")
      .then(async (r) => {
        if (!r.ok) {
          const telo = await r.json().catch(() => null);
          throw new Error(telo?.error ?? t("greska"));
        }
        return r.json();
      })
      .then((d: GrafPodaci) => {
        if (aktivan) setPodaci(d);
      })
      .catch((e: Error) => {
        if (aktivan) setGreska(e.message);
      });
    return () => {
      aktivan = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const koordinate = useMemo<Map<string, Koordinata>>(() => {
    if (!podaci) return new Map();
    return rasporediGraf(
      podaci.cvorovi.map((c) => ({ id: c.id, broj: c.broj, jeOsnivac: c.jeOsnivac })),
      podaci.ivice.map((iv) => ({
        verifikatorId: iv.od,
        verifikovaniId: iv.ka,
        vremenskiZig: new Date(iv.datum),
      }))
    );
  }, [podaci]);

  // Početni prikaz: uklopi ceo graf u viewBox.
  useEffect(() => {
    if (koordinate.size === 0) return;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const k of koordinate.values()) {
      minX = Math.min(minX, k.x); maxX = Math.max(maxX, k.x);
      minY = Math.min(minY, k.y); maxY = Math.max(maxY, k.y);
    }
    const margina = 90;
    const w = maxX - minX + margina * 2;
    const h = maxY - minY + margina * 2;
    const k = Math.min(MAX_ZUM, Math.max(MIN_ZUM, Math.min(VB.w / w, VB.h / h)));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    setTransform({ k, tx: -cx * k, ty: -cy * k });
  }, [koordinate]);

  const zumiraj = useCallback((vx: number, vy: number, faktor: number) => {
    setTransform((tr) => {
      const k = Math.min(MAX_ZUM, Math.max(MIN_ZUM, tr.k * faktor));
      if (k === tr.k) return tr;
      // Tačka sveta pod kursorom ostaje pod kursorom.
      const wx = (vx - tr.tx) / tr.k;
      const wy = (vy - tr.ty) / tr.k;
      return { k, tx: vx - wx * k, ty: vy - wy * k };
    });
  }, []);

  const naTockic = useCallback(
    (e: React.WheelEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const p = uViewBox(svg, e.clientX, e.clientY);
      zumiraj(p.x, p.y, Math.pow(1.0015, -e.deltaY));
    },
    [zumiraj]
  );

  const naPritisak = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pokazivaci.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pokazivaci.current.size === 1) {
      vukao.current = false;
      pocetak.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const naPomeraj = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      const staro = pokazivaci.current.get(e.pointerId);
      if (!svg || !staro) return;
      const novo = { x: e.clientX, y: e.clientY };

      if (pokazivaci.current.size === 1) {
        if (
          Math.hypot(novo.x - pocetak.current.x, novo.y - pocetak.current.y) > 6
        ) {
          vukao.current = true;
        }
        const a = uViewBox(svg, staro.x, staro.y);
        const b = uViewBox(svg, novo.x, novo.y);
        setTransform((tr) => ({ ...tr, tx: tr.tx + b.x - a.x, ty: tr.ty + b.y - a.y }));
      } else if (pokazivaci.current.size === 2) {
        vukao.current = true;
        const [prvi, drugi] = [...pokazivaci.current.entries()];
        const drugiPok = prvi[0] === e.pointerId ? drugi[1] : prvi[1];
        const staraDist = Math.hypot(staro.x - drugiPok.x, staro.y - drugiPok.y);
        const novaDist = Math.hypot(novo.x - drugiPok.x, novo.y - drugiPok.y);
        if (staraDist > 0) {
          const sredina = uViewBox(
            svg,
            (novo.x + drugiPok.x) / 2,
            (novo.y + drugiPok.y) / 2
          );
          zumiraj(sredina.x, sredina.y, novaDist / staraDist);
        }
      }
      pokazivaci.current.set(e.pointerId, novo);
    },
    [zumiraj]
  );

  const naOtpust = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    pokazivaci.current.delete(e.pointerId);
  }, []);

  const nadjiMe = useCallback(() => {
    if (!podaci) return;
    const moja = koordinate.get(podaci.ja);
    if (!moja) return;
    setTransform({ k: 1, tx: -moja.x, ty: -moja.y });
    setIzabran(podaci.ja);
  }, [podaci, koordinate]);

  const cvorMapa = useMemo(
    () => new Map((podaci?.cvorovi ?? []).map((c) => [c.id, c])),
    [podaci]
  );

  const izabraniCvor = izabran ? cvorMapa.get(izabran) ?? null : null;

  // Scena (ivice + čvorovi) — memoizovana da pan/zoom menja samo transform <g>.
  const scena = useMemo(() => {
    if (!podaci) return null;
    const imaSlot = podaci.posmatrac.imaSlot;

    const ivice = podaci.ivice.map((iv, i) => {
      const a = koordinate.get(iv.od);
      const b = koordinate.get(iv.ka);
      if (!a || !b) return null;
      const dodirujeIzabran = izabran !== null && (iv.od === izabran || iv.ka === izabran);
      const boja = dodirujeIzabran
        ? BOJE.istaknuto
        : iv.stablo
          ? BOJE.ivicaStablo
          : BOJE.ivicaTetiva;
      if (iv.stablo) {
        return (
          <line
            key={i}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={boja}
            strokeWidth={dodirujeIzabran ? 2.5 : 1.5}
          />
        );
      }
      // Tetiva: kontrolna tačka povučena ka centru — veze preko kruga se vide
      // kao bočno umrežavanje, veze unutar sektora kao zatvoreni krug.
      const kx = ((a.x + b.x) / 2) * 0.35;
      const ky = ((a.y + b.y) / 2) * 0.35;
      return (
        <path
          key={i}
          d={`M ${a.x} ${a.y} Q ${kx} ${ky} ${b.x} ${b.y}`}
          fill="none"
          stroke={boja}
          strokeWidth={dodirujeIzabran ? 2.5 : 1}
          strokeDasharray="6 5"
          opacity={dodirujeIzabran ? 1 : 0.55}
        />
      );
    });

    const cvorovi = podaci.cvorovi.map((c) => {
      const k = koordinate.get(c.id);
      if (!k) return null;
      const stil = stilCvora(c.stanje, imaSlot);
      const jeIzabran = izabran === c.id;
      return (
        <g
          key={c.id}
          transform={`translate(${k.x} ${k.y})`}
          onClick={(e) => {
            e.stopPropagation();
            if (!vukao.current) setIzabran(c.id);
          }}
          style={{ cursor: "pointer" }}
        >
          {jeIzabran && (
            <circle r={26} fill="none" stroke={BOJE.istaknuto} strokeWidth={3} />
          )}
          {/* Prsten indeksa: 0–100% oko čvora, počinje na vrhu */}
          {c.indeks > 0 && (
            <circle
              r={21}
              fill="none"
              stroke={BOJE.indeksLuk}
              strokeWidth={3}
              pathLength={100}
              strokeDasharray={`${c.indeks} ${100 - c.indeks}`}
              transform="rotate(-90)"
              strokeLinecap="round"
              opacity={0.9}
            />
          )}
          {c.jeOsnivac ? (
            <rect
              x={-14} y={-14} width={28} height={28} rx={7}
              fill={stil.fill} stroke={stil.stroke} strokeWidth={2}
              strokeDasharray={stil.dash}
            />
          ) : (
            <>
              <circle
                r={16}
                fill={stil.fill} stroke={stil.stroke} strokeWidth={2}
                strokeDasharray={stil.dash}
              />
              {c.tip === "NOSILAC_ZRNA" && (
                <circle r={11} fill="none" stroke={stil.stroke} strokeWidth={1.5} />
              )}
            </>
          )}
          <text
            y={34}
            textAnchor="middle"
            fontSize={11}
            fontWeight={jeIzabran ? 700 : 500}
            fill={BOJE.tekst}
          >
            {c.broj}
          </text>
        </g>
      );
    });

    return (
      <>
        <g>{ivice}</g>
        <g>{cvorovi}</g>
      </>
    );
  }, [podaci, koordinate, izabran]);

  if (greska) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-6 text-center text-sm text-kolo-muted">
        {greska}
      </div>
    );
  }
  if (!podaci) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-6 text-center text-sm text-kolo-muted animate-pulse">
        {t("ucitavanje")}
      </div>
    );
  }

  const verifikatoriIzabranog = izabran
    ? podaci.ivice.filter((iv) => iv.ka === izabran)
    : [];
  const verifikovaoIzabrani = izabran
    ? podaci.ivice.filter((iv) => iv.od === izabran)
    : [];

  const legenda: Array<{ kljuc: string; stil: { fill: string; stroke: string; dash?: string } }> = [
    { kljuc: "legenda_ja", stil: BOJE.ja },
    { kljuc: "legenda_mogu", stil: BOJE.mogu },
    { kljuc: "legenda_bez_slota", stil: { ...BOJE.bezSlota, dash: "3 2" } },
    { kljuc: "legenda_zona", stil: BOJE.zona },
    { kljuc: "legenda_pun", stil: BOJE.pun },
  ];

  return (
    <div className="space-y-3">
      {/* Legenda + statistika + "nađi me" */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-kolo-muted">
        {legenda.map((l) => (
          <span key={l.kljuc} className="inline-flex items-center gap-1.5">
            <svg width={14} height={14} viewBox="-8 -8 16 16">
              <circle
                r={6}
                fill={l.stil.fill}
                stroke={l.stil.stroke}
                strokeWidth={1.5}
                strokeDasharray={l.stil.dash}
              />
            </svg>
            {t(l.kljuc)}
          </span>
        ))}
        <span className="ml-auto hidden sm:inline">
          {t("statistika", {
            clanovi: podaci.cvorovi.length,
            veze: podaci.ivice.length,
          })}
        </span>
        <button
          type="button"
          onClick={nadjiMe}
          className="px-3 py-1.5 rounded-lg border border-kolo-border bg-white text-kolo-text font-medium hover:border-kolo-green-700 transition-colors"
        >
          {t("nadji_me")}
        </button>
      </div>

      {!podaci.posmatrac.imaSlot && (
        <div className="rounded-xl bg-kolo-gold-100 border border-kolo-gold-400/40 px-4 py-2.5 text-xs text-kolo-text">
          {t("bez_slota_upozorenje")}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-4 items-start">
        {/* Graf */}
        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
          <svg
            ref={svgRef}
            viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-[55vh] min-h-[380px] select-none"
            style={{ touchAction: "none" }}
            onWheel={naTockic}
            onPointerDown={naPritisak}
            onPointerMove={naPomeraj}
            onPointerUp={naOtpust}
            onPointerCancel={naOtpust}
            onClick={() => {
              if (!vukao.current) setIzabran(null);
            }}
          >
            <g transform={`translate(${transform.tx} ${transform.ty}) scale(${transform.k})`}>
              {scena}
            </g>
          </svg>
        </div>

        {/* Panel izabranog čvora */}
        <div className="bg-white rounded-2xl border border-kolo-border p-4 lg:sticky lg:top-4">
          {!izabraniCvor ? (
            <p className="text-sm text-kolo-muted">{t("panel_uputstvo")}</p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-kolo-muted">#{izabraniCvor.broj}</p>
                  <p className="font-semibold text-kolo-text break-all">
                    {izabraniCvor.pseudonim}
                  </p>
                  <p className="text-xs text-kolo-muted mt-0.5">
                    {izabraniCvor.jeOsnivac
                      ? t("tip_osnivac")
                      : izabraniCvor.tip === "NOSILAC_ZRNA"
                        ? t("tip_nosilac")
                        : izabraniCvor.tip === "REGULARNI"
                          ? t("tip_regularni")
                          : t("tip_neverifikovan")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIzabran(null)}
                  className="text-kolo-muted hover:text-kolo-text text-lg leading-none px-1"
                  aria-label={t("zatvori")}
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-kolo-bg border border-kolo-border px-2.5 py-2">
                  <p className="text-kolo-muted">{t("panel_indeks")}</p>
                  <p className="font-semibold text-kolo-text">{izabraniCvor.indeks}%</p>
                </div>
                <div className="rounded-lg bg-kolo-bg border border-kolo-border px-2.5 py-2">
                  <p className="text-kolo-muted">{t("panel_slotovi")}</p>
                  <p className="font-semibold text-kolo-text">
                    {izabraniCvor.kapacitet === null
                      ? "∞"
                      : `${izabraniCvor.slotoviPotroseni}/${izabraniCvor.kapacitet}`}
                  </p>
                </div>
              </div>

              {izabraniCvor.stanje !== "JA" && (
                <div className="rounded-lg bg-kolo-bg border border-kolo-border px-2.5 py-2 text-xs">
                  <p className="text-kolo-muted">{t("panel_stanje")}</p>
                  <p className="font-semibold text-kolo-text">
                    {izabraniCvor.stanje === "MOGU"
                      ? podaci.posmatrac.imaSlot
                        ? t("stanje_mogu")
                        : t("stanje_bez_slota")
                      : izabraniCvor.stanje === "ZONA"
                        ? t("stanje_zona")
                        : t("stanje_pun")}
                  </p>
                  {izabraniCvor.razlog && (
                    <p className="text-kolo-muted mt-1">
                      {t(`razlog_${izabraniCvor.razlog}`)}
                    </p>
                  )}
                </div>
              )}

              {/* Lanac verifikacija izabranog člana — ista kartica kao na
                  /verifikacija; klik na osobu bira taj čvor u grafu. */}
              <MiniStablo
                className="!p-4 shadow-none"
                naslov={t("lanac_naslov")}
                ja={{
                  pseudonim: izabraniCvor.pseudonim,
                  prikaz: formatIndeksZaPrikaz(
                    izabraniCvor.tip,
                    izabraniCvor.indeks,
                    izabraniCvor.slotoviPotroseni
                  ),
                }}
                jeJaPocetni={izabraniCvor.jeOsnivac}
                verifikatori={verifikatoriIzabranog.map((iv) => ({
                  id: iv.od,
                  pseudonim: cvorMapa.get(iv.od)?.pseudonim ?? `#${cvorMapa.get(iv.od)?.broj ?? "?"}`,
                }))}
                verifikovani={verifikovaoIzabrani.map((iv) => ({
                  id: iv.ka,
                  pseudonim: cvorMapa.get(iv.ka)?.pseudonim ?? `#${cvorMapa.get(iv.ka)?.broj ?? "?"}`,
                  statusNadzora: iv.nadzor,
                }))}
                onKlik={(id) => setIzabran(id)}
                tekstovi={{
                  bezVerifikatora: t("lanac_bez_verifikatora"),
                  osnivac: t("lanac_osnivac"),
                  bezVerifikovanih: t("lanac_bez_verifikovanih"),
                }}
              />

              <Link
                href={`/profil/${izabraniCvor.id}`}
                className="block text-center text-xs font-semibold text-kolo-green-700 hover:text-kolo-green-900 border border-kolo-border rounded-xl px-3 py-2 transition-colors"
              >
                {t("profil_link")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
