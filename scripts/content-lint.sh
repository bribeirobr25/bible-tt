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
# See docs/audit/FIX_IMPLEMENTATION.md Phase 0 for rule definitions.

WARN_ONLY=false
for arg in "$@"; do
  case "$arg" in
    --warn-only) WARN_ONLY=true ;;
  esac
done

CONTENT_DIRS="content/en/genesis content/pt-br/genesis content/de/genesis content/es/genesis content/en/john content/pt-br/john content/de/john content/es/john content/en/matthew content/pt-br/matthew content/de/matthew content/es/matthew"
STUDY_DIRS="content/en/genesis/study content/pt-br/genesis/study content/de/genesis/study content/es/genesis/study content/en/john/study content/pt-br/john/study content/de/john/study content/es/john/study content/en/matthew/study content/pt-br/matthew/study content/de/matthew/study content/es/matthew/study"
PEOPLE_FILES="content/en/genesis/PEOPLE.md content/pt-br/genesis/PEOPLE.md content/de/genesis/PEOPLE.md content/es/genesis/PEOPLE.md content/en/matthew/PEOPLE.md content/pt-br/matthew/PEOPLE.md content/de/matthew/PEOPLE.md content/es/matthew/PEOPLE.md"
NON_EN_PEOPLE_FILES="content/pt-br/genesis/PEOPLE.md content/de/genesis/PEOPLE.md content/es/genesis/PEOPLE.md content/pt-br/matthew/PEOPLE.md content/de/matthew/PEOPLE.md content/es/matthew/PEOPLE.md"
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
# Phase 0 rules — see docs/audit/FIX_IMPLEMENTATION.md §Phase 0
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

# §0.6 — John PEOPLE.md absence — DEFERRED until after Phase 10.
# Activated post-Phase 10:
#   for each locale, fail if content/<loc>/john/ exists without PEOPLE.md.

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

# §0.10 — Modern-mapping smell-test (PEOPLE.md only, warn-only by default)
check_pattern_warn "0.10" "Modern-mapping smell-test in PEOPLE.md (anti-ethnogenesis review)" \
  "\b(Russia|Europe|Africa|Asia|Slavic|Aryan|Caucasian|Hamitic|Japhetic peoples|Semitic peoples)\b" \
  "$PEOPLE_FILES"

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
