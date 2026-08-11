// Zaseban modul (bez "use client") da bi server stranica mogla da uveze niz
// kao pravu vrednost — uvoz iz client fajla u produkcijskom SSR build-u daje
// client-reference proxy, pa ADMIN_TABOVI.includes puca.
// „nadzor" = automat (RizikNalaz, noćni radnik). „odluke" = ljudska prijava —
// nadzorni predmeti koje su otvorili nadzornici (dokaz stvarnosti 4.2.0, čl. 11a).
// Dva različita posla, namerno dva taba.
// „prvi-oglasi" = odobravanje doprinosa iz čl. 40a za naloge bez potvrde. Nije
// moderacija (to je „pijaca"): oglas ostaje, odlučuje se samo o 1.000 POEN.
export const ADMIN_TABOVI = ["dashboard", "programi", "ped", "pokrovitelji", "donacije", "prigovori", "korisnici", "pijaca", "prvi-oglasi", "emisija", "osnivaci", "vesti", "obavestenja", "audit", "aktivnost", "levak", "nadzor", "odluke"] as const;
export type Tab = (typeof ADMIN_TABOVI)[number];
