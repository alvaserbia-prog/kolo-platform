/* KOLO service worker — Web Push.
   Prikazuje sistemsku notifikaciju kad stigne push i otvara link na klik.
   Namerno BEZ keširanja/offline logike — služi isključivo za push. */

self.addEventListener("install", () => {
  // Aktiviraj novu verziju odmah, bez čekanja na zatvaranje kartica.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }

  const naslov = data.naslov || "KOLO";
  const opcije = {
    body: data.tekst || "",
    icon: "/kolo-icon.png",
    badge: "/kolo-icon.png",
    // Iste vrste notifikacija se grupišu (npr. više poruka istog tipa).
    tag: data.tip || "kolo",
    data: { link: data.link || "/pocetna" },
  };

  event.waitUntil(self.registration.showNotification(naslov, opcije));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = (event.notification.data && event.notification.data.link) || "/pocetna";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((klijenti) => {
        // Ako je aplikacija već otvorena u nekoj kartici — fokusiraj je i navedi na link.
        for (const klijent of klijenti) {
          if ("focus" in klijent) {
            klijent.focus();
            if ("navigate" in klijent) {
              try {
                klijent.navigate(link);
              } catch {
                /* navigate može pući na cross-origin; ignoriši */
              }
            }
            return;
          }
        }
        // Inače otvori novu karticu.
        if (self.clients.openWindow) return self.clients.openWindow(link);
      }),
  );
});
