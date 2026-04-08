import { useState } from "react";

const COLORS = {
  green900: "#14532d", green700: "#15803d", green600: "#16a34a",
  green500: "#22c55e", green100: "#dcfce7", green50: "#f0fdf4",
  amber500: "#f59e0b", amber400: "#fbbf24", amber100: "#fef3c7", amber50: "#fffbeb",
  red500: "#ef4444", red50: "#fef2f2",
  gray900: "#111827", gray700: "#374151", gray500: "#6b7280",
  gray400: "#9ca3af", gray300: "#d1d5db", gray200: "#e5e7eb",
  gray100: "#f3f4f6", gray50: "#f9fafb", white: "#ffffff",
};

const mockTransactions = [
  { id: 1, type: "received", from: "Banka", to: "Vi", amount: 1000, desc: "Bonus za verifikaciju", date: "31. mar 2026", time: "14:15" },
  { id: 2, type: "sent", from: "Vi", to: "MilanPetrovic", amount: 250, desc: "Domaci med", date: "31. mar 2026", time: "16:30" },
  { id: 3, type: "received", from: "JelenaM", to: "Vi", amount: 500, desc: "casovi engleskog", date: "30. mar 2026", time: "10:00" },
  { id: 4, type: "sent", from: "Vi", to: "MarkoS", amount: 100, desc: "", date: "29. mar 2026", time: "09:45" },
];

export default function KoloDashboard() {
  const [isVerified, setIsVerified] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [showQR, setShowQR] = useState(false);

  const pseudonym = "ZelenoDrvo42";
  const balance = isVerified ? 1250 : 0;
  const transactions = isVerified ? mockTransactions : [];

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: COLORS.gray50 }}>
      {/* See full implementation in conversation history */}
      <p style={{ padding: 20, fontFamily: "sans-serif", color: COLORS.gray500 }}>
        KoloDashboard mockup — see full source in conversation
      </p>
    </div>
  );
}
