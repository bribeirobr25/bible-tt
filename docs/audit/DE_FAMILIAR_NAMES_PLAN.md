# DE Familiar-Names Plan — Resolve `Name (Name)` Redundant-Parens Pattern

**Status:** REVISED 2026-05-18 (audit v1 absorbed; awaiting project-lead decision lock before execute)
**Scope:** DE locale across Matthew + John + Genesis chapter files (+1 study file)
**Source:** `docs/feedback/FEEDBACK.md` item 35 (STILL OPEN as of 2026-05-17 re-audit pass)
**Related precedent:** `RULES-HB.md` §PROPER-NAME TABLE notes (no-parens rule when translit = familiar); `RULES-GS.md` §PROPER-NAME TABLE — GREEK SCRIPTURES (NT names + DE familiars); `RULES-CORE.md` §AMENDMENT & LOCK PROTOCOL (governs rule edits); `docs/editorial-log/john.md` Entry J-021 (cross-book see-only pattern)
**Revisions:**
- 2026-05-17 — Initial draft.
- 2026-05-18 — Absorbed audit v1 (`docs/audit/AUDIT_DE_FAMILIAR_NAMES_PLAN.md`). 3 critical blockers + 4 significant concerns + 5 minor issues addressed. Audit-absorption ledger at §9.

---

## 0. TL;DR

DE chapter files produce 328 occurrences of the form `Name (Name)` (identical-word in parens). The pattern is locale-specific (DE only) and book-broad (Matthew + John + Genesis). It exists because the author treated German familiar forms as if they were source-language transliterations — producing visually redundant first-occurrence flags that the TT's `RULES-HB.md:491` rule explicitly says should be dropped (or replaced with a real transliteration).

This plan asks three decision-locks (Q1 policy, Q2 scope, Q3 logging), then executes a mechanical sweep + per-locale verification.

---

## 1. Pinned verified facts (as of 2026-05-17)

### 1.1 Footprint per file

| File | Redundant-parens count | Notes |
|------|--------|-------|
| `content/de/matthew/CHAPTER-1.md` | 32 | `Jesus (Jesus)`, `Abraham (Abraham)`, `Josef (Josef)`, `Maria (Maria)`, `Isaak (Isaak)`, `Jakob (Jakob)`, `Juda (Juda)`, `Salomo (Salomo)` |
| `content/de/matthew/CHAPTER-2.md` | 31 | `Nazareth (Nazareth)`, `Bethlehem (Bethlehem)`, `Jesus (Jesus)`, `Josef (Josef)`, `Juda (Juda)`, `Jerusalem (Jerusalem)`, `Galiläa (Galiläa)`, `Mose (Mose)`, `Maria (Maria)` |
| `content/de/matthew/CHAPTER-3.md` | 29 | `Johannes (Johannes)`, `Jordan (Jordan)`, `Jesus (Jesus)`, `Juda (Juda)`, `Jerusalem (Jerusalem)`, `Galiläa (Galiläa)`, `Elia (Elia)`, `Abraham (Abraham)`, `Isaak (Isaak)` |
| `content/de/john/CHAPTER-1.md` | 44 | `Jesus`, `Johannes`, `Jerusalem`, `Philippus`, `Petrus`, `Nikodemus`, `Mose`, `Jordan`, `Jesaja`, `Galiläa`, `Kapernaum`, `Andreas` |
| `content/de/john/CHAPTER-2.md` | 21 | similar profile |
| `content/de/john/CHAPTER-3.md` | 18 | similar profile |
| `content/de/genesis/CHAPTER-1.md` | 0 | clean |
| `content/de/genesis/CHAPTER-2.md` | 0 | clean |
| `content/de/genesis/CHAPTER-3.md` | 7 | post-Eden narrative |
| `content/de/genesis/CHAPTER-4.md` | 23 | Cain narrative |
| `content/de/genesis/CHAPTER-5.md` | 23 | genealogy |
| `content/de/genesis/CHAPTER-6.md` | 13 | |
| `content/de/genesis/CHAPTER-7.md` | 6 | |
| `content/de/genesis/CHAPTER-8.md` | 5 | |
| `content/de/genesis/CHAPTER-9.md` | 18 | |
| `content/de/genesis/CHAPTER-10.md` | 13 | Table of Nations |
| `content/de/genesis/CHAPTER-11.md` | 19 | Babel + Terach |
| `content/de/genesis/CHAPTER-12.md` | 25 | Avraham/Abram cycle |
| `content/de/genesis/study/*.md` | 0 | study/ files are clean |
| `content/de/john/study/CHAPTER-1-CONTEXT.md` | 1 | line 183 — `Nazareth (Nazareth)` (post-audit enumeration; in scope for Step 3 sweep with H3-section-boundary detection) |
| `content/de/matthew/study/*.md` | 0 | clean |
| **TOTAL DE chapter files** | **~328** | |

### 1.2 Cross-locale parallel check

| Locale × Book | Redundant-parens count |
|---|---|
| PT-BR Matthew CHAPTER-{1,2,3} | 0 |
| ES Matthew CHAPTER-{1,2,3} | 0 |
| EN Matthew (all chapters) | 0 (uses proper `Yochanan (John)` form) |

**Implication:** This is a DE-locale-specific authoring pattern, not a cross-locale propagation problem. Fix is DE-only.

### 1.3 Self-documented (incorrect) convention

`content/de/matthew/CHAPTER-1.md:42` overview states:
> "Eigennamen folgen der TT-Transliteration: Jesus, Josef (Josef), Maria (Maria), Abraham usw. Vertraute deutsche Formen werden beim ersten Vorkommen vermerkt."

`content/de/john/CHAPTER-1.md:42` overview states:
> "Eigennamen folgen der TT-Transliteration: Yochanan (Johannes), Yeshua (Jesus), Kefa (Petrus), Philippos (Philippus), Nathanael, Andreas."

DE John's overview correctly cites `Yochanan (Johannes)`, `Yeshua (Jesus)`, `Kefa (Petrus)`, `Philippos (Philippus)` — but the chapter body then renders them as `Jesus (Jesus)`, `Johannes (Johannes)`, `Petrus (Petrus)`, `Philippus (Philippus)`. **Internal inconsistency within the same file.**

### 1.4 Governing rule from `RULES-HB.md` §PROPER-NAME TABLE — GENESIS 1-12 (notes section)

> "Names where the familiar form is identical to the transliterated form (e.g., Sarai, Lot, Nimrod, David) use the transliterated form throughout — no parenthetical needed."

(Section-path citation, not a line-number citation — line numbers shift with edits. The rule lives in the notes block immediately below the proper-name table in RULES-HB.md.)

When `translit_form == DE_familiar_form`, the form should be used **bare, no parens**. Producing `Name (Name)` violates this rule.

### 1.5 Proper-name table mapping (DE column) — sourced from BOTH RULES-HB.md AND RULES-GS.md

**Two source tables govern this sweep** (corrected post-audit v1; the original draft incorrectly cited only RULES-HB.md):

- **RULES-HB.md §PROPER-NAME TABLE — GENESIS 1-12** — covers HB-source names appearing in Genesis 1-12 plus a handful of NT-referenced OT figures (Mosheh, Eliyahu). Person Names + Place Names + Group Names subsections.
- **RULES-GS.md §PROPER-NAME TABLE — GREEK SCRIPTURES** — covers GS-source NT names (Yochanan/Johannes, Yeshua/Jesus, Kefa/Petrus, Shimon/Simon, Andreas, Philippos/Philippus, Nathanael, Nikodemos/Nikodemus, Yosef/Josef, Miryam/Maria, Herodes, Eliyahu/Elia, Yeshayahu/Jesaja) plus GS-specific place names (Beyt-Anyah/Bethanien, Beyt-Tsaidah/Bethsaida, Kfar Nachum/Kapernaum).
- Per RULES-GS.md table note: "Names shared with HB (Avraham, Mosheh, Yerushalayim, etc.) are governed by the HB table" — so when both tables map a name, HB wins for HB-source names and GS wins for GS-only names.

**Coverage gap (surfaced by audit v1 §3.1):** Neither table lists patriarchs from Genesis 13-50 (Yitschaq/Isaak, Ya'aqov/Jakob, Yehudah/Juda) or post-patriarchal OT figures (Shelomoh/Salomo, Rut/Rut, Bo'az). These names appear in Matthew 1's genealogy. They MUST be added to the classification doc with derived transliterations (per RULES-HB.md §Hebrew Transliterations conventions) before Step 2; see Step 1 below. The transliteration derivation is straightforward (every Hebrew letter has a documented ASCII equivalent) but the DE familiar form lookup requires a separate decision per name. Project-lead review of the classification doc is gated before Step 2 proceeds.

Selected cases:

| Hebrew/Greek source | Translit | DE Familiar | Status of current DE rendering |
|---|---|---|---|
| יְרוּשָׁלַיִם | Yerushalayim | **Jerusalem** | Currently `Jerusalem (Jerusalem)` — WRONG (translit ≠ familiar; should be `Yerushalayim (Jerusalem)`) |
| יַרְדֵּן | Yarden | **Jordan** | Currently `Jordan (Jordan)` — WRONG |
| מִצְרַיִם | Mitsrayim | **Ägypten** | Currently `Ägypten (Ägypten)` — WRONG |
| בֵּית לֶחֶם | Beyt-Lechem | **Bethlehem** | Currently `Bethlehem (Bethlehem)` — WRONG |
| גָּלִיל | Galil | **Galiläa** | Currently `Galiläa (Galiläa)` — WRONG |
| נָצְרַת | Natseret | **Nazareth** | Currently `Nazareth (Nazareth)` — WRONG |
| מֹשֶׁה | Mosheh | **Mose** | Currently `Mose (Mose)` — WRONG |
| אֵלִיָּהוּ | Eliyahu | **Elia** | Currently `Elia (Elia)` — WRONG |
| אָדָם | Adam | **Adam** | Should be **`Adam`** bare per §PROPER-NAME-TABLE note (translit == familiar) |
| (GS) Ἰησοῦς | Yeshua | **Jesus** | RULES-GS.md table maps Greek→Yeshua, DE familiar `Jesus`. Currently `Jesus (Jesus)` — WRONG (translit ≠ familiar; should be `Yeshua (Jesus)` first occurrence, then `Jesus`) |
| (GS) Ἰωάννης | Yochanan | **Johannes** | Currently `Johannes (Johannes)` — WRONG (should be `Yochanan (Johannes)`) |
| (GS) Κηφᾶς | Kefa | **Petrus** | Currently `Petrus (Petrus)` — WRONG (should be `Kefa (Petrus)`) |
| (GS) Σίμων | Shimon | **Simon** | Currently `Simon (Simon)` — WRONG (should be `Shimon (Simon)`) |
| (GS) Φίλιππος | Philippos | **Philippus** | Currently `Philippus (Philippus)` — WRONG (should be `Philippos (Philippus)`) |
| (GS) Ἀνδρέας | Andreas | **Andreas** | Should be **`Andreas`** bare (translit == familiar) — Class B |
| (GS) Ναθαναήλ | Nathanael | **Nathanael** | Should be **`Nathanael`** bare — Class B |
| (GS) Νικόδημος | Nikodemos | **Nikodemus** | Currently `Nikodemus (Nikodemus)` — WRONG (should be `Nikodemos (Nikodemus)`) |
| (GS) Ἰωσήφ | Yosef | **Josef** | Currently `Josef (Josef)` — WRONG (should be `Yosef (Josef)`) |
| (GS) Μαριάμ | Miryam | **Maria** | Currently `Maria (Maria)` — WRONG (should be `Miryam (Maria)`) |
| (GS) Ἡρῴδης | Herodes | **Herodes** | Should be **`Herodes`** bare — Class B |
| (GS) Ἠλίας | Eliyahu | **Elia** | Currently `Elia (Elia)` — WRONG (should be `Eliyahu (Elia)`) |
| (GS) Ἠσαΐας | Yeshayahu | **Jesaja** | Currently rarely seen as `Jesaja (Jesaja)`; should be `Yeshayahu (Jesaja)` per first-occurrence |
| (GS) Καφαρναούμ | Kfar Nachum | **Kapernaum** | Currently `Kapernaum (Kapernaum)` — WRONG (should be `Kfar Nachum (Kapernaum)`) |

**Unmapped patriarchal/historical names (must be derived in Step 1, gated by project-lead review)** — preliminary classification based on RULES-HB.md transliteration conventions:

| Hebrew source | Standard transliteration | DE familiar (proposed) | Class | Derivation source |
|---|---|---|---|---|
| יִצְחָק | Yitschaq | Isaak | A | RULES-HB.md Hebrew→ASCII letter map |
| יַעֲקֹב | Ya'aqov | Jakob | A | id. |
| יְהוּדָה | Yehudah | Juda | A | id. |
| שְׁלֹמֹה | Shelomoh | Salomo | A | id. |
| תָּמָר | Tamar | Tamar | B | translit == familiar |
| רוּת | Rut | Rut | B | translit == familiar |
| בֹּעַז | Bo'az | Boas (or Bo'az?) | A/B depending on chosen DE familiar | requires project-lead lock |
| דָּוִד | David | David | B | translit == familiar (§PROPER-NAME-TABLE note explicitly cites David) |

The 328 occurrences fall into two classes:
- **Class A (~230, "Wrong direction")**: Names whose proper translit differs from DE familiar — currently rendered as redundant `Name (Name)` when they should be `Translit (Familiar)`. E.g., `Jerusalem (Jerusalem)` → `Yerushalayim (Jerusalem)`.
- **Class B (~98, "Should-be-bare")**: Names where translit == DE familiar (David, Adam, etc.). Per §491 these should drop the parens entirely. E.g., `David (David)` → `David`.

---

## 2. Out-of-scope

- PT-BR and ES Matthew (already clean — 0 occurrences).
- DE study/ companion files (already clean — 0 + 1 stray; the 1 stray will be swept with its parent chapter).
- DE INTRODUCTION.md and PEOPLE.md files (separate scope; spot-check + sweep as part of same logged decision).
- Any non-DE locale.
- Renaming the *RULES-HB.md proper-name table itself* — the table is correct; chapter files just need to comply with it.

---

## 3. Decision questions

### Q1 — Naming convention policy for DE first-occurrence form

For names where the proper TT source-language transliteration (Greek `Iēsous` → Hebrew-style `Yeshua`; Greek `Iōannēs` → `Yochanan`; Hebrew `Yerushalayim`) differs from the DE familiar form (`Jesus`, `Johannes`, `Jerusalem`), which form should DE chapter files use?

**Option A — Match EN discipline (source-language transliteration + DE familiar in parens):**
- Pattern: `Yeshua (Jesus)`, `Yochanan (Johannes)`, `Yerushalayim (Jerusalem)`, `Mitsrayim (Ägypten)`, `Beyt-Lechem (Bethlehem)`, `Mosheh (Mose)`
- Subsequent occurrences in the same section: DE familiar only (`Jesus`, `Johannes`, `Jerusalem`)
- Pros: Cross-locale consistency with EN; source-text fidelity at the surface; aligns with RULES-HB.md proper-name table.
- Cons: ~230 Class A occurrences need real authoring substitution (not mechanical replacement); changes how DE readers see famous names like `Jesus → Yeshua`; Luther-Bible-trained readers may find the source-form jarring on first appearance.

**Option B — DE locale exception (DE familiar throughout, no parens, log exception in editorial log):**
- Pattern: `Jesus`, `Johannes`, `Jerusalem`, `Ägypten`, `Bethlehem`, `Mose` (bare, no parens)
- Subsequent: same
- Pros: ~328 mechanical sweep (drop the redundant `(X)` from every `X (X)`); zero authoring decisions per name; respects DE editorial tradition (Luther Bible); matches what the original DE author chose despite the redundant-parens mistake.
- Cons: Drops source-language-transliteration discipline at the verse-text level; weaker source-text fidelity; cross-locale divergence from EN/PT/ES (which use transliterated form).
- Requires: new editorial-log entry documenting the DE locale exception + amendment to RULES-HB.md §Name Rendering Policy.

**Option C — Hybrid (RECOMMENDED):**
- **Class B (translit == DE familiar)**: drop parens per §491. E.g., `David (David)` → `David`, `Adam (Adam)` → `Adam`, `Abraham (Abraham)` → `Abraham` (since both translit form and DE familiar are `Abraham`).
- **Class A (translit ≠ DE familiar)**: apply EN discipline per Option A. E.g., `Jerusalem (Jerusalem)` → `Yerushalayim (Jerusalem)`, `Jesus (Jesus)` → `Yeshua (Jesus)`, `Johannes (Johannes)` → `Yochanan (Johannes)`.
- Pros: Follows TT v3.2 rules literally; preserves Luther-tradition feel for Class B names (`David`, `Adam`); applies source-language fidelity to Class A names where the source form is meaningfully different; consistent with how EN handles the same name-set.
- Cons: Requires per-name classification (Class A vs B); larger authoring change than Option B; some Class A names may be unfamiliar to DE readers on first encounter (e.g., `Yerushalayim` instead of `Jerusalem`).

**My recommendation: Option C.**
- It is the only option that literally follows `RULES-HB.md:491` plus the implicit "first occurrence shows transliterated (familiar)" rule from `RULES-CORE.md`.
- It respects the existing DE editorial discipline for Class B (the author was right to write `Adam`, `David`, `Abraham` bare — they just added redundant parens by mistake).
- It restores cross-locale consistency for Class A names where the source language adds information.
- It is reversible: if executed wrong, Option B is a strict subset (just drop the new transliterated forms).

### Q2 — Scope of execution

**Option A — DE Matthew chapters only (matches the FEEDBACK item 35 narrow scope):**
- 92 occurrences across CHAPTER-1, 2, 3.
- Pros: Smallest scope; closes the FEEDBACK item literally.
- Cons: Leaves the same pattern in DE John (~83) and DE Genesis (~152) unresolved. Inconsistency would be more visible after fix.

**Option B — All DE chapter files in this sweep (Matthew + John + Genesis) (RECOMMENDED):**
- All 328 occurrences across all DE chapter files.
- Pros: One consistent sweep; no half-fixed state; one editorial-log entry covers everything; matches how the project executed the encoding-recovery sweeps (M-024 + 2026-05-17-106 covered cross-book in one pass).
- Cons: Larger one-shot change; longer review; potential for inconsistencies across books if the per-name Class A/B classification differs by author.

**Option C — Matthew now, John + Genesis as separate follow-up plans:**
- Pros: Smaller per-plan units; each book gets its own editorial-log entry.
- Cons: Three plans for what is conceptually one decision; risk of policy drift between sweeps.

**My recommendation: Option B.** The policy decision is uniform across all DE chapter files; executing in one sweep avoids policy drift. The Q1 decision applies the same way to all 328 occurrences regardless of book.

### Q3 — Policy logging

Where should the locked DE naming policy be documented going forward?

**Background — Lock Protocol governance (added post-audit v1, §3.3):** RULES-HB.md header declares `**Status:** LOCKED for current translation cycle (inherits CORE lock protocol)`. RULES-CORE.md §AMENDMENT & LOCK PROTOCOL (§1054) defines two pathways:

1. **Re-opening a locked rule** (full protocol) — requires written proposal in `docs/rules/proposals/`, impact assessment listing affected signed-off verses, minimum 14-day decision window, version bump on accept. Used for substantive rule changes.
2. **Emergency amendment** — "Bug fixes and audit-driven hardening may be patched as point releases without full proposal cycle, but must be logged. Applies when no signed-off verses are affected and all changes are additive (no existing rules modified)." Used for clarificational fixes. Prior v3.3 amendments (24 Punctuation, 25 Idiom, 29 Glossary expansion, 30 Editorial log schema, 31 Worked example) all have proposal files at `docs/rules/proposals/v3.3-N-*.md` — the emergency-amendment path still produces a written proposal artifact for the record.

The DE familiar-names amendment is clarificational (no existing rule is modified — the §PROPER-NAME-TABLE note already says "no parenthetical needed when translit == familiar"; the DE clarification just makes it explicit for the cross-locale case). No signed-off verses are affected (DE Matt/John/Genesis chapters are all `provisional` status). So the **emergency-amendment pathway applies**, NOT the 14-day full protocol.

**Option A — Editorial-log entry only (one log entry per book covering this sweep):**
- Add `docs/editorial-log/matthew.md` M-025 + `docs/editorial-log/john.md` J-026 + `docs/editorial-log/genesis.md` Entry 2026-05-18-107.
- Pros: Decision is on record per book; future authors of Matthew 4+ / John 4+ / Genesis 13+ will see the entry; no rule edit (avoids Lock Protocol entirely).
- Cons: Three entries to maintain; the policy itself isn't anchored in a single canonical location; future authors who consult RULES-HB.md without checking the editorial logs may repeat the redundant-parens mistake.

**Option B — Emergency amendment to RULES-HB.md + cross-reference editorial-log entries (RECOMMENDED, REVISED post-audit):**
- Step B-1: Author a written proposal at `docs/rules/proposals/v3.3-emergency-DE-name-rendering-clarification.md` documenting (a) the redundant-parens pattern as observed; (b) the §PROPER-NAME-TABLE-note clarification text to add; (c) the Class A/B classification; (d) impact assessment ("no signed-off verses affected, additive clarification only"); (e) version bump notation (v3.3.1).
- Step B-2: Append the clarification to RULES-HB.md §PROPER-NAME TABLE notes — a short DE-locale paragraph: "For DE, the no-parenthetical-needed rule applies bidirectionally — when `<Translit> == <DE Familiar>` the bare form is used (no parens). When `<Translit> != <DE Familiar>`, the form is `<Translit> (<DE Familiar>)` at first occurrence per section, then `<DE Familiar>` thereafter. The same convention applies for GS-source NT names where the RULES-GS.md table governs."
- Step B-3: Update the CHANGELOG in RULES-HB.md with the v3.3.1 emergency-amendment entry pointing to the proposal file.
- Step B-4: One anchor editorial-log entry in genesis.md (per its longest history) + sister entries in john.md and matthew.md pointing back to the anchor + to the proposal file.
- Pros: Policy lives in rules where future authors will read it; editorial-log entries point to the rule; emergency-amendment pathway is appropriate (audit-driven hardening, no signed-off verses affected); fully compliant with `RULES-CORE.md` §AMENDMENT & LOCK PROTOCOL.
- Cons: Requires writing a proposal file + updating the CHANGELOG (slightly more work than Option A); creates a v3.3.1 point release.

**Option C — Defer rule amendment + use editorial-log entries as governing documentation now:**
- Identical to Option A in execution but explicitly notes that a future rules-cycle amendment SHOULD codify the DE clarification (forward-tracking item).
- Pros: Avoids the Lock Protocol step entirely in this sweep; keeps the sweep focused on content.
- Cons: Leaves the rules documentation incomplete; future authors must consult three editorial-log entries to learn the DE convention; the forward-tracking item adds debt to PENDING.md.

**My recommendation: Option B (revised) — emergency-amendment pathway with written proposal.**
- The Lock Protocol explicitly contemplates this case under "Emergency amendment."
- Fellow v3.3 amendments (24, 25, 29, 30, 31) used the same pathway with proposal files; this matches established precedent.
- The proposal-file step is a one-time write (~20 min); the future-author benefit (rule visible at point-of-use in RULES-HB.md) is permanent.
- If you prefer to skip the rule edit entirely (Option A or C), the sweep itself still proceeds — Q1/Q2 are independent of Q3.

---

## 4. Alternatives considered (and rejected)

- **Mechanical regex strip-parens-when-identical:** Tempting (one perl one-liner could turn every `Name (Name)` into `Name`). Rejected because it implements Option B which loses source-language fidelity for Class A names. The Class A/B classification requires authoring judgment, not regex.
- **Skip the fix entirely, document the redundant-parens as DE-locale convention:** Rejected because the pattern is internally inconsistent within the same file (DE John CHAPTER-1 overview cites `Yochanan (Johannes)` but body renders `Johannes (Johannes)`); the inconsistency is a worse signal than either consistent option.
- **Hand-author every change:** Rejected. Class A is enumerable from the RULES-HB.md proper-name table; Class B is enumerable by string-equality. A scripted classification + apply pass is sound.

---

## 5. Execution plan (post-decision lock)

### Step 0 — Lock decisions
- Project lead answers Q1, Q2, Q3 via AskUserQuestion (single-turn).
- Plan updated with lock summary at the top.

### Step 1 — Diagnostic enumeration (Class A vs B classification)

**1a — Build the mapping table:**
- Script reads BOTH `docs/rules/RULES-HB.md` §PROPER-NAME TABLE — GENESIS 1-12 AND `docs/rules/RULES-GS.md` §PROPER-NAME TABLE — GREEK SCRIPTURES.
- Extract mapping `{Translit, DE_Familiar}` for every row in both tables.
- Conflict resolution: per RULES-GS.md table note, "Names shared with HB ... are governed by the HB table." When both tables list a name, HB wins for HB-source names; GS wins for GS-only names.

**1b — Enumerate redundant-parens occurrences across all 17 DE files in scope:**
- Scan `content/de/{matthew,john,genesis}/CHAPTER-*.md` + `content/de/john/study/CHAPTER-1-CONTEXT.md` for `(\b[A-ZÄÖÜ][a-zäöüß']+)\s+\(\1\)` pattern.
- For each occurrence, record file:line and the Name string.

**1c — Cross-reference and classify:**
- For each `Name (Name)` occurrence, look up Name in the merged HB+GS mapping table:
  - If Name appears in the mapping as a DE Familiar AND the corresponding Translit differs → **Class A**. Output: target form is `<Translit> (Name)`.
  - If Name appears in the mapping as a DE Familiar AND the Translit is identical → **Class B**. Output: target form is `Name` (bare, no parens).
  - If Name does NOT appear in either mapping → **UNMAPPED**. Output: requires manual classification (see 1d).

**1d — Manual classification of UNMAPPED names (gate before Step 2):**
- For every UNMAPPED Name in 1c, derive a candidate transliteration using RULES-HB.md §Hebrew Transliterations conventions (Hebrew letter → ASCII mapping is documented) OR RULES-GS.md §Greek transliteration conventions for NT names.
- Record candidate `{Hebrew/Greek source, derived Translit, proposed DE Familiar, Class A or B}` in `docs/audit/DE_FAMILIAR_NAMES_CLASSIFICATION.md` under a "REQUIRES MANUAL CLASSIFICATION" section.
- **Gate:** project-lead reviews this section before Step 2 begins. New mappings approved here may also be candidates for inclusion in the next v3.3.1+ rules amendment (forward-tracking item, separate from this sweep).

**1e — Output document:**
- Save `docs/audit/DE_FAMILIAR_NAMES_CLASSIFICATION.md` with three sections:
  - **Class A occurrences** (per-file:line list with target form)
  - **Class B occurrences** (per-file:line list with target form `Name` bare)
  - **REQUIRES MANUAL CLASSIFICATION** (per-name candidate mappings; gate Step 2 on review)
- Estimated unmapped count: ~30-50 entries (mostly Matthew genealogy patriarchs: Yitschaq/Isaak, Ya'aqov/Jakob, Yehudah/Juda, Shelomoh/Salomo, Rut, Bo'az; plus minor Genesis 12 figures not in the Gen 1-12 table proper).

### Step 2 — Class B sweep (low risk — RULES-HB.md §491 directly applies)
- For every `Name (Name)` where Name appears in RULES-HB.md as `<Translit> == <DE Familiar>`, replace with bare `Name`.
- Apply via Python script (deterministic, no regex ambiguity).
- Verify: post-sweep grep should show 0 Class B occurrences remaining.

### Step 3 — Class A sweep (per Q1 decision)
- **If Q1 = A or C:** for every Class A `Name (Name)`, replace with `<Translit> (<DE Familiar>)` at first occurrence per section, then `<DE Familiar>` only thereafter.
- **If Q1 = B:** for every Class A `Name (Name)`, replace with bare `<DE Familiar>`.

**Section-boundary detection (corrected post-audit v1, §3.2):**
- DE chapter files use GERMAN section headers, not English. Verified actual headers across `content/de/matthew/CHAPTER-1.md` and `content/de/john/CHAPTER-1.md`:
  - `## INHALTSVERZEICHNIS` (Table of Contents)
  - `## LESEANLEITUNG` (Reading Instructions)
  - `## KAPITELÜBERSICHT` (Chapter Overview)
  - `## FORTLAUFENDE LESUNG` (Continuous Reading)
  - `## VERS-FÜR-VERS-STUDIE` (Verse-by-Verse Study)
  - `## GLOSSAR — <BOOK> <N>` (Glossary)
  - `## KAPITELÜBERGREIFENDE VERFOLGUNG ...` (Cross-Chapter Tracking)
- Implementation: use `re.compile(r'^## .+$', re.MULTILINE)` to match any H2 header as section boundary — language-agnostic, robust against future renames. Reset name-occurrence-counter at every `^## ` match.
- For `content/de/john/study/CHAPTER-1-CONTEXT.md` (the one stray file): section boundaries are H2 enrichment sections (`## A. ...`, `## B. ...`, ... `## H. Sources Consulted`). Use the same `^## ` regex; first-occurrence resets at each section letter.

**In-scope sections vs out-of-scope sections:**
- **IN-SCOPE (sweep these):** `## LESEANLEITUNG`, `## KAPITELÜBERSICHT`, `## FORTLAUFENDE LESUNG`, `## VERS-FÜR-VERS-STUDIE` — these are prose (narrative + verse text + verse-by-verse study notes). The redundant-parens pattern in prose is what RULES-HB.md §PROPER-NAME-TABLE-note addresses.
- **OUT-OF-SCOPE (skip):** `## GLOSSAR — <BOOK> <N>` — these are lookup tables, not running text. The Greek source + German rendering pairing inside table rows is structurally different from prose first-occurrence; sweeping these would damage glossary table semantics.
- **OUT-OF-SCOPE (skip):** `## KAPITELÜBERGREIFENDE VERFOLGUNG ...` — these are cross-chapter tracking tables. Table cells have their own first-occurrence semantics (a name's appearance in a table row may be its first appearance in that table even if seen earlier in prose). Excluded from this sweep; can be revisited as a separate follow-up if needed.
- **OUT-OF-SCOPE (skip):** `## INHALTSVERZEICHNIS` — table of contents only, no proper-name prose.

**Overview-text correction sub-step (post-audit v1, §4.2):**
- After the prose sweep, update each chapter file's `## LESEANLEITUNG` / `## KAPITELÜBERSICHT` overview text to accurately describe the post-sweep convention. Two distinct corrections:
  - **DE Matthew 1** currently claims: `"Eigennamen folgen der TT-Transliteration: Jesus, Josef (Josef), Maria (Maria), Abraham usw."` — this is **falsely claiming TT-transliteration while using German familiar forms**. Correct (per Q1=C) to: `"Eigennamen folgen der TT-Transliteration: Yeshua (Jesus), Yosef (Josef), Miryam (Maria), Avraham (Abraham). Bei nachfolgenden Vorkommen wird die vertraute deutsche Form verwendet."` (or per Q1=B/A as decided).
  - **DE John 1** currently claims: `"Eigennamen folgen der TT-Transliteration: Yochanan (Johannes), Yeshua (Jesus), Kefa (Petrus), Philippos (Philippus), Nathanael, Andreas."` — this IS accurate for the convention but the body doesn't follow it. After Q1=C sweep, the overview becomes self-consistent with the body. No overview edit needed (the body is what changes).
  - Other chapters (DE Matt 2, 3; DE John 2, 3; DE Genesis 1-12) — spot-check overview text and correct any analogous misstatements; record per-file corrections in DE_FAMILIAR_NAMES_CLASSIFICATION.md before Step 3 executes.

- Apply via Python script (build name-occurrence-counter per section using `^## ` boundary regex, replace first vs subsequent per Q1 decision).

### Step 4 — Verification

**Test count baseline (corrected post-audit v1, §4.3):** This sweep is content-only — no parser code is modified, so no new tests are added. Before Step 1, record the current test count by running `pnpm test`. After Step 3, the count MUST equal the baseline. If it differs, investigate before proceeding to Step 5.

(For reference: at audit time 2026-05-18 the baseline is 819 — the +2 over the 817 of the previous baseline comes from the slug-collision vitest cases added during the people-parser hardening task. Those were shipped before this sweep starts. No additional `+N` is expected from this sweep.)

- `pnpm test` → expect: baseline count, unchanged.
- `pnpm content:lint` → expect: 1 pre-existing non-blocking warning (the §0.10 modern-mapping smell-test on `content/en/genesis/PEOPLE.md`), unchanged.
- `pnpm build` → expect: clean.
- `pnpm lint` → expect: clean.
- Visual (when MCP browser is available): navigate to `/de/matthew/chapter/1`, `/de/matthew/chapter/2`, `/de/matthew/chapter/3`, `/de/john/chapter/1`, `/de/john/chapter/2`, `/de/john/chapter/3`, `/de/genesis/chapter/4`, `/de/genesis/chapter/12` (sample covering 8 of 17 files) — verify rendering, check that first-occurrence forms render as expected per Q1, check that bare Class B forms render without parens, check console for parser warnings.

### Step 5 — Logging

**Per Q3 = B (revised post-audit v1, §3.3 — emergency-amendment pathway):**
1. Author the proposal file `docs/rules/proposals/v3.3-emergency-DE-name-rendering-clarification.md` per RULES-CORE.md §AMENDMENT & LOCK PROTOCOL emergency-amendment requirements (proposal text + impact assessment + version bump notation).
2. Append the clarification paragraph to RULES-HB.md §PROPER-NAME TABLE notes section.
3. Update the RULES-HB.md CHANGELOG with the v3.3.1 entry pointing to the proposal file.
4. Add 3 editorial-log entries (anchor in `docs/editorial-log/genesis.md` Entry 2026-05-18-107 + sisters in `john.md` J-026 + `matthew.md` M-025) — each cites the proposal file path and the RULES-HB.md amendment.
5. Update `docs/audit/PENDING.md` marking item 35 RESOLVED with pointer to the editorial-log entries + proposal file.
6. Update `CLAUDE.md` execution-status line with the closure note.

**Per Q3 = A (3 editorial-log entries only):**
1. Add 3 editorial-log entries (genesis.md anchor + john.md + matthew.md sisters).
2. Update PENDING.md marking item 35 RESOLVED with pointer to editorial logs.
3. Update CLAUDE.md execution-status line.

**Per Q3 = C (defer rule amendment):**
1. Same as Q3 = A.
2. Add new PENDING.md entry tracking the deferred RULES-HB.md amendment as forward-tracking item ("DE name-rendering clarification — emergency amendment pending for next rules cycle").

### Step 6 — Final commit

**Single-commit discipline (made explicit post-audit v1, §5.5):** All sweep changes MUST land in one atomic commit to preserve the rollback path. Specifically:
- The Python sweep script MUST NOT commit incrementally per-file.
- The Step 1 classification doc + Step 2 Class B sweep + Step 3 Class A sweep + (per Q3) proposal file + rule amendment + editorial-log entries + PENDING.md + CLAUDE.md updates → all in ONE git commit.
- Commit title: `resolve DE redundant-parens familiar-names pattern (FEEDBACK item 35)`.
- Commit body: full context including Q1/Q2/Q3 decisions, total occurrences swept by class, audit-absorption summary.
- Pre-commit verification: re-run all of Step 4 one final time before committing.

### Step 7 — Optional: content-lint regression-prevention rule (post-audit v1, §4.4 — RECOMMENDED, warn-only)

After the sweep lands, consider adding a new content-lint rule `§0.11` to `scripts/content-lint.sh` (warn-only, not blocking) to prevent regression:

```bash
check_pattern_warn "0.11" "DE chapter: redundant-parens pattern Name (Name) — see editorial-log/genesis.md Entry 2026-05-18-107" \
  '(\w+) \(\1\)' \
  "content/de/genesis/CHAPTER-*.md content/de/john/CHAPTER-*.md content/de/matthew/CHAPTER-*.md"
```

This catches `Johannes (Johannes)` but not `Yochanan (Johannes)` (the words differ). Warn-only because some legitimate uses of `Name (Name)` may exist in etymological notes (e.g., `Vertraut: Yekhonyah (Hebräisch: Yekhonyah / Yehoyakhin)` — though this specific pattern includes a colon and would not match the simple `Name (Name)` regex). If the post-sweep grep shows zero false positives, the rule can be promoted to blocking in a later content-lint review.

**This step is optional and independent of Q1/Q2/Q3.** It can be added in this sweep's commit or as a follow-up; the project lead decides.

---

## 6. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Class A/B classification disagrees with project-lead intent | Step 1 produces a human-reviewable `DE_FAMILIAR_NAMES_CLASSIFICATION.md` before Step 2 — gate Step 2 on project-lead review when REQUIRES MANUAL CLASSIFICATION section is non-empty. |
| Section-boundary detection misclassifies "first occurrence" | Use language-agnostic `^## .+$` regex (corrected post-audit v1 §3.2 — original draft used English header names that don't exist in DE files). Verify with spot-check on `/de/matthew/chapter/1` rendering after sweep. |
| RULES-HB.md proper-name table doesn't list NT names — original risk understated by audit-v1 §3.1 (~175 of 328 occurrences, not "some") | **Resolved in revised plan**: Step 1 reads BOTH RULES-HB.md AND RULES-GS.md (NT names live in GS table). Unmapped patriarchal names handled by Step 1d manual-classification gate. |
| Sweep accidentally touches names inside etymological notes (e.g., `Vertraut: Yekhonyah (Hebräisch: Yekhonyah / Yehoyakhin)`) | The redundant-parens regex `(\w+) \(\1\)` matches identical-word pairs only; the etymology pattern `Yekhonyah (Hebräisch: Yekhonyah / Yehoyakhin)` does NOT match (the parenthetical content differs from the leading word). Verify via Step 4 spot-check. |
| GLOSSAR tables and KAPITELÜBERGREIFENDE VERFOLGUNG tables damaged by sweep | **Resolved in revised plan**: Step 3 explicitly excludes these sections from the sweep (added per audit v1 §5.3 + §5.4). |
| RULES-HB.md Lock Protocol violation if Q3 = B is executed as a simple file edit | **Resolved in revised plan**: Q3 = B now specifies the emergency-amendment pathway with a written proposal file at `docs/rules/proposals/v3.3-emergency-DE-name-rendering-clarification.md`. Compliant with `RULES-CORE.md` §AMENDMENT & LOCK PROTOCOL. |
| Test count regression undetected if `+2` baseline is wrong | **Resolved in revised plan**: Step 4 spec now says "record baseline before Step 1; expect no change after sweep" (corrected per audit v1 §4.3). Baseline at audit time is 819. |
| Future regression of redundant-parens pattern not caught by content-lint | **Mitigation in optional Step 7**: warn-only §0.11 rule catches `Name (Name)` identical-pair in DE chapter files. |
| Per-file commits during sweep break rollback path | **Resolved in revised plan**: Step 6 enforces single-commit discipline explicitly (per audit v1 §5.5). |

---

## 7. Rollback plan

The sweep is a deterministic transformation. If a problem surfaces post-sweep:
- All changes are in tracked files; `git revert` of the bundle commit restores the prior state.
- The Step 1 `DE_FAMILIAR_NAMES_CLASSIFICATION.md` provides per-occurrence file:line, so partial rollback per file is feasible.
- Tests + content lint baseline (817 → expected 819 after slug-collision item; should remain 819 after this sweep) provides a regression signal.

---

## 8. Estimated effort

- Step 0 (decisions): ~10 min (AskUserQuestion turn).
- Step 1 (classification): ~45 min (Python script reading BOTH RULES-HB.md + RULES-GS.md + manual classification of ~30-50 unmapped patriarchal names; project-lead-gated review).
- Step 2 (Class B sweep): ~20 min (script + verify).
- Step 3 (Class A sweep): ~60 min (script with German section-boundary detection + GLOSSAR/KAPITELÜBERGREIFENDE exclusion + overview-text corrections per file + verify).
- Step 4 (verification): ~20 min (test + build + lint + content-lint + MCP visual when available).
- Step 5 (logging): ~45 min (proposal file authoring per emergency-amendment pathway + RULES-HB.md amendment + CHANGELOG update + 3 editorial-log entries + PENDING.md + CLAUDE.md).
- Step 6 (commit): ~5 min.
- Step 7 (optional content-lint §0.11 rule): ~10 min if included.
- **Revised total: ~3.5 hours** (up from initial estimate of 2.5h due to audit-absorption work: bigger Step 1 source set, gating step for unmapped names, GLOSSAR exclusion + table exclusions in Step 3, overview-text corrections per file, proposal file authoring under emergency-amendment pathway).
- Still within the FEEDBACK item 35 "2-3h sweep + sister fix" upper-bound when accounting for the cross-book widening to Option B scope.

---

## 9. Audit-absorption ledger

**Audit source:** `docs/audit/AUDIT_DE_FAMILIAR_NAMES_PLAN.md` (Claude Opus 4.7, 2026-05-18, independent review).
**Method:** Each audit finding re-verified against current files before absorbing. Verifications performed against `RULES-HB.md`, `RULES-GS.md`, `RULES-CORE.md` §AMENDMENT & LOCK PROTOCOL, `content/de/matthew/CHAPTER-1.md`, `content/de/john/CHAPTER-1.md`, `content/de/john/study/CHAPTER-1-CONTEXT.md`, `scripts/content-lint.sh`, `docs/rules/proposals/` directory listing.

| Audit finding | Severity | Verification result | Absorption status | Plan updates |
|--------------|---------|---------|---------|---------|
| §3.1 Step 1 reads only RULES-HB.md; ~175 NT occurrences would be unmapped | Critical | **VERIFIED CORRECT** — RULES-GS.md:311+ has the NT proper-name table with all DE familiars cited (Jesus, Johannes, Petrus, Josef, Maria, Elia, Jesaja). Without this, the script would mis-route to "unmapped" bucket for the majority of Matthew + John scope. | **ABSORBED** | §1.5 rewritten to cite BOTH tables; §5 Step 1 split into 1a–1e with explicit mapping merge logic and manual-classification gate (1d). |
| §3.2 Step 3 uses English section headers absent from DE files | Critical | **VERIFIED CORRECT** — DE files use `## KAPITELÜBERSICHT`, `## FORTLAUFENDE LESUNG`, `## VERS-FÜR-VERS-STUDIE`, `## GLOSSAR`, `## KAPITELÜBERGREIFENDE VERFOLGUNG`, `## LESEANLEITUNG`, `## INHALTSVERZEICHNIS`. My English header list was completely wrong. | **ABSORBED** | §5 Step 3 rewritten with language-agnostic `^## .+$` regex + enumerated German headers + in-scope vs out-of-scope section classification. |
| §3.3 Q3 Option B violates Lock Protocol — needs proposal file | Critical | **VERIFIED CORRECT** — RULES-HB.md header is LOCKED; RULES-CORE.md §AMENDMENT & LOCK PROTOCOL (§1054, not §1415 — audit's citation imprecision noted) requires written proposal in `docs/rules/proposals/`. Prior v3.3 emergency amendments (24, 25, 29, 30, 31) all produced proposal files. Emergency-amendment pathway applies here (no signed-off verses; additive clarification). | **ABSORBED** | Q3 reworked with three-pathway analysis. Option B revised to specify emergency-amendment pathway with proposal file `docs/rules/proposals/v3.3-emergency-DE-name-rendering-clarification.md` + CHANGELOG entry. New Option C added (defer rule amendment). |
| §4.1 Unmapped patriarchal names (Yitschaq/Ya'aqov/Yehudah/Shelomoh/Rut/Bo'az) not in either table | Significant | **VERIFIED CORRECT** — grep of both tables returned zero matches. Audit's preliminary classification table is sound. | **ABSORBED** | §1.5 added "Unmapped patriarchal/historical names" subsection with preliminary mapping; §5 Step 1d added explicit manual-classification gate before Step 2. |
| §4.2 DE Matthew 1 overview falsely claims "TT-Transliteration" while using German familiar forms | Significant | **VERIFIED CORRECT** — overview line: `"Eigennamen folgen der TT-Transliteration: Jesus, Josef (Josef), Maria (Maria), Abraham usw."` — Jesus is NOT a TT-transliteration (Yeshua is). Different from DE John 1 overview, which IS accurate. | **ABSORBED** | §5 Step 3 added "Overview-text correction sub-step" with per-file correction approach for DE Matthew (rewrite the claim) vs DE John (no edit needed; body becomes self-consistent after sweep). |
| §4.3 Test count "+2" is stale | Significant | **VERIFIED CORRECT** — the +2 was the slug-collision vitest cases shipped on 2026-05-17. Content-only sweep adds no tests. | **ABSORBED** | §5 Step 4 rewritten with "record baseline before Step 1; expect unchanged after sweep" approach. Current baseline 819 noted for reference. |
| §4.4 No content-lint rule prevents redundant-parens regression in chapter files | Significant | **VERIFIED CORRECT** — `scripts/content-lint.sh §0.8` applies to `$NON_EN_PEOPLE_FILES` (PEOPLE.md) only. No CHAPTER-*.md coverage. | **ABSORBED (as optional)** | New §5 Step 7 added: optional warn-only §0.11 rule. Independent of Q1/Q2/Q3; project lead decides whether to include in this sweep or as follow-up. |
| §5.1 Stray occurrence in `content/de/john/study/*.md` not enumerated | Minor | **VERIFIED CORRECT** — found at `content/de/john/study/CHAPTER-1-CONTEXT.md:183` (`Nazareth (Nazareth)`). | **ABSORBED** | §1.1 table updated with specific file:line; §5 Step 3 section-boundary spec covers the H2-section-boundary case for CONTEXT files. |
| §5.2 RULES-HB.md `:491` line-number citation is fragile | Minor | **VERIFIED CORRECT** — actual line is 492 (off by 1); line numbers shift with edits. | **ABSORBED** | All `:491` citations replaced with section-path citation (`§PROPER-NAME TABLE — GENESIS 1-12 (notes)`). |
| §5.3 GLOSSAR sections not addressed in scope spec | Minor | **VERIFIED CORRECT** — DE files have `## GLOSSAR — <BOOK> <N>` lookup tables; sweeping them would damage table semantics. | **ABSORBED** | §5 Step 3 explicit out-of-scope: GLOSSAR sections excluded with rationale. |
| §5.4 KAPITELÜBERGREIFENDE VERFOLGUNG tables not addressed in scope spec | Minor | **VERIFIED CORRECT** — DE files have these cross-chapter tracking tables; cells have different first-occurrence semantics from prose. | **ABSORBED** | §5 Step 3 explicit out-of-scope: KAPITELÜBERGREIFENDE VERFOLGUNG sections excluded with rationale. |
| §5.5 Single-commit discipline not enforced | Minor | **VERIFIED CORRECT** — original §7 rollback plan implied single commit but Step 6 didn't enforce it. | **ABSORBED** | §5 Step 6 rewritten with explicit "MUST NOT commit incrementally per-file" rule + atomic-commit requirement. |
| Audit's reference to "AUDIT_NEW_PLAN.md" (cited in §3.3 as prior precedent for Lock Protocol enforcement) | — | **CANNOT VERIFY** — no file by that name exists at `docs/audit/AUDIT_*.md`. Only `AUDIT_DE_FAMILIAR_NAMES_PLAN.md`, `AUDIT_POSSIBLE_CONTENT_BUNDLE_PLAN.md`, `AUDIT_POSSIBLE_CONTENT_BUNDLE_PLAN_v2.md`. | **CITATION-ERROR NOTED; SUBSTANTIVE CLAIM ABSORBED INDEPENDENTLY** | The cited file appears to be a fabrication, but the substantive claim ("Lock Protocol requires written proposals even for emergency amendments") is verified independently via RULES-CORE.md §AMENDMENT & LOCK PROTOCOL + the actual proposal files at `docs/rules/proposals/v3.3-*.md`. No plan change needed beyond what's already absorbed under §3.3. |
| Audit's "RULES-CORE.md §1415" citation for Amendment Protocol | — | **CITATION IMPRECISE** — line 1415 is a CHANGELOG entry that mentions the protocol; the actual protocol section is at §1054 (`## AMENDMENT & LOCK PROTOCOL`). Substantive claim holds. | **CITATION FIXED IN MY PLAN** | All plan references to the Amendment Protocol now cite §AMENDMENT & LOCK PROTOCOL (section-path), not line numbers. |
| §7 "What works well" — Option C / Option B / cross-locale methodology / classification approach validated | — | **POSITIVE FEEDBACK ACKNOWLEDGED** | **NO CHANGE NEEDED** | The Q1 = Option C recommendation, Q2 = Option B recommendation, and the Class A/B intellectual frame remain in the plan as originally drafted. |

---

## 10. Decision-lock summary

| Question | Decision | Date |
|----------|---------|------|
| Q1 (policy) | **Option C — Hybrid (Class A → `Translit (Familiar)`; Class B → bare)** | 2026-05-18 |
| Q2 (scope) | **Option B — All DE chapter files (Matthew 1-3 + John 1-3 + Genesis 1-12 + 1 stray study file)** | 2026-05-18 |
| Q3 (logging) | **Option B — Emergency-amendment pathway (proposal file + RULES-HB.md amendment + CHANGELOG v3.3.1 + 3 editorial-log entries)** | 2026-05-18 |

Locked decisions match all three recommendations. Plan ready for execution starting at Step 1.
