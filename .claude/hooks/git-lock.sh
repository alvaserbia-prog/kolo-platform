#!/usr/bin/env bash
# git-lock.sh acquire|release
#
# Serijalizuje git WRITE komande (push/commit/merge/rebase/reset/checkout/
# switch/cherry-pick/pull/worktree/stash) između više istovremenih Claude Code
# sesija nad istim repo-om. PreToolUse poziva "acquire", PostToolUse "release".
#
# Načela:
#  - FAIL-OPEN: na bilo koju grešku ili istek čekanja, pusti komandu (nikad
#    trajni deadlock). Bolje povremeni dupli push nego zaglavljena sesija.
#  - Bez jq: čita stdin (hook JSON) i grepuje sirov tekst.
#  - Atomični lock = `mkdir` (atomičan na istom FS-u).
#  - Ustajao lock (stariji od STALE s) se preuzima — pokriva pad sesije.

set -u

MODE="${1:-}"
LOCKDIR="/tmp/kolo-git-lock.d"
STALE=120     # s — lock stariji od ovoga se smatra napuštenim
MAXWAIT=120   # s — koliko najviše čekati zauzet lock pre nego što ipak prođe
POLL=5        # s — interval provere

input="$(cat 2>/dev/null)"

# Reaguj SAMO na git write komande; sve ostalo prolazi trenutno.
printf '%s' "$input" | grep -Eq 'git[^"|;&\\]*(push|commit|merge|rebase|reset|checkout|switch|cherry-pick|pull|worktree|stash)' || exit 0

ts_now() { date +%s 2>/dev/null || echo 0; }
is_num() { case "$1" in (''|*[!0-9]*) return 1;; (*) return 0;; esac; }

if [ "$MODE" = "release" ]; then
  rm -rf "$LOCKDIR" 2>/dev/null
  exit 0
fi

# acquire
start="$(ts_now)"
while : ; do
  if mkdir "$LOCKDIR" 2>/dev/null; then
    ts_now > "$LOCKDIR/ts" 2>/dev/null
    exit 0
  fi
  # Lock je zauzet — proveri da nije ustajao.
  ts="$(cat "$LOCKDIR/ts" 2>/dev/null || echo 0)"
  is_num "$ts" || ts=0
  nowv="$(ts_now)"; is_num "$nowv" || nowv=0
  age=$(( nowv - ts ))
  if [ "$age" -ge "$STALE" ]; then rm -rf "$LOCKDIR" 2>/dev/null; continue; fi
  waited=$(( nowv - start ))
  if [ "$waited" -ge "$MAXWAIT" ]; then rm -rf "$LOCKDIR" 2>/dev/null; continue; fi
  sleep "$POLL"
done
