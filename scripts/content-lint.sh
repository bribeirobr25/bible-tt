#!/bin/bash
# Phase-0 hardened content lint.
#
# Usage:
#   bash scripts/content-lint.sh             # blocking mode (CI default)
#   bash scripts/content-lint.sh --warn-only  # never exits non-zero
#
# Allow-list:
#   scripts/lint-allowlist.txt — lines RULE_ID|FILE|EXACT_MATCH
#   Used to suppress legitimate cases that match a rule's pattern.
#
# Phase 0 content-lint rules are defined inline in this script.

WARN_ONLY=false
for arg in "$@"; do
  case "$arg" in
    --warn-only) WARN_ONLY=true ;;
  esac
done

CONTENT_DIRS="content/en/genesis content/pt-br/genesis content/de/genesis content/es/genesis content/en/john content/pt-br/john content/de/john content/es/john content/en/matthew content/pt-br/matthew content/de/matthew content/es/matthew"
STUDY_DIRS="content/en/genesis/study content/pt-br/genesis/study content/de/genesis/study content/es/genesis/study content/en/john/study content/pt-br/john/study content/de/john/study content/es/john/study content/en/matthew/study content/pt-br/matthew/study content/de/matthew/study content/es/matthew/study"
PEOPLE_FILES="content/en/genesis/PEOPLE.md content/pt-br/genesis/PEOPLE.md content/de/genesis/PEOPLE.md content/es/genesis/PEOPLE.md content/en/matthew/PEOPLE.md content/pt-br/matthew/PEOPLE.md content/de/matthew/PEOPLE.md content/es/matthew/PEOPLE.md content/en/john/PEOPLE.md content/pt-br/john/PEOPLE.md content/de/john/PEOPLE.md content/es/john/PEOPLE.md"
NON_EN_PEOPLE_FILES="content/pt-br/genesis/PEOPLE.md content/de/genesis/PEOPLE.md content/es/genesis/PEOPLE.md content/pt-br/matthew/PEOPLE.md content/de/matthew/PEOPLE.md content/es/matthew/PEOPLE.md content/pt-br/john/PEOPLE.md content/de/john/PEOPLE.md content/es/john/PEOPLE.md"
# Phase 9 — CONTEXT.md per book per locale (book-level cross-chapter motifs).
CONTEXT_FILES="content/en/genesis/CONTEXT.md content/pt-br/genesis/CONTEXT.md content/de/genesis/CONTEXT.md content/es/genesis/CONTEXT.md content/en/john/CONTEXT.md content/pt-br/john/CONTEXT.md content/de/john/CONTEXT.md content/es/john/CONTEXT.md content/en/matthew/CONTEXT.md content/pt-br/matthew/CONTEXT.md content/de/matthew/CONTEXT.md content/es/matthew/CONTEXT.md"
ES_NT_DIRS="content/es/john content/es/matthew"
ES_NT_CHAPTER_FILES="content/es/john/CHAPTER-1.md content/es/john/CHAPTER-2.md content/es/john/CHAPTER-3.md content/es/matthew/CHAPTER-1.md content/es/matthew/CHAPTER-2.md content/es/matthew/CHAPTER-3.md"
PTBR_JOHN_FILES="content/pt-br/john/CHAPTER-1.md content/pt-br/john/CHAPTER-2.md content/pt-br/john/CHAPTER-3.md content/pt-br/john/study/CHAPTER-1-CONTEXT.md content/pt-br/john/study/CHAPTER-2-CONTEXT.md content/pt-br/john/study/CHAPTER-3-CONTEXT.md"
EDITORIAL_LOGS="docs/editorial-log/genesis.md docs/editorial-log/john.md docs/editorial-log/matthew.md"

ALLOWLIST_FILE="scripts/lint-allowlist.txt"

ERRORS=0
WARNINGS=0

# filter_allowlist <rule_id>
# Reads grep output (file:line:text) on stdin, drops lines whose <file>|<text>
# tuple appears in the allow-list under the given rule.
filter_allowlist() {
  local rule_id="$1"
  if [ ! -f "$ALLOWLIST_FILE" ]; then
    cat
    return 0
  fi
  awk -v rule="$rule_id" -v alf="$ALLOWLIST_FILE" '
    BEGIN {
      while ((getline line < alf) > 0) {
        if (line ~ ("^" rule "\\|")) {
          sub("^" rule "\\|", "", line)
          allow[line] = 1
        }
      }
      close(alf)
    }
    {
      i = index($0, ":")
      file = substr($0, 1, i-1)
      rest = substr($0, i+1)
      j = index(rest, ":")
      text = substr(rest, j+1)
      key = file "|" text
      if (!(key in allow)) print $0
    }
  '
}

# emit <rule_id> <label> <matches>
# Prints the rule output and increments the appropriate counter.
emit() {
  local rule_id="$1"
  local label="$2"
  local matches="$3"
  if [ -z "$matches" ]; then return 0; fi
  if [ "$WARN_ONLY" = true ]; then
    echo "[WARN $rule_id] $label" >&2
    echo "$matches" >&2
    WARNINGS=$((WARNINGS + 1))
  else
    echo "[$rule_id] $label"
    echo "$matches"
    ERRORS=$((ERRORS + 1))
  fi
}

# emit_warn <rule_id> <label> <matches>
# Always warn-only, regardless of --warn-only flag.
emit_warn() {
  local rule_id="$1"
  local label="$2"
  local matches="$3"
  if [ -z "$matches" ]; then return 0; fi
  echo "[WARN $rule_id] $label" >&2
  echo "$matches" >&2
  WARNINGS=$((WARNINGS + 1))
}

check_pattern() {
  local rule_id="$1"
  local label="$2"
  local pattern="$3"
  local files="$4"
  local matches
  matches=$(grep -rEn "$pattern" $files 2>/dev/null | filter_allowlist "$rule_id")
  emit "$rule_id" "$label" "$matches"
}

check_pattern_warn() {
  local rule_id="$1"
  local label="$2"
  local pattern="$3"
  local files="$4"
  local matches
  matches=$(grep -rEn "$pattern" $files 2>/dev/null | filter_allowlist "$rule_id")
  emit_warn "$rule_id" "$label" "$matches"
}

# check_heading_collision <rule_id> <files>
# Flags `## Translit (Familiar)` lines where translit == familiar.
# Uses perl rather than `grep -P \1` because BSD grep on macOS lacks PCRE.
check_heading_collision() {
  local rule_id="$1"
  local files="$2"
  local matches
  matches=$(perl -ne '
    if (eof) { close ARGV; }
    # Match ## Translit (Familiar) [optional trailing text].
    # Catches both `## Henoch (Henoch)` and `## Lamech (Lamech) — kainitische Linie`.
    if (/^## (\S+) \((\S+)\)/ && $1 eq $2) {
      chomp;
      print "$ARGV:$.:$_\n";
    }
  ' $files 2>/dev/null | filter_allowlist "$rule_id")
  emit "$rule_id" "PEOPLE.md heading: transliteration equals familiar form" "$matches"
}

echo "=== Content Lint ==="
[ "$WARN_ONLY" = true ] && echo "(warn-only mode — no exit on errors)"
echo ""

# ============================================================
# Phase 0 content-lint rules (defined inline below)
# ============================================================

# §0.1 — Stale ruleset version stamps (rules at v3.3 since 2026-05-08)
check_pattern "0.1" "Stale ruleset version stamp (rules at v3.3)" \
  "Ruleset v3\.0|Ruleset v3\.1|Ruleset v3\.2|Conjunto de Regras v3\.0|Conjunto de Regras v3\.1|Conjunto de Regras v3\.2|Reglas v3\.0|Reglas v3\.1|Reglas v3\.2|Regelwerk v3\.0|Regelwerk v3\.1|Regelwerk v3\.2|Ruleset version in force:\*\* v3\.0|Ruleset version in force:\*\* v3\.1|Ruleset version in force:\*\* v3\.2|\*\*Ruleset:\*\* v3\.0|\*\*Ruleset:\*\* v3\.1|\*\*Ruleset:\*\* v3\.2|\*\*Regelwerk:\*\* v3\.0|\*\*Regelwerk:\*\* v3\.1|\*\*Regelwerk:\*\* v3\.2|\*\*Conjunto de Regras:\*\* v3\.0|\*\*Conjunto de Regras:\*\* v3\.1|\*\*Conjunto de Regras:\*\* v3\.2|\*\*Reglas:\*\* v3\.0|\*\*Reglas:\*\* v3\.1|\*\*Reglas:\*\* v3\.2|\*\*Regras:\*\* v3\.0|\*\*Regras:\*\* v3\.1|\*\*Regras:\*\* v3\.2|\*\*Conjunto de reglas:\*\* v3\.0|\*\*Conjunto de reglas:\*\* v3\.1|\*\*Conjunto de reglas:\*\* v3\.2" \
  "$CONTENT_DIRS $STUDY_DIRS $PEOPLE_FILES $EDITORIAL_LOGS"

# §0.2 — Raw em-dash residue
check_pattern "0.2" "Raw em-dash residue ' -- ' (use em-dash —)" \
  " -- " \
  "$CONTENT_DIRS $STUDY_DIRS $PEOPLE_FILES"

# §0.3 — ES NT diacritic loss
check_pattern "0.3" "ES NT diacritic loss in front matter or body" \
  "\bTraduccion\b|\bEdicion\b|\bEspanol\b|\bPolitica\b|\bSenor\b" \
  "$ES_NT_DIRS"

# §0.4 — ES NT missing Reina-Valera declaration
es_nt_missing_rv=""
for f in $ES_NT_CHAPTER_FILES; do
  if [ -f "$f" ] && ! head -25 "$f" | grep -q "Reina-Valera"; then
    es_nt_missing_rv="${es_nt_missing_rv}${f}: missing Reina-Valera declaration in front matter
"
  fi
done
emit "0.4" "ES NT chapter file lacks Reina-Valera Option-B declaration" "$es_nt_missing_rv"

# §0.5 — PT-BR unigênito (until Phase 4 lands)
check_pattern "0.5" "PT-BR 'unigênito' — pending Phase 4 alignment with EN/DE/ES" \
  "unigênito|unigenito" \
  "$PTBR_JOHN_FILES"

# §0.6 — John PEOPLE.md presence per locale — ACTIVATED 2026-05-14 (Phase 10 closure).
# Fails if any locale's content/<loc>/john/ directory exists without a PEOPLE.md file.
for loc in en pt-br de es; do
  if [ -d "content/$loc/john" ] && [ ! -f "content/$loc/john/PEOPLE.md" ]; then
    echo "FAIL §0.6 — John PEOPLE.md must exist in every locale: missing content/$loc/john/PEOPLE.md"
    ERRORS=$((ERRORS + 1))
  fi
done

# §0.7a — PEOPLE.md "TT" leftover heading
check_pattern "0.7" "PEOPLE.md leftover 'Transparent Translation' H2 (Phase 1A removes it)" \
  "^## The Transparent Translation" \
  "$PEOPLE_FILES"

# §0.7b — PEOPLE.md leftover dead H1
check_pattern "0.7" "PEOPLE.md leftover dead H1 (Phase 1A removes it)" \
  "^# .*(People|Pessoas|Personen|Personas)" \
  "$PEOPLE_FILES"

# §0.8 — PEOPLE.md heading transliteration=familiar collision (with allow-list)
check_heading_collision "0.8" "$NON_EN_PEOPLE_FILES"

# §0.9 — covered by §0.2

# §0.10 — Modern-mapping smell-test (PEOPLE.md + CONTEXT.md, warn-only by default)
# Phase 9 closure (audit §4.1 / PV.1): extended to also cover CONTEXT.md, since
# Book Context motifs can include entries about neighboring peoples (Genesis
# Table-of-Nations motif, John Yehudim references, etc.) that should be subject
# to the same anti-ethnogenesis safeguard.
check_pattern_warn "0.10" "Modern-mapping smell-test in PEOPLE.md + CONTEXT.md (anti-ethnogenesis review)" \
  "\b(Russia|Europe|Africa|Asia|Slavic|Aryan|Caucasian|Hamitic|Japhetic peoples|Semitic peoples)\b" \
  "$PEOPLE_FILES $CONTEXT_FILES"

# §0.11 — DE chapter redundant-parens regression check (warn-only)
# Added 2026-05-18 alongside the DE familiar-names sweep (FEEDBACK item 35).
# Catches Name (Name) identical-word patterns that violate the RULES-HB.md
# §PROPER-NAME TABLE note as clarified in the v3.3.1 emergency amendment.
# Scope is /content/de/ chapter files only — not study/, not GLOSSAR or
# KAPITELÜBERGREIFENDE tables (those have different semantics; see plan).
# Warn-only: etymological asides in notes may legitimately repeat names.
check_pattern_warn "0.11" "DE chapter redundant-parens regression — see genesis.md Entry 2026-05-18-107 + RULES-HB.md v3.3.1 amendment" \
  "([A-ZÄÖÜ][a-zäöüß']+) \(\1\)" \
  "content/de/genesis/CHAPTER-*.md content/de/john/CHAPTER-*.md content/de/matthew/CHAPTER-*.md"

# §0.12 — Cross-book PEOPLE.md pointer validity (warn-only)
# Added 2026-05-18 alongside Phase 13 cross-book PEOPLE formalization (v3.3.2 amendment).
# Validates every `**See:** <slug>/PEOPLE.md` (and locale aliases Ver/Siehe)
# against the published allow-list of valid target slugs (RULES-CORE.md Rule 29
# §People and Genealogy Files v3.3.2 amendment). Catches typos like
# `**See:** geneis/PEOPLE.md` that would otherwise pass silently via the
# CrossBookSeeField graceful-dangling-pointer UI fallback.
# Warn-only: legitimate new forward references should not break the build.
# To add a new allowed slug, update both this allow-list AND the proper-name
# entries per the 5-change new-book activation checklist in RULES-CORE.md.
check_cross_book_pointers() {
  local rule_id="0.12"
  local matches
  matches=$(perl -ne '
    if (eof) { close ARGV; }
    # Match: **See:** slug/PEOPLE.md  (or Ver: / Siehe:)
    if (/^\*\*(?:See|Ver|Siehe):\*\*\s+([a-z][a-z-]*)\/PEOPLE\.md/i) {
      my $slug = lc($1);
      my %allowed = (
        genesis => 1, matthew => 1, john => 1,
        acts => 1, exodus => 1, kings => 1, isaiah => 1,
      );
      unless ($allowed{$slug}) {
        chomp;
        print "$ARGV:$.:$_  [slug not in allow-list: $slug]\n";
      }
    }
  ' content/*/genesis/PEOPLE.md content/*/john/PEOPLE.md content/*/matthew/PEOPLE.md 2>/dev/null | filter_allowlist "$rule_id")
  emit_warn "$rule_id" "Cross-book PEOPLE.md pointer slug not in allow-list — see RULES-CORE.md Rule 29 §People and Genealogy Files v3.3.2 allow-list" "$matches"
}
check_cross_book_pointers

# §0.13 — Source-analysis persona/name leakage guard (warn-only)
# Added 2026-06-03 alongside the source-analysis methodology formalization
# (docs/source-analysis/). Guards USER-FACING surfaces (content/ + src/) so the
# external contributor's name and the original video/channel persona prose never
# appear there. The internal corpus (docs/source-analysis/) is intentionally NOT
# scanned — it may legitimately retain provenance or "Elan Ramon" (the astronaut,
# a different person). Warn-only. See docs/source-analysis/README.md.
check_source_persona_leak() {
  local rule_id="0.13"
  local matches name_hits persona_hits
  name_hits=$(grep -rnE "\bElan\b" content/ src/ 2>/dev/null)
  persona_hits=$(grep -rinE "thank you for watching|stay with me|my channel|native hebrew speaker|notification bell|see you next time|hit the subscribe" content/ src/ 2>/dev/null)
  matches=$(printf '%s\n%s\n' "$name_hits" "$persona_hits" | grep -v '^[[:space:]]*$' | filter_allowlist "$rule_id")
  emit_warn "$rule_id" "Source-analysis contributor name or video persona prose in user-facing content/ or src/ — keep it internal (docs/source-analysis/ only); see docs/source-analysis/README.md" "$matches"
}
check_source_persona_leak

# ============================================================
# Legacy rules (pre-Phase 0)
# ============================================================

check_pattern "legacy" "EXPLICIT-family labels" \
  "EXPLICIT|EXPLIZIT|EXPLÍCITO|EXPLICITO" \
  "$STUDY_DIRS"

check_pattern "legacy" "Stale 'for awareness' labels" \
  "for awareness|para información|para consciência" \
  "$STUDY_DIRS"

check_pattern "legacy" "Vosotros forms" \
  "vosotros|vuestr" \
  "$CONTENT_DIRS"

check_pattern "legacy" "Trilingual residue" \
  "all three target|three target lang|tres idiomas|três idiomas|drei Zielsprachen" \
  "$STUDY_DIRS"

check_pattern "legacy" "ES diacritics errors (legacy joined-article patterns)" \
  "enél|debajó|formás|mismás|\babajó\b" \
  "content/es/genesis content/es/john content/es/matthew"

check_pattern "legacy" "Stale ruleset version (v2.x) in companion front matter" \
  "\*\*Regelwerk:\*\* v2\.|Rules:\*\* v2\.|Reglas:\*\* v2\.|Regras:\*\* v2\." \
  "$STUDY_DIRS"

check_pattern "legacy" "Malformed section header (underscore after letter)" \
  "^## [A-Z]_" \
  "$STUDY_DIRS"

# F9-class rendering bugs in UI source
ui_f9=$(grep -rEn '>\{entry\.(claimType|confidence)\}<' src/ui/ 2>/dev/null)
emit "legacy" "Raw enum values reach rendering layer (F9-class)" "$ui_f9"

# ============================================================
# Summary
# ============================================================

echo ""
if [ "$WARN_ONLY" = false ] && [ $ERRORS -gt 0 ]; then
  echo "Content lint FAILED: $ERRORS rule(s) flagged."
  if [ $WARNINGS -gt 0 ]; then
    echo "(plus $WARNINGS warning-only rule(s).)"
  fi
  exit 1
fi

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo "Content lint passed."
elif [ "$WARN_ONLY" = true ] && [ $ERRORS -gt 0 ]; then
  echo "Content lint (warn-only): $ERRORS error-level rule(s) flagged, $WARNINGS warning(s)."
else
  echo "Content lint passed with $WARNINGS warning(s)."
fi
