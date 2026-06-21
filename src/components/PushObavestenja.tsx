"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

// VAPID javni ključ je base64url string; Push API traži Uint8Array.
function base64UrlUToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const izlaz = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) izlaz[i] = raw.charCodeAt(i);
  return izlaz;
}

type Stanje = "ucitavanje" | "nepodrzano" | "blokirano" | "ukljuceno" | "iskljuceno" | "radim";

/**
 * Dugme za uključivanje Web Push obaveštenja na ovom uređaju.
 * Registruje service worker, traži dozvolu i čuva/uklanja pretplatu na serveru.
 * Ako VAPID ključ nije konfigurisan (NEXT_PUBLIC_VAPID_PUBLIC_KEY), ne renderuje ništa.
 */
export default function PushObavestenja() {
  const t = useTranslations("push");
  const [stanje, setStanje] = useState<Stanje>("ucitavanje");

  useEffect(() => {
    let otkazano = false;

    async function inicijalizuj() {
      if (!VAPID_PUBLIC_KEY) return; // feature off — komponenta se sakriva niže
      if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
        if (!otkazano) setStanje("nepodrzano");
        return;
      }
      if (Notification.permission === "denied") {
        if (!otkazano) setStanje("blokirano");
        return;
      }
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        const sub = await reg.pushManager.getSubscription();
        if (!otkazano) setStanje(sub ? "ukljuceno" : "iskljuceno");
      } catch {
        if (!otkazano) setStanje("nepodrzano");
      }
    }

    inicijalizuj();
    return () => {
      otkazano = true;
    };
  }, []);

  async function ukljuci() {
    if (!VAPID_PUBLIC_KEY) return;
    setStanje("radim");
    try {
      const dozvola = await Notification.requestPermission();
      if (dozvola !== "granted") {
        setStanje(dozvola === "denied" ? "blokirano" : "iskljuceno");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64UrlUToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });
      const res = await fetch("/api/push/pretplata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON(), userAgent: navigator.userAgent }),
      });
      if (!res.ok) throw new Error("save failed");
      setStanje("ukljuceno");
    } catch {
      setStanje("iskljuceno");
    }
  }

  async function iskljuci() {
    setStanje("radim");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/pretplata", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        }).catch(() => {});
        await sub.unsubscribe().catch(() => {});
      }
      setStanje("iskljuceno");
    } catch {
      setStanje("ukljuceno");
    }
  }

  // Feature off ili učitavanje → ništa.
  if (!VAPID_PUBLIC_KEY || stanje === "ucitavanje") return null;

  if (stanje === "nepodrzano") {
    return <p className="text-[11px] text-kolo-muted leading-snug">{t("nepodrzano")}</p>;
  }
  if (stanje === "blokirano") {
    return <p className="text-[11px] text-kolo-muted leading-snug">{t("blokirano")}</p>;
  }

  const ukljuceno = stanje === "ukljuceno";
  return (
    <button
      onClick={ukljuceno ? iskljuci : ukljuci}
      disabled={stanje === "radim"}
      className="w-full flex items-center justify-between gap-2 text-xs text-kolo-text hover:text-kolo-green-700 disabled:opacity-50 transition-colors"
    >
      <span className="flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {t("na_telefonu")}
      </span>
      <span className={`font-semibold ${ukljuceno ? "text-kolo-green-700" : "text-kolo-muted"}`}>
        {stanje === "radim" ? "…" : ukljuceno ? t("ukljuceno") : t("ukljuci")}
      </span>
    </button>
  );
}
