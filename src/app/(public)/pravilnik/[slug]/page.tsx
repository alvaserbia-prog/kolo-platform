import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const PRAVILNICI: Record<string, { naziv: string; fajl: string; opis: string }> = {
  "kolo-sistem": {
    naziv: "Pravilnik o KOLO sistemu",
    fajl: "Pravilnik_3_7_5.md",
    opis: "Osnovni akt sistema — 12 glava, 82 člana.",
  },
  "hijerarhija": {
    naziv: "Pravilnik o hijerarhiji akata",
    fajl: "hijerarhija_3_7_2.md",
    opis: "Odnosi između opštih akata Fondacije i platformskih akata.",
  },
  "dokaz-stvarnosti": {
    naziv: "Pravilnik o dokazu stvarnosti",
    fajl: "dokaz_stvarnosti_3_7_3.md",
    opis: "Operativna mehanika verifikacije korisnika kroz lanac jemstva.",
  },
  "pokroviteljstvo-donacije": {
    naziv: "Pravilnik o pokroviteljstvu i donacijama",
    fajl: "donacije_3_7_3.md",
    opis: "Nivoi donacija i pokroviteljstva.",
  },
  "operativni": {
    naziv: "Pravilnik o operativnom doprinosu",
    fajl: "operativni_3_7_2.md",
    opis: "Operativni program i međusobno potvrđivanje doprinosa.",
  },
  "osnivacki": {
    naziv: "Pravilnik o osnivačkom doprinosu",
    fajl: "osnivacki_3_7_2.md",
    opis: "Naknadno evidentiranje rada pre otvaranja platforme.",
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = PRAVILNICI[slug];
  if (!p) return { title: "Pravilnik nije pronađen — KOLO" };
  return {
    title: `${p.naziv} — KOLO`,
    description: `${p.naziv}, verzija 3.7.0. ${p.opis}`,
  };
}

export async function generateStaticParams() {
  return Object.keys(PRAVILNICI).map((slug) => ({ slug }));
}

export default async function PravilnikSlugPage({ params }: Props) {
  const { slug } = await params;
  const p = PRAVILNICI[slug];
  if (!p) notFound();

  const filePath = path.join(process.cwd(), "nova dokumentacija", p.fajl);
  const sadrzaj = await fs.readFile(filePath, "utf-8");

  return (
    <div className="max-w-[800px] mx-auto pb-16">

      <div className="mb-8">
        <p className="text-xs text-kolo-muted mb-1">
          <Link href="/pravilnik" className="hover:text-kolo-green-700 transition-colors">Pravilnici</Link>
          {" / "}
          <span>{p.naziv}</span>
        </p>
        <h1 className="text-2xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
          {p.naziv}
        </h1>
        <p className="text-sm text-kolo-muted mt-2">Verzija 3.7.0</p>
      </div>

      <article
        className="
          text-sm text-kolo-text leading-relaxed text-body
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-kolo-green-900 [&_h1]:mb-6 [&_h1]:mt-8
          [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-kolo-green-900 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:pt-4 [&_h2]:border-t [&_h2]:border-kolo-border
          [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-kolo-green-900 [&_h3]:mb-3 [&_h3]:mt-6
          [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-kolo-text [&_h4]:mb-2 [&_h4]:mt-4
          [&_p]:mb-3
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_ol]:space-y-1
          [&_li]:leading-relaxed
          [&_strong]:font-semibold [&_strong]:text-kolo-text
          [&_em]:italic
          [&_a]:text-kolo-green-700 [&_a]:underline
          [&_hr]:my-6 [&_hr]:border-kolo-border
          [&_blockquote]:border-l-4 [&_blockquote]:border-kolo-green-700 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-kolo-muted [&_blockquote]:my-4
          [&_code]:bg-kolo-bg [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono
          [&_table]:w-full [&_table]:my-4 [&_table]:text-sm
          [&_th]:text-left [&_th]:font-semibold [&_th]:p-2 [&_th]:border-b [&_th]:border-kolo-border [&_th]:bg-kolo-bg
          [&_td]:p-2 [&_td]:border-b [&_td]:border-kolo-border [&_td]:align-top
        "
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{sadrzaj}</ReactMarkdown>
      </article>

      <div className="mt-10 pt-6 border-t border-kolo-border flex flex-wrap gap-4 text-sm text-kolo-muted">
        <Link href="/pravilnik" className="text-kolo-green-700 hover:underline">
          ← Svi pravilnici
        </Link>
        <Link href="/" className="hover:text-kolo-green-700 transition-colors">
          Nazad na početnu
        </Link>
      </div>
    </div>
  );
}
