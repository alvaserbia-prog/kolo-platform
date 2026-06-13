/**
 * Pronalazi Vercel Blob token bez obzira na ime env varijable.
 *
 * Podrazumevano (jedan store) Vercel postavlja `BLOB_READ_WRITE_TOKEN`.
 * Sa VIŠE Blob store-ova povezanih na isti projekat, token dobija prefiks
 * specifičan za store, npr. `MOJSTORE_READ_WRITE_TOKEN`. Sufiks
 * `READ_WRITE_TOKEN` je specifičan za Blob, pa je bezbedno pretražiti po njemu.
 */
export function blobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  const kljuc = Object.keys(process.env).find((k) => k.endsWith("READ_WRITE_TOKEN"));
  return kljuc ? process.env[kljuc] : undefined;
}
