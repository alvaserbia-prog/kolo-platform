// Događaji Pijace — priprema za fazu 2 (obaveštenja pratiocima kategorija).
// Pri objavi oglasa emituje se događaj {listingId, category}; za sada se
// korisnicima NE šalje ništa (admin Telegram bot ostaje netaknut). U fazi 2
// će se ovde, na osnovu tabele FollowedCategory, slati obaveštenja
// korisnicima koji prate kategoriju oglasa.

export interface NoviOglasDogadjaj {
  listingId: string;
  category: string;
}

export async function emitujNoviOglas(dogadjaj: NoviOglasDogadjaj): Promise<void> {
  // Faza 2: raspodela obaveštenja pratiocima kategorije (FollowedCategory).
  console.info("[pijaca] novi oglas", dogadjaj.listingId, dogadjaj.category);
}
