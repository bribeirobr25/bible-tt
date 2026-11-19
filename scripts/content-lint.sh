#!/bin/bash
# Phase-0 hardened content lint (Launch-Readiness Program Step 2 hardening).
#
# Usage:
#   bash scripts/content-lint.sh             # blocking mode (CI default)
#   bash scripts/content-lint.sh --warn-only  # never exits non-zero
#
# Allow-list:
#   scripts/lint-allowlist.txt — lines RULE_ID|FILE|EXACT_MATCH
#   Used to suppress legitimate cases that match a rule's pattern.
#
# Portability: must run under macOS /bin/bash 3.2 (BSD grep) AND CI bash 5.x
# (GNU grep). No mapfile, associative arrays or ${x,,}. Unicode-sensitive
# rules use `perl -CSD`. A tool failure (bad regex, missing path) is an ERROR,
# never a silent pass: grep exit >= 2 and any perl non-zero exit are counted.

WARN_ONLY=false
for arg in "$@"; do
  case "$arg" in
    --warn-only) WARN_ONLY=true ;;
  esac
done

ERRORS=0
WARNINGS=0
TOOL_ERRORS=0

# tool_error <rule_id> <message> — a broken check must fail the lint.
tool_error() {
  echo "[TOOL ERROR $1] $2" >&2
  TOOL_ERRORS=$((TOOL_ERRORS + 1))
  ERRORS=$((ERRORS + 1))
}

# ------------------------------------------------------------
# Book / file lists — GENERATED from the filesystem (no per-book hardcoding).
# A new book needs no edit here. EN is the master locale for the book set.
# HB_BOOKS must equal HEBREW_BIBLE in src/app (asserted by
# src/infrastructure/content/__tests__/activation-consistency.test.ts).
# ------------------------------------------------------------
LOCALES="en pt-br de es"
HB_BOOKS="genesis"
# Cross-book PEOPLE pointer targets not yet authored (forward references). With
# the generated book list they form the §0.12 allow-list.
FORWARD_SLUGS="exodus kings isaiah"

is_hb_book() {
  case " $HB_BOOKS " in *" $1 "*) return 0 ;; esac
  return 1
}

BOOKS=""
for d in content/en/*/; do
  [ -d "$d" ] || continue
  b=$(basename "$d")
  BOOKS="$BOOKS $b"
done

CONTENT_DIRS=""; STUDY_DIRS=""; PEOPLE_FILES=""; NON_EN_PEOPLE_FILES=""
CONTEXT_FILES=""; ES_NT_DIRS=""; ES_NT_CHAPTER_FILES=""; DE_CHAPTER_FILES=""
for loc in $LOCALES; do
  for b in $BOOKS; do
    d="content/$loc/$b"
    [ -d "$d" ] || continue
    CONTENT_DIRS="$CONTENT_DIRS $d"
    [ -d "$d/study" ] && STUDY_DIRS="$STUDY_DIRS $d/study"
    if [ -f "$d/PEOPLE.md" ]; then
      PEOPLE_FILES="$PEOPLE_FILES $d/PEOPLE.md"
      [ "$loc" != "en" ] && NON_EN_PEOPLE_FILES="$NON_EN_PEOPLE_FILES $d/PEOPLE.md"
    fi
    [ -f "$d/CONTEXT.md" ] && CONTEXT_FILES="$CONTEXT_FILES $d/CONTEXT.md"
    for f in "$d"/CHAPTER-*.md; do
      [ -f "$f" ] || continue
      [ "$loc" = "de" ] && DE_CHAPTER_FILES="$DE_CHAPTER_FILES $f"
      if [ "$loc" = "es" ] && ! is_hb_book "$b"; then
        ES_NT_CHAPTER_FILES="$ES_NT_CHAPTER_FILES $f"
      fi
    done
    if [ "$loc" = "es" ] && ! is_hb_book "$b"; then
      ES_NT_DIRS="$ES_NT_DIRS $d"
    fi
  done
done
PTBR_JOHN_FILES="content/pt-br/john/CHAPTER-1.md content/pt-br/john/CHAPTER-2.md content/pt-br/john/CHAPTER-3.md content/pt-br/john/study/CHAPTER-1-CONTEXT.md content/pt-br/john/study/CHAPTER-2-CONTEXT.md content/pt-br/john/study/CHAPTER-3-CONTEXT.md"
EDITORIAL_LOGS=""
for f in docs/editorial-log/*.md; do [ -f "$f" ] && EDITORIAL_LOGS="$EDITORIAL_LOGS $f"; done

# Every generated list must be non-empty — an empty list would make its rules
# pass vacuously.
for v in BOOKS CONTENT_DIRS STUDY_DIRS PEOPLE_FILES NON_EN_PEOPLE_FILES CONTEXT_FILES ES_NT_DIRS ES_NT_CHAPTER_FILES DE_CHAPTER_FILES EDITORIAL_LOGS; do
  eval "val=\$$v"
  if [ -z "$val" ]; then tool_error "lists" "generated list $v is empty"; fi
done

ALLOWLIST_FILE="scripts/lint-allowlist.txt"

# filter_allowlist <rule_id>
# Reads grep output (file:line:text) on stdin, drops lines whose <file>|<text>
# tuple appears in the allow-list under EXACTLY the given rule id (prefix
# compare — not a regex, so the "." in "0.1" cannot match other ids).
filter_allowlist() {
  local rule_id="$1"
  if [ ! -f "$ALLOWLIST_FILE" ]; then
    cat
    return 0
  fi
  awk -v rule="$rule_id" -v alf="$ALLOWLIST_FILE" '
    BEGIN {
      prefix = rule "|"
      while ((getline line < alf) > 0) {
        if (index(line, prefix) == 1) {
          allow[substr(line, length(prefix) + 1)] = 1
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

# lint_grep <rule_id> <pattern> <files...> — grep -rEn with error detection.
# Sets LINT_OUT. grep exit: 0 = matches, 1 = none, >= 2 = error.
lint_grep() {
  local rule_id="$1" pattern="$2" rc
  shift 2
  LINT_OUT=""
  # No paths would make grep -r recurse "." (node_modules, .next…) — never.
  if [ $# -eq 0 ]; then tool_error "$rule_id" "no input paths"; return; fi
  LINT_OUT=$(grep -rEn -- "$pattern" "$@")
  rc=$?
  if [ $rc -gt 1 ]; then tool_error "$rule_id" "grep exited $rc"; fi
}

check_pattern() {
  local rule_id="$1" label="$2" pattern="$3" files="$4"
  # shellcheck disable=SC2086 — $files is an intentional word-split list
  lint_grep "$rule_id" "$pattern" $files
  emit "$rule_id" "$label" "$(printf '%s' "$LINT_OUT" | filter_allowlist "$rule_id")"
}

check_pattern_warn() {
  local rule_id="$1" label="$2" pattern="$3" files="$4"
  lint_grep "$rule_id" "$pattern" $files
  emit_warn "$rule_id" "$label" "$(printf '%s' "$LINT_OUT" | filter_allowlist "$rule_id")"
}

# require_files <rule_id> <files...> — perl exits 0 on a missing file, so
# check inputs explicitly before every perl rule.
require_files() {
  local rule_id="$1" f
  shift
  for f in "$@"; do
    [ -f "$f" ] || tool_error "$rule_id" "missing input file: $f"
  done
}

# lint_perl_re <rule_id> <perl_regex> <files...> — prints file:line:text for
# lines matching a Unicode-aware perl regex (-CSD; pattern passed via env so
# no shell quoting is involved). Sets LINT_OUT; non-zero perl exit = error.
lint_perl_re() {
  local rule_id="$1" re="$2" rc
  shift 2
  LINT_OUT=""
  # No files would make perl -n read stdin (hang) — never.
  if [ $# -eq 0 ]; then tool_error "$rule_id" "no input files"; return; fi
  require_files "$rule_id" "$@"
  # utf8::decode is core perl (no Encode module needed on minimal images).
  LINT_OUT=$(LINT_RE="$re" perl -CSD -ne '
    BEGIN { $re = $ENV{LINT_RE}; utf8::decode($re); $re = qr/$re/; }
    if (/$re/) { chomp; print "$ARGV:$.:$_\n"; }
    close ARGV if eof;
  ' "$@")
  rc=$?
  if [ $rc -ne 0 ]; then tool_error "$rule_id" "perl exited $rc"; fi
}

# check_heading_collision <rule_id> <files>
# Flags `## Translit (Familiar)` lines where translit == familiar.
check_heading_collision() {
  local rule_id="$1" files="$2" matches rc
  require_files "$rule_id" $files
  matches=$(perl -ne '
    # Match ## Translit (Familiar) [optional trailing text].
    # Catches both `## Henoch (Henoch)` and `## Lamech (Lamech) — kainitische Linie`.
    if (/^## (\S+) \((\S+)\)/ && $1 eq $2) {
      chomp;
      print "$ARGV:$.:$_\n";
    }
    close ARGV if eof;
  ' $files)
  rc=$?
  if [ $rc -ne 0 ]; then tool_error "$rule_id" "perl exited $rc"; fi
  emit "$rule_id" "PEOPLE.md heading: transliteration equals familiar form" "$(printf '%s' "$matches" | filter_allowlist "$rule_id")"
}

echo "=== Content Lint ==="
[ "$WARN_ONLY" = true ] && echo "(warn-only mode — no exit on errors)"
echo ""

# ============================================================
# Phase 0 content-lint rules (defined inline below)
# ============================================================

# §0.1 — Stale ruleset version stamps (rules at v3.3 since 2026-05-08)
check_pattern "0.1" "Stale ruleset version stamp (older than v3.3; rules are at v3.4)" \
  "Ruleset v3\.0|Ruleset v3\.1|Ruleset v3\.2|Conjunto de Regras v3\.0|Conjunto de Regras v3\.1|Conjunto de Regras v3\.2|Reglas v3\.0|Reglas v3\.1|Reglas v3\.2|Regelwerk v3\.0|Regelwerk v3\.1|Regelwerk v3\.2|Ruleset version in force:\*\* v3\.0|Ruleset version in force:\*\* v3\.1|Ruleset version in force:\*\* v3\.2|\*\*Ruleset:\*\* v3\.0|\*\*Ruleset:\*\* v3\.1|\*\*Ruleset:\*\* v3\.2|\*\*Regelwerk:\*\* v3\.0|\*\*Regelwerk:\*\* v3\.1|\*\*Regelwerk:\*\* v3\.2|\*\*Conjunto de Regras:\*\* v3\.0|\*\*Conjunto de Regras:\*\* v3\.1|\*\*Conjunto de Regras:\*\* v3\.2|\*\*Reglas:\*\* v3\.0|\*\*Reglas:\*\* v3\.1|\*\*Reglas:\*\* v3\.2|\*\*Regras:\*\* v3\.0|\*\*Regras:\*\* v3\.1|\*\*Regras:\*\* v3\.2|\*\*Conjunto de reglas:\*\* v3\.0|\*\*Conjunto de reglas:\*\* v3\.1|\*\*Conjunto de reglas:\*\* v3\.2" \
  "$CONTENT_DIRS $EDITORIAL_LOGS"

# §0.1b — WARN-ONLY: v3.3 / v3.3.x stamps in content/ (rules are at v3.4). The re-stamp is
# Launch-Program Step 4d; promote to blocking (fold into §0.1) once it lands. Editorial logs are
# excluded: they legitimately keep historical v3.3 mentions. Summarised (count + files), not listed.
# Before promoting: content also cites the amendment *versions* legitimately (e.g. Luke 3 "per the
# v3.3.2 cross-book convention") — allow-list those; prose like "the TT ruleset (v3.3)" is genuinely stale.
lint_grep "0.1b" "v3\.3(\.[0-9])?([^0-9]|$)" content
if [ -n "$LINT_OUT" ]; then
  n_lines=$(printf '%s\n' "$LINT_OUT" | wc -l | tr -d ' ')
  n_files=$(printf '%s\n' "$LINT_OUT" | cut -d: -f1 | sort -u | wc -l | tr -d ' ')
  emit_warn "0.1b" "Ruleset v3.3 stamps remain in content/ (re-stamp to v3.4 in Step 4d)" "  $n_lines line(s) in $n_files file(s) — e.g. $(printf '%s\n' "$LINT_OUT" | head -1 | cut -c1-120)"
fi

# §0.2 — Raw em-dash residue
check_pattern "0.2" "Raw em-dash residue ' -- ' (use em-dash —)" \
  " -- " \
  "$CONTENT_DIRS"

# §0.3 — ES diacritic loss in front matter / headings (ALL es books since Step 2; token list
# widened with the remaining front-matter/heading words cleared in Step 2).
check_pattern "0.3" "ES diacritic loss in front matter or headings" \
  "\bTraduccion\b|\bEdicion\b|\bEspanol\b|\bPolitica\b|\bSenor(es)?\b|\bCompanero\b|\bCapitulos?\b|\bHistoricos?\b|\bAnalisis\b|\bRecepcion\b" \
  "content/es"

# §0.3b — ES diacritic/grammar regressions (ALL es books, incl. genesis — §0.3 only covers NT).
# High-precision, zero-false-positive tokens cleared in the 2026-06-23 pivot-fidelity audit
# (docs/audit/PIVOT_FIDELITY_AUDIT.md); recovered onto main 2026-11-19 (Step 1, PLAN_BASELINE_RECOVERY.md),
# which also added the capitalised "En el era" and Gen 1:11-12 "está en el," forms, the spurious-accent
# "generaciónes" (27 cleared), and anchored "*esta*" so bold **esta** does not match. "se exultó" carries no
# trailing \b: after a multibyte "ó" a C/POSIX locale sees no word boundary and the match would silently fail. NOTE: the broader systemic ES pronoun-accent sweep
# (a el / de el / hacia el → al / él, ¿Donde, clamandó …) is tracked in PENDING.md, not here,
# because those need per-instance judgment (article "el" vs pronoun "él") and would false-positive.
check_pattern "0.3b" "ES diacritic/grammar regression (audit-cleared tokens)" \
  "(^|[^*])\*esta\*([^*]|$)|\b[Ee]n el era\b|\bde el ni\b|\bse cernia\b|\bse exultó|está\*? en el,|generaciónes" \
  "content/es"

# §0.3c — anti-pivot-calque: English grammatical filler ("the Mighty *One*") carried into a
# target as a literal italic word it does not need. German substantivises adjectives ("der
# Mächtige"), as do PT/ES ("o Poderoso"/"el Poderoso"), so an italic *Eine*/*Um*/*Uno* is an
# EN-pivot artifact (Rule 11 marks words the *target* grammar needs, not English's crutches).
# Step 2 precision: only after a capitalized word ("der Mächtige *Eine*", "o Poderoso *Um*"), so a
# legitimate sentence-initial Rule-11 addition ("*Eine* Stimme") passes. perl -CSD (Unicode).
# Implementation review R1: any word before the filler counts (also "der mächtige *Eine*"); a
# sentence-initial addition ("*Eine* Stimme", „*Eine*) still passes.
NON_EN_MD=$(find content/de content/pt-br content/es -name '*.md' | sort) || tool_error "0.3c" "find failed"
lint_perl_re "0.3c" '(?<=\p{L}) \*(?:Eine[rnm]?|Eins|Uma?|Una?|Uno)\*(?!\*)' $NON_EN_MD
emit "0.3c" "EN-pivot grammatical-filler calque (italic One/Eine/Um/Uno after a capitalized word)" "$(printf '%s' "$LINT_OUT" | filter_allowlist "0.3c")"

# §0.3d — WARN-ONLY: lowercase pivot-calque class (adjective + italic indefinite filler), e.g.
# "tu santo *uno*", "den heiligen und gerechten *einen*", "santo e justo *um*" (EN "the Holy *One*").
# Same artifact as §0.3c but lowercase; ~17 known lines (Acts 2-3 + Luke 1:35) await a source-anchored
# editorial pass (Launch Program Step 3/4). Warn-only until that class is cleared (playbook T-14),
# then promote to blocking.
check_pattern_warn "0.3d" "EN-pivot calque: adjective + italic indefinite filler (lowercase)" \
  "([Ss]anto|[Ss]anta|[Jj]usto|[Hh]eilige[nrs]?|[Gg]erechte[nrs]?|[Pp]oderoso|[Mm]ächtige[nr]?) \*(uno|una|um|uma|ein|eine[nrms]?)\*([^*]|$)" \
  "content/de content/pt-br content/es"

# §0.4 — ES NT missing Reina-Valera declaration
es_nt_missing_rv=""
for f in $ES_NT_CHAPTER_FILES; do
  if ! head -25 "$f" | grep -q "Reina-Valera"; then
    es_nt_missing_rv="${es_nt_missing_rv}${f}: missing Reina-Valera declaration in front matter
"
  fi
done
emit "0.4" "ES NT chapter file lacks Reina-Valera Option-B declaration" "$es_nt_missing_rv"

# §0.5 — PT-BR unigênito (until Phase 4 lands)
check_pattern "0.5" "PT-BR 'unigênito' — pending Phase 4 alignment with EN/DE/ES" \
  "unigênito|unigenito" \
  "$PTBR_JOHN_FILES"

# §0.6 — PEOPLE.md presence per book × locale (generalized from John in Step 2).
# Fails if a book directory exists in a locale without a PEOPLE.md file.
missing_people=""
for loc in $LOCALES; do
  for b in $BOOKS; do
    if [ -d "content/$loc/$b" ] && [ ! -f "content/$loc/$b/PEOPLE.md" ]; then
      missing_people="${missing_people}content/$loc/$b/PEOPLE.md: missing
"
    fi
  done
done
emit "0.6" "Book directory without PEOPLE.md (every book needs one per locale)" "$missing_people"

# §0.7a — PEOPLE.md "TT" leftover heading
check_pattern "0.7a" "PEOPLE.md leftover 'Transparent Translation' H2 (Phase 1A removes it)" \
  "^## The Transparent Translation" \
  "$PEOPLE_FILES"

# §0.7b — PEOPLE.md leftover dead H1
check_pattern "0.7b" "PEOPLE.md leftover dead H1 (Phase 1A removes it)" \
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
# Step 2: perl -CSD (BSD grep missed umlaut-initial names like "Ägypten (Ägypten)"); keeps the
# apostrophe so "Ya'aqov (Ya'aqov)" is still caught (\x27). Files generated (all DE chapters).
lint_perl_re "0.11" '(\p{Lu}[\p{Ll}\x27]+) \(\1\)' $DE_CHAPTER_FILES
emit_warn "0.11" "DE chapter redundant-parens regression — see genesis.md Entry 2026-05-18-107 + RULES-HB.md v3.3.1 amendment" "$(printf '%s' "$LINT_OUT" | filter_allowlist "0.11")"

# §0.12 — Cross-book PEOPLE.md pointer validity (warn-only)
# Added 2026-05-18 alongside Phase 13 cross-book PEOPLE formalization (v3.3.2 amendment).
# Validates every `**See:** <slug>/PEOPLE.md` (and locale aliases Ver/Siehe)
# against the published allow-list of valid target slugs (RULES-CORE.md Rule 29
# §People and Genealogy Files v3.3.2 amendment). Catches typos like
# `**See:** geneis/PEOPLE.md` that would otherwise pass silently via the
# CrossBookSeeField graceful-dangling-pointer UI fallback.
# Warn-only: legitimate new forward references should not break the build.
# The allow-list is generated: every authored book + FORWARD_SLUGS (top of file).
# A not-yet-authored target goes into FORWARD_SLUGS (and the RULES-CORE table).
check_cross_book_pointers() {
  local rule_id="0.12"
  local matches rc
  require_files "$rule_id" $PEOPLE_FILES
  matches=$(SEE_SLUGS="$(echo $BOOKS $FORWARD_SLUGS)" perl -ne '
    # Match: **See:** slug/PEOPLE.md  (or Ver: / Siehe:)
    if (/^\*\*(?:See|Ver|Siehe):\*\*\s+([a-z0-9][a-z0-9-]*)\/PEOPLE\.md/i) {
      my $slug = lc($1);
      # Generated (Step 2): every book dir + FORWARD_SLUGS (see top of file).
      my %allowed = map { $_ => 1 } split / /, $ENV{SEE_SLUGS};
      unless ($allowed{$slug}) {
        chomp;
        print "$ARGV:$.:$_  [slug not in allow-list: $slug]\n";
      }
    }
    close ARGV if eof;
  ' $PEOPLE_FILES)
  rc=$?
  if [ $rc -ne 0 ]; then tool_error "$rule_id" "perl exited $rc"; fi
  matches=$(printf '%s' "$matches" | filter_allowlist "$rule_id")
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
  lint_grep "$rule_id" "\bElan\b" content/ src/
  name_hits="$LINT_OUT"
  persona_hits=$(grep -rinE "thank you for watching|stay with me|my channel|native hebrew speaker|notification bell|see you next time|hit the subscribe" content/ src/)
  [ $? -gt 1 ] && tool_error "$rule_id" "grep (persona) failed"
  matches=$(printf '%s\n%s\n' "$name_hits" "$persona_hits" | grep -v '^[[:space:]]*$' | filter_allowlist "$rule_id")
  emit_warn "$rule_id" "Source-analysis contributor name or video persona prose in user-facing content/ or src/ — keep it internal (docs/source-analysis/ only); see docs/source-analysis/README.md" "$matches"
}
check_source_persona_leak

# §0.14 — Unbalanced bold (**) guard (blocking)
# Added 2026-06-19 with the renderer nested-emphasis hardening
# (PLAN_RENDERER_NESTED_EMPHASIS). A line with an ODD number of `**` renders with
# literal asterisks (the renderer's bold pass needs matched `**`). Well-formed
# nesting like `**a *b***` counts `**` as 2 (even) and is fine. Baseline = 0
# across all content; this locks it so future authoring can't reintroduce the
# stray-asterisk bug the hardening fixed.
check_unbalanced_bold() {
  local rule_id="0.14"
  local matches rc ALL_MD
  ALL_MD=$(find content -name '*.md' | sort) || tool_error "$rule_id" "find failed"
  [ -n "$ALL_MD" ] || { tool_error "$rule_id" "no content files"; return; }
  matches=$(perl -ne '
    my $c = () = /\*\*/g;
    if ($c % 2 == 1) { chomp; print "$ARGV:$.:$_\n"; }
    close ARGV if eof;
  ' $ALL_MD)
  rc=$?
  if [ $rc -ne 0 ]; then tool_error "$rule_id" "perl exited $rc"; fi
  matches=$(printf '%s' "$matches" | filter_allowlist "$rule_id")
  emit "$rule_id" "Unbalanced ** on a line (bold renders with literal asterisks; nested **a *b*** is fine)" "$matches"
}
check_unbalanced_bold

# ============================================================
# Legacy rules (pre-Phase 0)
# ============================================================

check_pattern "legacy-explicit" "EXPLICIT-family labels" \
  "EXPLICIT|EXPLIZIT|EXPLÍCITO|EXPLICITO" \
  "$STUDY_DIRS"

check_pattern "legacy-awareness" "Stale 'for awareness' labels" \
  "for awareness|para información|para consciência" \
  "$STUDY_DIRS"

check_pattern "legacy-vosotros" "Vosotros forms (case-insensitive since Step 2)" \
  "[Vv][Oo][Ss][Oo][Tt][Rr][Oo][Ss]|[Vv][Uu][Ee][Ss][Tt][Rr]" \
  "$CONTENT_DIRS"

check_pattern "legacy-trilingual" "Trilingual residue" \
  "all three target|three target lang|tres idiomas|três idiomas|drei Zielsprachen" \
  "$STUDY_DIRS"

check_pattern "legacy-es-joined" "ES diacritics errors (legacy joined-article patterns)" \
  "enél|debajó|formás|mismás|\babajó\b" \
  "content/es"

check_pattern "legacy-v2" "Stale ruleset version (v2.x) in companion front matter" \
  "\*\*Regelwerk:\*\* v2\.|Rules:\*\* v2\.|Reglas:\*\* v2\.|Regras:\*\* v2\." \
  "$STUDY_DIRS"

check_pattern "legacy-header" "Malformed section header (underscore after letter)" \
  "^## [A-Z]_" \
  "$STUDY_DIRS"

# F9-class rendering bugs in UI source
lint_grep "legacy-f9" '>\{entry\.(claimType|confidence)\}<' src/ui/
ui_f9="$LINT_OUT"
emit "legacy-f9" "Raw enum values reach rendering layer (F9-class)" "$ui_f9"

# ============================================================
# Summary
# ============================================================

echo ""
if [ $TOOL_ERRORS -gt 0 ]; then
  echo "($TOOL_ERRORS tool error(s): a check could not run — see the [TOOL ERROR] lines above.)"
  # A broken check is never "just a warning" — fail even in --warn-only mode.
  if [ "$WARN_ONLY" = true ]; then echo "Content lint: tool error(s) — exiting 2."; exit 2; fi
fi
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
