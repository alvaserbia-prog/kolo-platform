import { permanentRedirect } from "next/navigation";

// Stranica „uskoro" je objedinjena sa stranicom ranog pristupa: jedan ulaz na
// kome se odmah unosi pristupni kod. Rutu zadržavamo kao trajni (308) redirect
// da stari linkovi/QR/indeksirani URL ne pucaju.
export default function UskoroPage() {
  permanentRedirect("/rani-pristup");
}
