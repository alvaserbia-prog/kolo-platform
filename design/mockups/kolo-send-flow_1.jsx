import { useState, useRef, useEffect } from "react";

const C = {
  green900: "#14532d", green700: "#15803d", green600: "#16a34a",
  green500: "#22c55e", green100: "#dcfce7", green50: "#f0fdf4",
  amber500: "#f59e0b", amber100: "#fef3c7", amber50: "#fffbeb",
  red500: "#ef4444", red50: "#fef2f2",
  gray900: "#111827", gray700: "#374151", gray500: "#6b7280",
  gray400: "#9ca3af", gray300: "#d1d5db", gray200: "#e5e7eb",
  gray100: "#f3f4f6", gray50: "#f9fafb", white: "#ffffff",
};

const members = [
  { id: 1, pseudo: "MilanPetrovic", rank: 3 },
  { id: 2, pseudo: "JelenaM", rank: 5 },
  { id: 3, pseudo: "MarkoSombor", rank: 2 },
  { id: 4, pseudo: "AnaVojvodina", rank: 1 },
  { id: 5, pseudo: "NenadZrenjanin", rank: 4 },
  { id: 6, pseudo: "MajaSuBotica", rank: 2 },
];

const recentRecipients = [
  { id: 1, pseudo: "MilanPetrovic" },
  { id: 2, pseudo: "JelenaM" },
  { id: 3, pseudo: "MarkoSombor" },
];

const myBalance = 1250;

// Flow: entry -> (scan | amount) -> confirm -> result
// Screens: EntryScreen, QRScanScreen, AmountScreen, ConfirmScreen, ResultScreen

export default function KoloSendFlow() {
  const [screen, setScreen] = useState("entry");
  const [recipient, setRecipient] = useState(null);
  const [amount, setAmount] = useState(0);
  const [desc, setDesc] = useState("");
  const balance = myBalance;

  const reset = () => {
    setScreen("entry");
    setRecipient(null);
    setAmount(0);
    setDesc("");
  };

  return (
    <div style={{ maxWidth: 430, margin: "0 auto" }}>
      <p style={{ padding: 20, fontFamily: "sans-serif", color: C.gray500 }}>
        KoloSendFlow mockup — 4 ekrana: pretraga primaoca, QR skeniranje, unos iznosa, potvrda, rezultat.
        Stanje: {screen} | Primalac: {recipient?.pseudo || "—"} | Iznos: {amount}
      </p>
    </div>
  );
}
