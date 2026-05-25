# Razdvajanje okruženja (lokalno / test / produkcija)

Tri okruženja, jedan repo, jedan Vercel projekat. Svako ima **svoju bazu** i svoj
scope env varijabli na Vercel-u.

| Okruženje  | Git grana          | Vercel scope              | Baza (Neon)            | Migracije        |
|------------|--------------------|---------------------------|------------------------|------------------|
| Lokalno    | feature grane      | `next dev` (lokalno)      | lokalni / Neon dev br. | `migrate dev`    |
| Test       | `develop`          | Custom Environment "test" | **kolo-peach**         | automatske       |
| Produkcija | `main`             | Production                | produkcijska Neon      | **ručno**        |

Uz to su uključeni i **Preview deployments**: svaka feature grana / PR dobija
privremeni Vercel URL. Oni koriste isti (Preview) DATABASE_URL kao test, osim ako
uključiš Neon Vercel integraciju koja pravi izolovan DB branch po preview-u.

## Tok rada

```
feature grana  →  (PR / preview proba)  →  merge u develop  →  auto-deploy na TEST
                                                                     │
                                          (testiranje na kolo-peach) │
                                                                     ▼
                              npm run migrate:prod  →  merge develop → main  →  PROD deploy
```

1. Radiš lokalno na feature grani (`migrate dev` kreira nove migracije).
2. Merge u `develop` → Vercel deployuje na **test**, build **automatski** pokreće
   `prisma migrate deploy` nad kolo-peach bazom.
3. Kad je stabilno: **prvo** ručno primeniš migracije na produkciju, **pa** merguješ
   `develop → main`.

## Migracije

Build skripta (`scripts/build-migrate.mjs`) gleda `VERCEL_ENV`:

- `production` → **preskače** migracije (radiš ih ručno),
- sve ostalo (test/preview, lokalno) → pokreće `prisma migrate deploy`.

### Ručna produkcijska migracija

1. Stavi produkcijski connection string u `.env.production.local` (gitignored):
   ```
   DATABASE_URL="postgresql://...produkcija-neon..."
   ```
   (ili izvezi `PROD_DATABASE_URL` u shell).
2. Provera šta bi se primenilo (ništa ne menja):
   ```
   npm run migrate:prod:status
   ```
3. Primena:
   ```
   npm run migrate:prod
   ```
4. Tek onda merguj `develop → main`.

> Redosled je bitan: ako kod koji zavisi od nove šeme dođe na produkciju **pre**
> migracije, produkcija puca. Uvek migriraj pre prod deploy-a.

## Env varijable po okruženju

Sve su izlistane u `.env.example`. Na Vercel-u (Settings → Environment Variables)
postavi različite vrednosti po scope-u — naročito:

- `DATABASE_URL` — različita baza po okruženju (test = kolo-peach, prod = prod baza)
- `NEXTAUTH_URL` / `NEXT_PUBLIC_BASE_URL` — pun URL tog okruženja
- `NEXTAUTH_SECRET` — različit po okruženju
- Google OAuth callback URL-ovi moraju odgovarati svakom domenu

## Inicijalno podešavanje na Vercel-u (jednokratno)

1. **Git grane:** napravi `develop`; zaštiti `main` (merge samo preko PR-a).
2. **Custom Environment "test":** Vercel → Settings → Environments → veži za granu
   `develop`; dodeli mu DATABASE_URL = kolo-peach.
3. **Production scope:** DATABASE_URL = produkcijska Neon baza.
4. (Opciono) Neon Vercel integracija za izolovane DB branch-eve po preview-u.
