#!/usr/bin/env bash
# Vercel „Ignored Build Step“ (vercel.json → ignoreCommand).
# Izlaz 0 = build se PRESKAČE; svaki drugi izlaz = build se radi.
#
# Build se preskače samo kad se od poslednjeg uspešnog deploy-a te grane menjalo
# isključivo ono što nije deo sajta (beleške, testovi, video, istorijski akti).
# Sve ostalo — uključujući svaki nov folder koji ovde nije pobrojan — gradi se.
# Ako git ne može da uporedi (prvi deploy grane, plitak klon), git vraća grešku
# i build se radi: u nedoumici se uvek gradi.
#
# 🔴 `dokumentacija 4.1/` JESTE deo sajta (čita je src/lib/pravni-dokument.ts)
# i ne sme se dodati na ovaj spisak.

OSNOVA="${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}"

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
