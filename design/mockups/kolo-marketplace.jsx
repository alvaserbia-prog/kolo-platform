import { useState } from "react";

const C = {
  green900: "#14532d", green700: "#15803d", green600: "#16a34a",
  green500: "#22c55e", green100: "#dcfce7", green50: "#f0fdf4",
  amber500: "#f59e0b", amber400: "#fbbf24", amber100: "#fef3c7", amber50: "#fffbeb",
  red500: "#ef4444", red50: "#fef2f2",
  gray900: "#111827", gray700: "#374151", gray500: "#6b7280",
  gray400: "#9ca3af", gray300: "#d1d5db", gray200: "#e5e7eb",
  gray100: "#f3f4f6", gray50: "#f9fafb", white: "#ffffff",
};

const categories = ["Hrana", "Usluge", "Zanati", "Elektronika", "Odeca", "Ostalo"];

const mockAds = [
  { id: 1, title: "Domaci med - lipa", desc: "Prirodni med od lipe, pakovanje 1kg.", price: 500, category: "Hrana", seller: "MilanPetrovic", img: "🍯" },
  { id: 2, title: "Casovi engleskog jezika", desc: "Privatni casovi za sve uzraste.", price: 300, category: "Usluge", seller: "JelenaM", img: "📚" },
  { id: 3, title: "Popravka bicikala", desc: "Servis i popravka svih tipova bicikala.", price: 200, category: "Zanati", seller: "MarkoSombor", img: "🔧" },
  { id: 4, title: "Domaca ajvar - blagi", desc: "Rucno pravljen ajvar od pecenih paprika.", price: 350, category: "Hrana", seller: "AnaVojvodina", img: "🫙" },
  { id: 5, title: "Stari laptop Dell", desc: "Dell Latitude, i5, 8GB RAM, SSD 256GB.", price: 2000, category: "Elektronika", seller: "NenadZrenjanin", img: "💻" },
  { id: 6, title: "Pletene carape od vune", desc: "Rucno pletene vunene carape.", price: 150, category: "Odeca", seller: "MajaSuBotica", img: "🧦" },
];

function AdCard({ ad, isVerified, onPay }) {
  return (
    <div style={{ background: C.white, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 12 }}>
      <div style={{ height: 140, background: `linear-gradient(135deg, ${C.gray100}, ${C.gray50})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, position: "relative" }}>
        {ad.img}
        <span style={{ position: "absolute", top: 10, left: 10, padding: "4px 10px", borderRadius: 6, fontSize: 11, fontFamily: "sans-serif", background: "rgba(255,255,255,0.9)", color: C.gray700 }}>
          {ad.category}
        </span>
      </div>
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, color: C.gray900, margin: 0 }}>{ad.title}</h3>
            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: C.gray400, margin: "4px 0 0" }}>{ad.desc}</p>
          </div>
          <div style={{ padding: "6px 12px", background: C.green50, borderRadius: 10 }}>
            <span style={{ fontFamily: "sans-serif", fontSize: 16, fontWeight: 700, color: C.green700 }}>{ad.price.toLocaleString()}</span>
            <span style={{ fontFamily: "sans-serif", fontSize: 10, color: C.green600, display: "block", textAlign: "center" }}>POEN</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.gray100}` }}>
          <span style={{ fontFamily: "sans-serif", fontSize: 12, color: isVerified ? C.green700 : C.gray400 }}>
            {isVerified ? ad.seller : "clan KOLO zajednice"}
          </span>
          <button onClick={() => onPay(ad)} style={{ padding: "8px 16px", borderRadius: 8, cursor: "pointer", background: `linear-gradient(135deg, ${C.green600}, ${C.green700})`, color: C.white, border: "none", fontFamily: "sans-serif", fontSize: 12, fontWeight: 600 }}>
            Plati
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateAdScreen({ onBack, onPublish }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const canPublish = title.length >= 3 && price && category;
  return (
    <div style={{ minHeight: "100vh", background: C.gray50 }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, background: C.white, borderBottom: `1px solid ${C.gray100}` }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer" }}>←</button>
        <h2 style={{ fontFamily: "sans-serif", fontSize: 18, color: C.gray900, margin: 0 }}>Novi oglas</h2>
      </div>
      <div style={{ padding: 16 }}>
        <input type="text" placeholder="Naslov *" value={title} onChange={e => setTitle(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${C.gray200}`, marginBottom: 12, fontFamily: "sans-serif", fontSize: 15, outline: "none" }} />
        <textarea placeholder="Opis" value={desc} onChange={e => setDesc(e.target.value)} rows={3} style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${C.gray200}`, marginBottom: 12, fontFamily: "sans-serif", fontSize: 14, resize: "vertical", outline: "none" }} />
        <input type="number" placeholder="Cena (POEN) *" value={price} onChange={e => setPrice(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${C.gray200}`, marginBottom: 12, fontFamily: "sans-serif", fontSize: 18, fontWeight: 600, outline: "none" }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{ padding: "8px 16px", borderRadius: 10, cursor: "pointer", background: category === cat ? C.green700 : C.white, color: category === cat ? C.white : C.gray700, border: `1.5px solid ${category === cat ? C.green700 : C.gray200}`, fontFamily: "sans-serif", fontSize: 13 }}>
              {cat}
            </button>
          ))}
        </div>
        <button onClick={() => canPublish && onPublish()} disabled={!canPublish} style={{ width: "100%", padding: 16, background: canPublish ? `linear-gradient(135deg, ${C.green600}, ${C.green700})` : C.gray200, color: canPublish ? C.white : C.gray400, border: "none", borderRadius: 14, cursor: canPublish ? "pointer" : "default", fontFamily: "sans-serif", fontSize: 16, fontWeight: 600 }}>
          Objavi oglas
        </button>
      </div>
    </div>
  );
}

export default function KoloMarketplace() {
  const [screen, setScreen] = useState("list");
  const [isVerified, setIsVerified] = useState(true);
  const [filterCat, setFilterCat] = useState("Sve");
  const [search, setSearch] = useState("");
  const [payAd, setPayAd] = useState(null);

  const filteredAds = mockAds.filter(ad => {
    const matchCat = filterCat === "Sve" || ad.category === filterCat;
    const matchSearch = !search || ad.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (screen === "create") {
    return (
      <CreateAdScreen
        onBack={() => setScreen("list")}
        onPublish={() => setScreen("list")}
      />
    );
  }

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: C.gray50 }}>
      {payAd && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: C.white, borderRadius: "20px 20px 0 0", padding: "24px 20px 32px", width: "100%", maxWidth: 430 }}>
            <h3 style={{ fontFamily: "sans-serif", fontSize: 18, color: C.gray900, margin: "0 0 16px" }}>Plati za oglas</h3>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: C.gray700, margin: "0 0 16px" }}>{payAd.title} — {payAd.price.toLocaleString()} POEN</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setPayAd(null)} style={{ flex: 1, padding: 14, background: C.gray100, color: C.gray700, border: "none", borderRadius: 12, cursor: "pointer", fontFamily: "sans-serif", fontSize: 15 }}>Otkazi</button>
              <button onClick={() => setPayAd(null)} style={{ flex: 1, padding: 14, background: `linear-gradient(135deg, ${C.green600}, ${C.green700})`, color: C.white, border: "none", borderRadius: 12, cursor: "pointer", fontFamily: "sans-serif", fontSize: 15, fontWeight: 600 }}>Nastavi na placanje</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "16px 20px", background: C.white, borderBottom: `1px solid ${C.gray100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "sans-serif", fontSize: 20, color: C.gray900, margin: 0, fontWeight: 700 }}>Oglasi</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setIsVerified(!isVerified)} style={{ padding: "4px 8px", borderRadius: 6, fontSize: 10, cursor: "pointer", fontFamily: "sans-serif", background: isVerified ? C.green100 : C.gray100, color: isVerified ? C.green700 : C.gray400, border: "none" }}>
            {isVerified ? "Ver." : "Nev."}
          </button>
          {isVerified && (
            <button onClick={() => setScreen("create")} style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.green600}, ${C.green700})`, border: "none", cursor: "pointer", color: C.white, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          )}
        </div>
      </div>

      <div style={{ padding: "12px 16px 0" }}>
        <input type="text" placeholder="Pretrazi oglase..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "11px 12px", border: `1.5px solid ${C.gray200}`, borderRadius: 10, outline: "none", fontSize: 14, fontFamily: "sans-serif", marginBottom: 10 }} />
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12 }}>
          {["Sve", ...categories].map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)} style={{ padding: "6px 14px", borderRadius: 8, whiteSpace: "nowrap", background: filterCat === cat ? C.green700 : C.white, color: filterCat === cat ? C.white : C.gray500, border: `1px solid ${filterCat === cat ? C.green700 : C.gray200}`, fontFamily: "sans-serif", fontSize: 12, cursor: "pointer" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "4px 16px 24px" }}>
        {filteredAds.length === 0 ? (
          <div style={{ padding: "40px 16px", textAlign: "center", background: C.white, borderRadius: 14 }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: C.gray400 }}>Nema oglasa u ovoj kategoriji</p>
          </div>
        ) : (
          filteredAds.map(ad => <AdCard key={ad.id} ad={ad} isVerified={isVerified} onPay={setPayAd} />)
        )}
      </div>
    </div>
  );
}
