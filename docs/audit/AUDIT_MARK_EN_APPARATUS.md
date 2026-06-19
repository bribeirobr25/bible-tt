# Audit — Mark (EN) Apparatus: chapters 1–3 + INTRODUCTION + companions + PEOPLE + CONTEXT

**Date:** 2026-06-18
**Auditor:** Claude Opus 4.8 (independent review)
**Scope reviewed:** `content/en/mark/` — `CHAPTER-1/2/3.md`, `INTRODUCTION.md`, `study/CHAPTER-1/2/3-CONTEXT.md`, `PEOPLE.md`, `CONTEXT.md` — plus the activation wiring (`registry.ts`, `people-parser.ts`, `content-lint.sh`, i18n `book.mark`).
**Method:** Read every Mark content file directly against the current v3.4 ruleset (RULES-CORE Rule 17/22/29/30, RULES-GS, the people-parser enum, the renderer markers). Did not trust the Claude Code self-report; re-derived its compliance claims (historicity enum, stub well-formedness, Rule 30 marking, dual-labels) from the actual files and parser source. Could not execute the green gate (no shell) — `pnpm test`/`build`/`lint`/`content:lint` counts are taken on report.
**Status:** ✅ **APPROVE — content quality is high and rule-compliance is strong, including the same-day Rule 30.** Two real issues to fix (one activation-lint coverage gap, one stale landing-copy string) and a few minor notes. None blocks; all are quick. Residual translation/enrichment accuracy remains `provisional` pending Rule-28 Hellenist sign-off — correctly marked everywhere.

---

## Executive summary

This is genuinely good work, and it holds up to file-level scrutiny. The three chapters apply the hardest current rule — **Rule 30 divine-speech marking** — correctly and consistently, including every exclusion case (unclean spirits, narrator citations, crowd, disciples). Text-critical discipline (Rule 22) is exemplary: all the known cruxes in Mark 1–3 (1:1 "son of God", 1:2 Isaiah-attribution, 1:41 compassion/anger, 2:26 Abiathar, 3:14 "apostolous", 3:32 "and your sisters") are flagged, not smoothed. The companion/introduction structure is Rule-29-clean (mandatory §H/§G present, dual-labels correct, provenance-typed sources, §I using the established two-scenario + cross-reference pattern). The cross-book PEOPLE stubs are well-formed and the historicity enum claim checks out against the parser.

The report's self-assessment is, unusually, **accurate** on its content claims. The gaps are at the edges: a content-lint glob that allow-lists Mark but doesn't actually scan it, and a couple of stale activation strings the report didn't notice.

---

## Verification table

| # | Report / rule claim | Result | Evidence (verified this session) |
|---|---|---|---|
| 1 | Historicity values valid (PROBABLE ×13, POSSIBLE ×1) | ✓ | `people-parser.ts parseHistoricityStatus` accepts VERIFIED/PROBABLE/POSSIBLE/LITERARY/UNCERTAIN. Counted 13 PROBABLE + 1 POSSIBLE (Taddai) across 14 full entries. Taddai=POSSIBLE is well-justified (apostle-list variation). |
| 2 | 17 figures; 3 well-formed see-only stubs | ✓ | 3 stubs (Yeshua, Yochanan, Miryam) → `**See:** matthew/PEOPLE.md` + `**In Mark:**` (alias "in mark" present in parser). 14 full entries. Total 17. |
| 3 | No redundant `Name (Name)` | ✓ | EN file: no heading where translit == familiar. (Non-EN check N/A — only EN Mark exists.) |
| 4 | Rule 30 divine speech marked correctly | ✓ | God's voice 1:11 `@@…@@`; Yeshua's speech marked throughout (1:15,17,25,38,41,44; 2:5,8–11,14,17,19–22,25–28; 3:3,4,5,23–29,33,34–35). The v10 narrator-aside correctly *pauses* the span. **Exclusions correct:** unclean spirit 1:24 + 3:11 explicitly NOT marked (with notes); narrator citation 1:2–3, crowd, disciples, leper all unmarked. Textbook-correct. |
| 5 | `{a:wind/spirit}` slash applied per Rule 2 | ✓ | Used for divine pneuma (1:8,10,12; 3:29); correctly withheld for "unclean spirit" (1:23; 3:30) and Yeshua's "own spirit" (2:8), each with an explanatory note. Precise. |
| 6 | Text-critical variants flagged (Rule 22) | ✓ | 1:1, 1:2, 1:41, 2:26 (Abiathar), 3:14 (apostolous bracket), 3:16 (repeated clause), 3:32 (sisters) — all noted, NA28 followed, none silently adopted. The two I pre-flagged in the plan audit (1:1, 1:2) are both handled. |
| 7 | CONTEXT.md: 6 motifs, dual-labels + chapter labels | ✓ | 6 motifs, each `[TEXTUAL — VERIFIED]` + **Chapters:** line. Sources provenance-typed. Motif 4/5 correctly note the demons are NOT divine speech. |
| 8 | Companion §A–I; §H mandatory; §I structure | ✓ | Ch-1 companion: §A–D, F, G, I present, §H Sources table provenance-typed (Rule 29). §I uses two-scenario (pre-/post-70) + cross-reference to John's full grid — matches the established Genesis/§I pattern from prior audits. Disclaimer + HOW-TO-USE present. |
| 9 | INTRODUCTION §A–G; §G mandatory; CARD | ✓ | A–G present, G (Sources) mandatory + populated, `<!-- CARD -->` block with What/When/Who/To whom/Why, disclaimer, dual-labels. Genre = narrative (correct, no poetry adaptation needed). |
| 10 | `AVAILABLE_BOOKS` includes mark | ✓ | `["genesis","matthew","mark","john"]`. |
| 11 | content-lint extended for Mark | ◑ | `CONTENT_DIRS`/`STUDY_DIRS`/`PEOPLE_FILES`/`CONTEXT_FILES`/`EDITORIAL_LOGS` all += Mark; §0.12 allow-list hash += `mark`. **But §0.12's glob still scans only genesis/john/matthew — Mark's PEOPLE.md is allow-listed yet never actually checked.** See Significant 1. |
| 12 | i18n `book.mark` present | ✓ | **Verified present in ALL 4 locales**: EN "Mark", PT-BR "Marcos", DE "Markus", ES "Marcos". Not a blocker. |
| 13 | Mark labelled "Greek Scriptures", not "Hebrew Bible" | ✓ | `HEBREW_BIBLE` set = {genesis} only; Mark falls through to `corpusGreek` ("Greek Scriptures"/"Escrituras Gregas"/"Griechische Schriften"/"Escrituras Griegas") in all 4 locales. Correct. |
| 14 | `/books` landing copy current after activation | ✗ | `books.heroTagline` + `books.sectionKick` are stale in **ALL 4 locales** — still "Genesis · John · Matthew" and "Three/Três/Drei/Tres books". Mark missing from every tagline. See Minor 2. |

---

## Findings

### Significant

**Significant 1 — `content-lint.sh §0.12` allow-lists Mark but never scans it: a silent-coverage gap.**
The cross-book-pointer validator (§0.12) was updated to add `mark => 1` to its allowed-slug hash — so Mark's three `**See:** matthew/PEOPLE.md` stubs won't be *false-flagged*. But the validator's file glob was **not** extended:

```
} ' content/*/genesis/PEOPLE.md content/*/john/PEOPLE.md content/*/matthew/PEOPLE.md 2>/dev/null
```

Mark's `PEOPLE.md` is not in the glob, so **§0.12 never actually reads Mark's file.** Right now this is benign (all three Mark stubs point to `matthew`, which is valid), but it means the dangling-pointer guard the project relies on is *not running* on Mark — a future typo like `**See:** mathew/PEOPLE.md` in Mark would pass silently, exactly the failure §0.12 exists to prevent. This is the "silent escape" risk flagged in the multi-book plan audit, materialized in mild form: the lint *passes partly because checks don't run*, not because Mark was verified clean. **Fix:** add `content/*/mark/PEOPLE.md` to the §0.12 glob (and, when non-EN Mark lands, to `NON_EN_PEOPLE_FILES` for §0.8 and the §0.11 DE glob). One-line change; do it now while the context is fresh.

### Minor

**Minor 1 — Activation surface verified complete (CLOSED this session).** Confirmed present and correct: `AVAILABLE_BOOKS` includes mark; `book.mark` in **all 4 locales** (Mark/Marcos/Markus/Marcos); parser `inBook` alias ("in mark" + 3 locale forms); §0.12 allow-list slug; the five lint file-lists; and Mark correctly labelled "Greek Scriptures" (not in the `HEBREW_BIBLE` set). No residual activation gap. (The only lint hole is the §0.12 *glob*, raised separately as Significant 1.)

**Minor 2 — Landing/books copy is stale in ALL FOUR locales after activation (widened, verified).** Confirmed by reading all four JSONs: `books.heroTagline` lists only Genesis · John · Matthew in every locale (EN "Genesis 1–12 · John 1–3 · Matthew 1–3"; PT "Gênesis 1–12 · João 1–3 · Mateus 1–3"; DE "Genesis · Johannes · Matthäus"; ES "Génesis · Juan · Mateo") — Mark is missing from all four. `books.sectionKick` says "Three books / Três livros / Drei Bücher / Tres libros" in all four — now wrong. **Fix:** add Mark 1–3 to all four taglines and change "Three → Four" in all four sectionKicks. User-visible on the `/books` hero; the report's visual check didn't catch it.

**Minor 3 — Rule 17 name-rendering is applied well; one convention point to confirm against Genesis/Matthew.** Each chapter's Continuous Reading correctly re-glosses at first occurrence ("Yeshua (Jesus)") then uses the familiar form — and the *section reset per chapter* is correct per Rule 17. Within the Verse-by-Verse section, names are re-glossed at many verses (e.g. "Yeshua (Jesus)" recurs at 2:5, 2:8, 2:15, 2:17…). Rule 17 says "first occurrence resets per section," and treats "each companion section / each verse-by-verse" — it's defensible to treat each verse block as cold-entry (a reader may deep-link to one verse), which is how this reads. Not flagging as an error; just confirm this matches how Matthew/John verse-by-verse already behave so the four books are consistent. (If Matthew re-glosses per verse too, this is correct and consistent.)

**Minor 4 — `landing.rulesHeroKicker` stamps "Ruleset v3.3" in all 4 locales, but rules are now v3.4 (pre-existing).** Verified: EN "Governance · Ruleset v3.3", PT "Conjunto de regras v3.3", DE "Regelwerk v3.3", ES "Conjunto de reglas v3.3". The Mark chapter front matter correctly stamps v3.4, so this is a pre-existing landing-string lag, not introduced by Mark. Note §0.1 lint only flags v3.0–v3.2 stamps, so a stale v3.3 passes silently. Out of strict scope for the Mark audit; worth a sweep to v3.4 while updating the taglines (Minor 2), since it's the same four files.

### Not defects (verified good)

- **Rule 30 application is the standout.** Across 3 chapters and ~30 marked spans, every inclusion and every exclusion is correct, including the two hard cases (demon confessions at 1:24/3:11) handled with explicit notes, and the narrator-aside span-pause at 2:10. For a rule authored the same week, this is excellent.
- **Text-critical honesty (Rule 22) is exemplary** — no harmonization, NA28 followed, variants bracketed in italics with confidence labels. The Abiathar crux (2:26) is handled exactly right (flagged UNCERTAIN, not smoothed to Ahimelech).
- **Locked-glossary fidelity** — euangelion="good news", baptisma="immersion", metanoia="change of mind", aphesis="release", christos="anointed one", kyrios under GS Option C with YHWH-referent notes. Consistent with RULES-GS.
- **Companion §I** correctly uses the cross-reference-to-anchor pattern (John 1 as the full-grid home) rather than duplicating the 10-category grid — matching the structure the prior §I migration audit endorsed.
- **PEOPLE.md scholarship** is careful: Levi/Matthew identification flagged as traditional-not-stated; "Cananaean"=zealot-not-place noted; Iscariot=man-of-Keriot; Boanerges glossed as Mark himself glosses it. No ethnogenesis violations.
- **No `{t:}`/transliteration-marker misuse** — Greek terms are glossed in notes, not marked as locked transliterations (correct; GS has no Rule-4 transliteration terms per RULES-GS).

---

## Recommendation

**APPROVE the Mark EN apparatus.** Content quality is at or above the Matthew/John bar, and rule-compliance — especially Rule 30 and Rule 22 — is strong and verified against the actual files, not just the report. Two quick fixes before this is "done":

1. **(Significant 1)** Add `content/*/mark/PEOPLE.md` to the `content-lint.sh §0.12` glob so Mark's cross-book pointers are actually validated, not merely allow-listed. While there, note the `NON_EN_PEOPLE_FILES`/§0.11 globs will need Mark when PT/DE/ES land.
2. **(Minor 2)** Update the stale `/books` copy (`heroTagline`, `sectionKick` "Three books") to include Mark, in all four locales.

And confirm (30 seconds each): `book.mark` in the three non-EN JSONs, and that Mark is labelled "Greek Scriptures" not "Hebrew Bible" on the books index.

The content correctly ships `provisional` pending Rule-28 Hellenist + cross-alignment sign-off; that residual is unchanged and properly marked in every file. Production (main) reportedly untouched.

*Method note: this audit verified content and rule-compliance against the files directly. It did not execute `pnpm test`/`build`/`lint`/`content:lint` (no shell), so the "860 tests green / conservation reconciles" figures are taken on report; the green gate remains the executor's last-mile check — and note that a green content-lint does NOT currently imply Mark's PEOPLE.md was pointer-checked (Significant 1).*
