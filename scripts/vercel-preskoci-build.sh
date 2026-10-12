#!/usr/bin/env bash
# Vercel „Ignored Build Step“ (vercel.json → ignoreCommand).
# Izlaz 0 = build se PRESKAČE; svaki drugi izlaz = build se radi.
#
# Build se preskače samo kad se od poslednjeg uspešnog deploy-a te grane menjalo
# isključivo ono što nije deo sajta (beleške, testovi, video, istorijski akti).
# Sve ostalo — uključujući svaki nov folder koji ovde nije pobrojan — gradi se.
# Vercel klonira plitko (poslednjih ~10 commit-a), pa poslednji uspešan deploy
# ume da bude van klona. Tada se build radi, bez dovlačenja istorije (repo nosi
# video, dovlačenje bi trošilo minute buildova); taj build postaje nova osnova.
# 🔴 Izlaz mora biti tačno 0 ili 1: svaki drugi kod (git-ov 128 za
# „bad object") Vercel tumači kao grešku koraka i deploy pada sa ERROR — tako
# je 07–08.10.2026 svaki deploy `main`-a pao. U nedoumici se uvek gradi.
#
# 🔴 `dokumentacija 4.1/` JESTE deo sajta (čita je src/lib/pravni-dokument.ts)
# i ne sme se dodati na ovaj spisak.

OSNOVA="${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}"

if ! git cat-file -e "$OSNOVA^{commit}" 2>/dev/null; then
  echo "Osnova $OSNOVA nije dostupna — build se radi."
  exit 1
fi

git diff --quiet "$OSNOVA" HEAD -- . \
  ':(exclude)docs' \
  ':(exclude)video' \
  ':(exclude)design' \
  ':(exclude)__tests__' \
  ':(exclude)e2e' \
  ':(exclude)scripts' \
  ':(exclude).claude' \
  ':(exclude).github' \
  ':(exclude)dokumentacija 3.8' \
  ':(exclude)dokumentacija 3.9' \
  ':(exclude)dokumentacija 4.0' \
  ':(exclude)nova dokumentacija' \
  ':(exclude)CLAUDE.md' \
  ':(exclude)AGENTS.md' \
  ':(exclude)README.md' \
  ':(exclude)CONTRIBUTING.md' \
  ':(exclude)popravke.md' \
  ':(exclude)LICENSE' \
  ':(exclude)LICENSE-CONTENT' \
  ':(exclude)DCO' \
  ':(exclude)vitest.config.ts' \
  ':(exclude)playwright.config.ts' \
  ':(exclude)Snimak ekrana 2026-06-03 201247.png'

if [ $? -eq 0 ]; then
  echo "Menjano je samo ono van sajta — build se preskače."
  exit 0
fi
echo "Menjan je sajt — build se radi."
exit 1
