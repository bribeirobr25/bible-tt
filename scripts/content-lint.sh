#!/bin/bash
set -e

CONTENT_DIRS="content/en/genesis content/pt-br/genesis content/de/genesis content/es/genesis content/en/john content/pt-br/john content/de/john content/es/john content/en/matthew content/pt-br/matthew content/de/matthew content/es/matthew"
STUDY_DIRS="content/en/genesis/study content/pt-br/genesis/study content/de/genesis/study content/es/genesis/study content/en/john/study content/pt-br/john/study content/de/john/study content/es/john/study content/en/matthew/study content/pt-br/matthew/study content/de/matthew/study content/es/matthew/study"

ERRORS=0

check_pattern() {
  local label="$1"
  local pattern="$2"
  local dirs="$3"
  # shellcheck disable=SC2086
  if grep -rEn "$pattern" $dirs 2>/dev/null; then
    echo "  ^^^ $label"
    ERRORS=$((ERRORS + 1))
  fi
}

echo "=== Content Lint ==="

echo ""
echo "Checking for stale patterns..."
check_pattern "EXPLICIT-family labels" "EXPLICIT|EXPLIZIT|EXPLÍCITO|EXPLICITO" "$STUDY_DIRS"
check_pattern "Stale 'for awareness' labels" "for awareness|para información|para consciência" "$STUDY_DIRS"
check_pattern "Vosotros forms" "vosotros|vuestr" "$CONTENT_DIRS"
check_pattern "Trilingual residue" "all three target|three target lang|tres idiomas|três idiomas|drei Zielsprachen" "$STUDY_DIRS"
check_pattern "ES diacritics errors" "enél|debajó|formás|mismás|\babajó\b" "content/es/genesis content/es/john content/es/matthew"

echo ""
echo "Checking for stale version references in front matter..."
if grep -rEn "\*\*Regelwerk:\*\* v2\.|Rules:\*\* v2\.|Reglas:\*\* v2\.|Regras:\*\* v2\." $STUDY_DIRS 2>/dev/null; then
  echo "  ^^^ Stale ruleset version in companion front matter"
  ERRORS=$((ERRORS + 1))
fi

echo ""
echo "Checking for F9-class rendering bugs (raw enum values in UI)..."
if grep -rEn '>\{entry\.(claimType|confidence)\}<' src/ui/ 2>/dev/null; then
  echo "  ^^^ Raw enum values reach rendering layer (F9-class bug)"
  ERRORS=$((ERRORS + 1))
fi

if [ $ERRORS -gt 0 ]; then
  echo ""
  echo "Content lint FAILED: $ERRORS pattern(s) detected."
  exit 1
fi

echo ""
echo "Content lint passed."
