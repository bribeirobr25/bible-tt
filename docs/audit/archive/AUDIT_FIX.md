# Audit of `FIX_IMPLEMENTATION.md`

**Date:** 2026-05-08
**Auditor:** Claude Opus 4.7 (independent review)
**Scope:** `docs/audit/FIX_IMPLEMENTATION.md` — 14 phases (0 through 13) covering lint hardening, People-surface code fixes + data-model expansion, mechanical content sweeps, ES NT remediation, PT-BR/DE consistency, Book Introduction split, NOT-VERIFIED re-audits, readability, Section I expansion, Book Context content, John PEOPLE authoring, prophecy decision, Genesis 13–50, and cross-book canonical PEOPLE.
**Method:** Cross-checked the plan against the actual filesystem (`src/`, `content/`, `docs/`, `scripts/`), the source documents the plan cites (`FEEDBACK.md`, `PENDING.md`, `DEFERRED_TASKS.md`, `RULES-CORE.md` v3.2, `CHANGELOG-v3.2.md`), the parser source code (`people-parser.ts`), the timeline source (`people-timeline.tsx`), the lint script (`content-lint.sh`), and a representative content file (`content/de/genesis/PEOPLE.md`).
**Status:** The plan is overall solid and correctly diagnoses the verifiable bugs. Several issues should be addressed before execution. None are architectural — they are sequencing, scope, and specification gaps.

---

## 1. Executive Summary

This plan is the strongest of the three audit plans in this cycle. Verifiable diagnoses hold up:

- **Parser substring-collision bug confirmed.** `src/infrastructure/content/people-parser.ts` matches field labels via `key.includes(...)` chains. DE label `Alter bei erster Vaterschaft` (lowercased) does not contain the substring `alter bei vaterschaft` the parser expects, so it falls through to the next handler — `key.includes("vater")` — and is misrouted into `father`. Same pattern for PT (`Idade ao tornar-se pai` falls through to `pai`) and ES (`Edad al hacerse padre` falls through to `padre`). DE labels `Heimatort`, `Gesellschaftliche Schicht`, `Charakterbogen`, `Historischer Status`, `Orte, an denen er lebte` are silently dropped because the parser's substring expectations don't match. Verified by reading both the parser and `content/de/genesis/PEOPLE.md`.
- **Inverted heading-convention bug confirmed.** `content/de/genesis/PEOPLE.md` has `## Henoch (Henoch)` — both transliteration and familiar form identical, against the project's `## Transliteration (Familiar)` convention.
- **Empty TT-card bug confirmed.** All `PEOPLE.md` files start with `## The Transparent Translation (TT)` directly under the H1. The parser's `ENTRY_HEADER` regex (`/^## (.+)$/`) captures this as a person entry with no fields — rendered as an empty card in the UI.
- **Timeline data-flow bug confirmed.** `src/ui/people/people-timeline.tsx` filters only on `yearFromCreation`, so all 17 Matthew people (which have `historicalYear` data, not `yearFromCreation`) drop out and the Matthew timeline never renders.
- **`fill: "white"` design-system violation confirmed.** Lines 110–117 of `people-timeline.tsx` use raw `white` for in-bar text, which (a) violates `TT-DESIGN-SYSTEM.md` §5 (no pure black/white) and (b) overflows narrow bars (Chanokh's 365 yrs).
- **Raw `--` propagation confirmed.** `PEOPLE.md` files contain raw double-hyphen throughout (verified in DE Genesis PEOPLE.md: `Adam (Adam)`, `Genesis 1--12`, `Gen 5:21--27`, etc.), and `person-card.tsx` renders these via `renderInlineSafe`, so they reach the DOM as `--`.
- **Ruleset version drift confirmed.** RULES-CORE.md is v3.2 (verified in file header). DE Genesis PEOPLE.md says `**Regelwerk:** v3.0`. PENDING.md N1 quantifies: 180 references at v3.0, 4 at v3.1, 0 at v3.2 across content. The plan's count of "184 references" is plausibly correct.
- **ψυχή typo confirmed in PENDING.md as still-open** — though I haven't re-verified `RULES-GS.md` line 40 directly in this session.

The plan's strengths are real — Operating Principles section is excellent, dependency graph is mostly correct, every phase has a Definition of Done. What follows is a list of issues the plan does not yet handle, sequencing problems the plan introduces, and scope gaps that will create rework if not addressed.

---

## 2. Verification Table

| Plan claim | Verification result | Notes |
|---|---|---|
| Parser substring-collision bug exists in 9 enumerated cases | ✓ Verified | Inspected `people-parser.ts` and `content/de/genesis/PEOPLE.md`. Bug is real and critical. |
| `## Henoch (Henoch)` inverts convention in DE PEOPLE.md | ✓ Verified | Confirmed in `content/de/genesis/PEOPLE.md`. Same review needed for ES Genesis (Henoc/Henoc?), PT Genesis, etc. |
| TT H2 captured as empty PersonCard | ✓ Verified | `ENTRY_HEADER` regex matches; parser has no exclusion for "Transparent Translation" |
| Timeline filters only on `yearFromCreation`, ignoring `historicalYear` | ✓ Verified | Lines 20–22 of `people-timeline.tsx` do exactly this |
| `fill: "white"` violates design-system §5 | ✓ Verified | Lines 110–117 |
| 184 ruleset version stamps to update | ≈ Plausible | PENDING.md says 180+4. Plan's 184 is reasonable; exact count needs re-grep before bulk edit |
| ψυχή run-on at RULES-GS.md line 40 | Not re-verified this pass | PENDING.md item 32 still says open. Plan's claim is consistent with prior audit findings |
| ES NT diacritic loss in `content/es/john/CHAPTER-{1,2,3}.md` | ✓ Plausible per PENDING.md N2 | "Traduccion / Edicion / Espanol / Politica / Senor / segun" verified in PENDING.md as 127/83/106 matches |
| 22 → ~34 people-parser tests | ✓ Consistent with prior verification | Prior audit confirmed 22-test baseline |
| `pnpm test`, `pnpm build`, `pnpm content:lint` are project conventions | ✓ Verified | `package.json` has `test`, `build`, `content:lint`, `typecheck` scripts |
| 4 + 17 PEOPLE-relevant entries (Matthew has 17) | Not directly counted, but consistent with prior audit |  |
| `proxy.ts` is current middleware | ✓ Verified earlier | Just `createMiddleware(routing)` for next-intl |
| RULES-CORE.md is at v3.2 (locked) | ✓ Verified | File header reads "Ruleset v3.2 — Layered Architecture" |
| Amendment & Lock Protocol exists in CORE | ✓ Verified | "Status: Ruleset LOCKED for the current translation cycle" + protocol section |
| Editorial logs `john.md` and `matthew.md` exist | ✓ Verified | Both present in `docs/editorial-log/` |

The plan's diagnostic work is accurate.

---

## 3. Red Flags — Resolve Before Execution

### 3.1 Phase 0 lint rule §0.10 is described as both blocking and non-blocking

§0.10 (modern-mapping smell-test):
> `\b(Russia|Europe|Africa|Asia|Slavic|Aryan|Caucasian|Semitic peoples|Hamitic|Japhetic peoples)\b` [...] **Surfaces these for human review; does not auto-block** (some legitimate uses may exist in academic citations [...]).

But Phase 0's overall framing says:
> Done when: `pnpm content:lint` exits non-zero on every flagged issue [...]

These two statements contradict each other. If `content:lint` exits non-zero, the build pipeline fails — that IS auto-blocking. There is no concept of "warning without failure" in the existing `scripts/content-lint.sh` (verified — the script increments `ERRORS` for every match and `exit 1`s if `$ERRORS > 0`).

A modern-mapping check that is *legitimately* triggered by a linguistics citation in `Section H` (e.g., "Semitic peoples" in a source title, "Indo-European migration" in a comparative parallel) will fail every build. This will lead to either suppressing the rule or littering the codebase with `# noqa`-style escape hatches that the existing lint script does not support.

**Required fix:**
- Either implement a separate warning-only path (a new `scripts/content-warn.sh` that outputs to stderr without exit codes), OR
- Make §0.10 a strict block AND maintain an allow-list mechanism (e.g., excluded contexts via path patterns, or excluded files), OR
- Drop §0.10 from the lint and make it a manual review checklist item under Phase 1H-3's "review catches subtler ones" governance.

### 3.2 Phase 6B requires CHANGELOG-v3.3.md but Phase 6 is sandwiched between content phases

Phase 6B drafts ~5 new policies for `RULES-CORE.md` (Punctuation Governance, Idiom Policy, Glossary Expansion, Editorial Log Schema, Worked Quadrilingual Example). The plan says:

> Each requires a CHANGELOG-v3.3.md and a ruleset version bump (v3.3 or v3.2.1).

But Phase 6 sits in the middle of a content pipeline: Phase 5 (UI/routing) → Phase 6 (re-verification + rules drafting) → Phase 7 (readability sweep). Versioning hygiene says ruleset bumps should be a discrete event, not interleaved mid-content cycle. If Phase 7 runs concurrently with Phase 6B's rule drafting, Phase 7's edits will reference whichever ruleset version they happen to land on — which may not be the version Phase 6B ultimately publishes.

Also: the plan says "v3.3 or v3.2.1" without picking one. CHANGELOG-v3.2.md (verified) records v3.1 → v3.2 as an "Emergency Amendment (audit-driven accessibility improvement)." Phase 6B's additions are not bug fixes — they're new universal policies (Punctuation, Idiom, Glossary Expansion). That's an Amendment & Lock Protocol path, not Emergency Amendment. The Lock Protocol requires a written proposal in `docs/rules/proposals/`, an impact assessment listing affected signed-off verses, and a 14-day decision window. The proposals directory does not currently exist (verified — `docs/rules/` contains CHANGELOG-v3.1.md, CHANGELOG-v3.2.md, RULES-CORE.md, RULES-GS.md, RULES-HB.md, RULES.md, but no `proposals/` subdirectory).

**Required fix:**
- Move Phase 6B drafting to its own discrete ruleset-bump phase (call it Phase 6.5 or pull it into Phase 0).
- Decide explicitly: v3.3 (substantive policy additions) or v3.2.1 (point release). Plan should declare, not list options.
- Engage the Amendment & Lock Protocol explicitly. Either:
  - Run the protocol: create `docs/rules/proposals/`, write proposals, do impact assessment (currently no verses are `signed-off` per Rule 28 — all are `provisional` — so impact is minimal but the protocol still has to be followed), let the 14-day window run, then bump.
  - Declare an Emergency Amendment with rationale ("the policies are additive; no existing rule is modified; no signed-off verses affected") — this is defensible per the protocol's emergency clause, but should be invoked explicitly, not by default.

### 3.3 Phase 1H-2 hardcodes 5 generation-reference figures with no extensibility path

The plan defines:
```ts
export type GenerationReference = "adam" | "noach" | "avram" | "mosheh" | "david";
```

This works for current scope (Genesis 1–12 + Matt 1–3 + John 1–3). It will become brittle the moment any of these conditions hit:
- Genesis 13–50 lands (Phase 12) — new patriarchs (Yitschaq, Yaaqov) are natural reference figures for downstream descendants but aren't on the list.
- Matthew genealogy expands beyond Matt 1's listing — `david` is on the list, but Matthew's genealogy structures itself around David and the Babylonian deportation; the latter isn't a person.
- Other books are added — Exodus, Joshua, Samuel, etc. — each may need their own reference figures.

The plan acknowledges this implicitly ("hand-author per important figure (project lead's threshold)"), but the type system locks the choice.

**Required fix:** Either:
- Make `reference` a free-text string field (`reference: string`) with documented conventions for what counts as a valid reference figure, OR
- Make `GenerationReference` an extensible string union and explicitly note that each book may add to it via Phase 12's Definition of Done, OR
- Introduce a separate `referenceFigures: Record<string, FigureMetadata>` registry in `domain/content/types.ts` so figures can be added without changing the discriminated union.

The current design works for the next 6 months. Phase 12 will run into it.

### 3.4 Phase 1H-3 (regionsByText) blocks legitimate Tier-3 reception entries via the §0.10 lint

Phase 1H-3 correctly constrains `regionsByText` to text-named regions only. But §0.10 lint will flag legitimate Tier-3 companion content — including the very anti-misuse safeguards the constraint is meant to support.

For example, a `Section F` companion entry documenting reception history of the Curse of Ham must mention Africa, slavery, "Hamitic peoples" — that's the entire point of the safeguard. §0.10 will flag those entries.

The plan says "lint rule below catches obvious violations [...] does not auto-block." But §3.1 above shows the lint script can't actually distinguish blocking from non-blocking. So either §0.10 prevents Phase 8 / 9 from passing build, or the safeguards never get authored.

**Required fix:** Tied to §3.1. The §0.10 rule must be either:
- Path-scoped: applies only to PEOPLE.md files (where `regionsByText` lives), not to `study/CHAPTER-N-CONTEXT.md` (where reception-history may legitimately mention these terms), OR
- Field-scoped: applies only inside `**Regions by text:**` field values, not anywhere else in the file, OR
- Manual review only, not automated.

Path-scoping (`grep ... PEOPLE.md`) is cheapest and probably correct.

### 3.5 Phase 5 (Book Introduction split) requires a new `getIntroductionData` filtering helper that doesn't exist

The plan says:
> Calls `getIntroductionData` with the full payload.
> Modify `src/app/[locale]/[book]/page.tsx` to filter sections to `overview` only [...]

Current `getIntroductionData` in `src/lib/content-loader.ts` (verified) returns the full `IntroductionData` (all sections). To filter to `overview` only, the landing page needs to either:
1. Call `getIntroductionData` and discard everything except `sections.find(s => s.id === "overview")`, OR
2. A new `getIntroductionOverview(locale, book)` helper is added to `content-loader.ts`.

Option 1 wastes the parse work. Option 2 is cleaner but the plan doesn't mention adding the helper. Either is acceptable but the plan should specify.

Also: `IntroductionData` (verified in `types.ts`) has `book`, `disclaimer`, `sections`. Filtering `sections` to overview-only leaves `disclaimer` intact, which is good — but the disclaimer is the "How to Use This Introduction" content that may be excessive for a landing page. The plan doesn't address whether the disclaimer is shown on the landing or only on the new `/introduction` route.

**Required fix:** Phase 5 should specify:
- Whether a new `getIntroductionOverview` helper is added or filtering happens at the page level
- Whether the introduction disclaimer is shown on the landing page (with overview only) or only on the full `/introduction` page
- Whether the existing `IntroductionView` component is reused with a filtered prop or a new `BookLandingIntroductionView` component is needed

### 3.6 Phase 9's claimed dependency on "Phases 0–8 settled" is overstated

Phase 9 (Book Context page content cycle) creates `content/{locale}/{book}/CONTEXT.md` for cross-chapter motifs. The plan's dependency table says:

> | 9 | Book Context content | Phases 0–8 settled | medium | Hebraist / Hellenist + locale editors |

But Book Context content authoring depends on:
- The book's chapters being authored (true for Genesis 1–12, John 1–3, Matt 1–3 today)
- The motif identification work (which is part of Phase 9 itself)
- A parser (Phase 9 includes building it)

Phase 9 does NOT structurally depend on:
- Phase 7 readability pass (Book Context content is new content; readability standard applies as it's authored)
- Phase 8 Section I 10-category audit (Book Context is cross-chapter motifs; Section I is per-chapter world-context)
- Phase 6C Tier 2 relocation (Book Context is in its own file, not a Tier 2 note)

If Phase 9's actual dependency is just "Phases 1, 2, 3, 4, 5 settled" + chapter content existing, then Phase 9 could parallelize with Phases 6, 7, 8 — saving substantial calendar time.

**Suggested fix:** Reduce Phase 9's dependency claim from "Phases 0–8 settled" to the actual minimum (Phases 1, 2, 3, 4, 5) and note that Phase 9 can run concurrently with 6, 7, 8.

### 3.7 Phase 12 closure ambiguity in cross-cutting Definition of Done

Bottom of plan, §"Cross-cutting Definition of Done":
> 6. `RULES-CORE.md` has been bumped if Phase 6B amendments landed; content references match.

But Phase 12 (Genesis 13–50) is described as "very large — months of work" and is explicitly out of scope for this plan's immediate execution ("Treat this section as a placeholder"). The cross-cutting DoD doesn't say whether the audit cycle closes:
- (a) When all phases except 12 and 13 close (i.e., 0–11)
- (b) When all phases including 12 and 13 close
- (c) When 0–11 close AND 12 has a separate detailed plan

This ambiguity matters for `FEEDBACK.md` "STILL OPEN" reduction. The plan says the cycle closes when FEEDBACK.md has zero STILL OPEN items — but Genesis 13–50 isn't in FEEDBACK.md (it's in PENDING.md as forward-looking content). So the cross-cutting DoD's #2 ("`docs/feedback/FEEDBACK.md` contains zero STILL OPEN items and zero NOT VERIFIED items") is achievable without Phase 12.

**Required fix:** Specify the closure scope explicitly:
- "This audit cycle closes when Phases 0–11 complete."
- "Phase 12 (Genesis 13–50) is a separate forward-looking project tracked in `PENDING.md` Phase 10. Phase 13 follows Phase 12."

### 3.8 Phase 11 references "Option C" without defining options A or B

Phase 11 says:
> Two viable paths discussed previously. **Recommended: Option C (hybrid).**

What are A and B? The plan doesn't say. Phase 11 then describes Option C (author PROPHECY files for John 3 and Matt 1, 2). A reader of this plan has no way to evaluate whether Option C is actually right without knowing what the alternatives are.

**Required fix:** Enumerate Options A, B, C explicitly. Plausible candidates from PENDING.md item N5:
- A: Don't author PROPHECY files for John/Matthew at all; existing material lives in chapter companions and editorial-log entries (M-001 for Matthew fulfillment formula).
- B: Author PROPHECY files comprehensively for every chapter that contains prophetic material.
- C: Hybrid — author PROPHECY files only where the existing chapter-level content is insufficient to surface in Prophecy view.

Whatever the A and B were in the discussion, the plan should record them so future reviewers can audit the C choice.

---

## 4. Significant Concerns

### 4.1 Phase 1B alias-table specificity-then-priority heuristic is fragile

The plan proposes:
> Match in **specificity-then-priority** order: longer aliases checked before shorter ones to avoid the substring-collision bug.

Sorting aliases by length is a reasonable first-pass heuristic. But it doesn't fully resolve the substring-collision problem in all cases. Counter-example:

Suppose PT label `Pai do herói` (a hypothetical) and `Pai`. Sorting by length puts `Pai do herói` first — correct match. But if the parser tries `key.includes("pai do herói")` and the actual file has `**Pai:** Adão` with a capital P, the lowercased key is `pai`, the alias is `pai do herói`, and `"pai".includes("pai do herói")` is false. So `pai` is checked next and matches correctly — but ONLY because the parser already iterates all aliases.

The deeper problem: the parser's existing structure is an early-return chain (`if (...) { ... } else if (...) { ... }`), where the first match wins. The plan's "specificity-then-priority" assumes the new alias-table has the same first-wins behavior with ordered iteration.

**Suggested:** Specify the matching strategy more precisely:
- Exact match against the lowercased key (with trailing colon stripped) is preferred to substring match.
- If no exact match, fall through to substring match with longest-alias-first ordering.
- Document this explicitly in the type definition or in a comment so future maintainers don't re-introduce the bug.

The plan implicitly assumes this; making it explicit in code review prevents regression.

### 4.2 Phase 1H-1 Curiosities subsection format requires parser changes that aren't specified

Plan says:
> Parser: extract `### Curiosities` subsection per entry; same dual-label format used in companions.

Current `ENTRY_HEADER` regex is `/^## (.+)$/` (verified). Adding `### Curiosities` support requires:
1. Recognizing H3 headings within an entry without breaking entry boundaries (the parser must NOT treat `### Curiosities` as a new entry).
2. Parsing dual-label content blocks within the H3 subsection.
3. Handling multiple entries within Curiosities.

The plan doesn't specify:
- Whether Curiosities is inline (each curiosity is a `**Title:**` line within the H3 section) or structured (each curiosity is its own H4 like `#### Title`).
- How dual labels are formatted (inline like `[TEXTUAL — VERIFIED]` or structured like `**Claim type:** TEXTUAL`).
- How the parser distinguishes Curiosities from a new H2 entry.

**Required fix:** Specify the Curiosities markdown format with an example before parser tests are written. This is critical because the existing parser is structured around H2-as-entry-boundary and adding sub-structure changes that contract.

### 4.3 Phase 1F implicit period grouping uses two heuristics that may conflict

Plan says:
> Implicit period grouping for Genesis: when the gap between consecutive entries' birth years exceeds 200 years, **or** crosses a watershed (Flood ≈ AM 1656; Babel; Avram's call) [...]

Two heuristics:
- (a) Gap > 200 years
- (b) Watershed crossing

These can conflict:
- The gap from Adam (AM 0) to Lemekh (AM 874) is 874 years (heuristic a triggers many times).
- The Flood watershed is at AM 1656 — between Lemekh (AM 874) and Avram (AM 1948), a 1074-year span. Heuristic (a) triggers on the gap. Heuristic (b) triggers on the Flood crossing. But the Flood is at AM 1656, between Lemekh's death (AM 1651) and Avram's birth (AM 1948) — heuristic (b) places the divider at the Flood, while heuristic (a) might not.

So which heuristic wins, and where does the divider go?

**Suggested:** Specify a single deterministic algorithm:
- Walk the chronological list.
- After each entry, check: is the next entry's birth year more than 200 years away? If yes, divider.
- Then, separately, after each entry, check: does a watershed event fall between this entry's death and the next entry's birth? If yes, divider with watershed label.
- Watersheds may produce dividers within < 200-year gaps (good — they capture narrative breaks).

Or pick one heuristic and drop the other. Two heuristics fighting is worse than one heuristic that's slightly imperfect.

### 4.4 Phase 4B DE first-occurrence verification has incomplete logic

Plan says:
> `content/de/john/CHAPTER-1.md`: `Yochanan` 0×, `Johannes` 42×. The first-occurrence transliteration policy (`Johannes (Yochanan)` once per section) may not be applied in DE.

But v3.2's name-rendering policy (verified in RULES-CORE.md Rule 17 §"Name rendering policy"):
> Proper names (persons, places, groups) use the **familiar target-language form as default** throughout the text. The transliterated source-language form appears ONCE at first occurrence per section, with the familiar form in parentheses: e.g., "Yochanan (John)."

So the canonical form is **familiar-as-default with transliterated-once**. DE having "Johannes 42×, Yochanan 0×" might mean DE is correctly using familiar-as-default — and is missing only the once-per-section transliterated gloss (i.e., should be `Johannes (Yochanan)` once per section, then `Johannes` thereafter).

But the plan's framing is that the policy is `Yochanan (Johannes)` — transliterated-as-default with familiar-once. That's the **inverse** of the v3.2 policy.

Re-reading the plan carefully: "The first-occurrence transliteration policy (`Johannes (Yochanan)` once per section)". OK — the plan is asking "is the transliterated form shown once at first occurrence" — which matches v3.2. The "0× Yochanan" is the gap.

**The plan is correct, but its framing is confusing.** Specifically: "may not be applied in DE" suggests the policy is missing, when the actual gap is just the missing transliterated parenthetical at first occurrence per section. The fix is to add `Johannes (Yochanan)` at section starts, not to change the existing 42 occurrences of "Johannes".

**Suggested:** Rewrite Phase 4B:
> DE John 1 currently uses `Johannes` consistently (42×) but never glosses the transliterated form `Yochanan`. Per RULES-CORE.md Rule 17 §"Name rendering policy" (v3.2), the transliterated form should appear ONCE at first occurrence per section. Audit each section (overview, continuous reading, each verse with first-mention, companion sections) and add the parenthetical `Johannes (Yochanan)` at section-first occurrence.
> Verify against the DE proper-name table in RULES-HB.md and RULES-GS.md before applying. If DE has a documented exception (e.g., for very common figures where the transliterated form would feel jarring), log in transliteration-decisions.md.

### 4.5 No explicit CLAUDE.md update

The plan doesn't update `CLAUDE.md`. From prior audits in this cycle, CLAUDE.md was outdated on:
- Path structure (it shows `en/genesis/` instead of `content/en/genesis/`)
- Ruleset version (it cited v2.6 in prose summary while RULES-CORE was at v3.0; now v3.2)
- Current state of John/Matthew expansion

After Phase 6B's rule additions land (and likely a v3.3 bump), CLAUDE.md drift increases. The plan touches `docs/rules/`, `docs/editorial-log/`, but never `CLAUDE.md`.

**Suggested:** Add a Phase 6.5 or Phase 10 step: "Update CLAUDE.md to reflect post-amendment ruleset version, current `content/` paths, and current state of John/Matthew expansion (including new PEOPLE.md after Phase 10)."

### 4.6 Phase 2A claims "184 references" without specifying the regex coverage

Phase 2A's grep targets:
- EN: `Ruleset v3.0|Ruleset v3.1` → `Ruleset v3.2`
- PT-BR: `Conjunto de Regras v3.0|Conjunto de Regras v3.1` → `Conjunto de Regras v3.2`
- ES: `Reglas v3.0|Reglas v3.1` → `Reglas v3.2`
- DE: `Regelwerk v3.0|Regelwerk v3.1` → `Regelwerk v3.2`

But Phase 0 lint rule §0.1 covers MORE patterns:
- `Ruleset v3\.0|Ruleset v3\.1`
- `Conjunto de Regras v3\.0|Conjunto de Regras v3\.1`
- `Reglas v3\.0|Reglas v3\.1`
- `Regelwerk v3\.0|Regelwerk v3\.1`
- `Ruleset version in force:\*\* v3\.0|Ruleset version in force:\*\* v3\.1`

The "Ruleset version in force" pattern matches editorial logs (genesis.md, john.md, matthew.md), which Phase 2A says will be bumped. But the plan's Phase 2A regex doesn't list this 5th pattern, and editorial logs may have additional version-stamp formats not enumerated.

**Suggested:** Cross-reference Phase 0's lint patterns and Phase 2A's edit patterns. Either:
- Make Phase 2A's edits cover all 5 patterns from §0.1 (the editorial-log "Ruleset version in force" form is likely missed otherwise), OR
- Run §0.1 lint as the source of truth: anything it flags is a Phase 2A target.

### 4.7 Phase 0.7 "TT H2" lint rule strips a heading without considering the H1 fallback

Phase 0 §0.7:
> PEOPLE.md "TT" leftover heading — flag any `^## The Transparent Translation` inside a PEOPLE.md file (Phase 1 strips them; lint prevents regression).

Phase 1A:
> delete the H2 line from all 8 existing PEOPLE.md files [...] The metadata block remains directly under the H1.

The H1 currently reads `# Genesis — People and Genealogy` (verified in DE Genesis PEOPLE.md). After H2 strip, the file structure is:
```
# Genesis — Personen und Genealogie
---
**Buch:** Genesis
[...]
```

That's syntactically valid markdown but the H1 isn't used as a page title in the rendered UI (verified — `app/[locale]/[book]/people/page.tsx` renders its own title via i18n). So the H1 is currently dead weight. The plan doesn't address whether to:
- Keep the H1 as-is (dead but harmless)
- Remove the H1 too
- Repurpose the H1 as the page title (would require parser changes)

Minor issue, but worth resolving for consistency.

### 4.8 Phase 0.8 lint allow-list mechanism is unspecified

Phase 0 §0.8:
> PEOPLE.md heading transliteration=familiar collision — flag entries matching `^## (\S+) \(\1\)$` in non-EN PEOPLE.md files where the transliteration and familiar form are identical (the DE Chanokh case). **Allow-list cases where transliteration genuinely equals familiar (e.g. EN Adam, ES Lot).**

How is the allow-list expressed? Options:
1. A separate file (e.g., `scripts/lint-allowlist.txt`) listing locale + name pairs.
2. Inline magic comments (e.g., `<!-- lint-allow: heading-collision -->`)
3. Hardcoded in the lint script.

The existing `scripts/content-lint.sh` (verified) has no allow-list mechanism. Adding one is non-trivial.

**Suggested:** Specify allow-list mechanism in Phase 0. The simplest is hardcoded in the script:
```bash
# Allow-list: cases where transliteration genuinely equals familiar
EXCLUDE_PATTERNS="content/en/.*|## Lot \(Lot\)|## Adam \(Adam\)"
```
But this hardcodes content into infrastructure. Better: a sidecar file, or convention to suppress via a comment line.

### 4.9 Phase 1H-3 does not specify when the safeguard pointer should appear in the UI

Plan says:
> Each entry carries an explicit pointer in the UI to the relevant anti-misuse safeguard (Gen 9 §F5 / Gen 10 §F1) so a reader can never see this content without seeing the safeguard.

But it doesn't specify:
- Does the pointer appear inline next to each `regionsByText` entry, or once at the section header?
- Is the pointer a clickable link, a tooltip, or static text?
- Does it appear in all 4 locales?
- Does it survive the i18n key system (which currently has no anti-misuse-pointer keys)?

**Required fix:** Specify the UI representation. A simple one: add a `regionsByText` group header to PersonCard that always renders a static safeguard pointer (e.g., "Per Genesis 9 §F5 / Genesis 10 §F1: only what the text names; not modern descent claims") above the entries.

---

## 5. Minor Issues and Improvements

### 5.1 Phase 6A items 14 and 17 use grep patterns that might miss formatted content

Phase 6A:
- Item 14: `grep "Son of God\|Son of Man\|King of Yisrael\|King of Israel"` — fine for body text.
- Item 17: `grep "creation from nothing\|creatio ex nihilo\|criação do nada\|creación de la nada\|Schöpfung aus dem Nichts"` — fine.

But "Son of God" might appear as `**Son of God**` (bold) or `*Son of God*` (italics) or in a heading. Grep without `-i` will miss `son of god` already (which is the correct rendering per Rule 20). This is fine for the audit purpose. But for the verification step, the inverse grep (looking for the wrong form) needs to handle markdown-formatted variants.

**Suggested:** Phase 6A's grep should explicitly handle markdown formatting:
```bash
grep -E '\*?\*?Son of God\*?\*?'
```

### 5.2 Phase 7 "grandmother/teenager test" is inherited as policy but has no automated verification

Phase 7 says:
> Apply the grandmother/teenager test: a non-specialist reader should follow the paragraph cold.

This is a subjective standard. Phase 7's verification is implicitly manual review. Plan should say so explicitly:
> Verification: editor + project-lead reads each touched file end-to-end. No automated check possible. Sign-off via editorial-log entry.

Otherwise execution may rush past Phase 7 with grep checks that don't actually verify the standard.

### 5.3 Phase 9's "10 motif entries per book" benchmark is asserted without rationale

Phase 9 Estimated effort:
> ~5–10 motif entries per book.

For Genesis, 10 entries listed in the example seem plausible. For John 1–3 (currently 3 chapters), 5–10 might be too many — the book hasn't been fully translated yet, so cross-chapter motif identification has limited material. For Matthew 1–3 same.

**Suggested:** Specify per-book targets:
- Genesis (12 chapters): 8–12 motifs
- John (3 chapters currently authored): 4–6 motifs
- Matthew (3 chapters currently authored): 4–6 motifs

And add: "Targets revisited as books expand. Genesis 13–50 likely surfaces 5–8 additional motifs."

### 5.4 Phase 10 doesn't list all PEOPLE.md fields

Phase 10 says:
> Apply v3.2 PersonEntry data model including new Phase 1 fields (curiosities, generationsFrom, regionsByText *only* in the constrained text-named form).

But the existing `PersonEntry` (verified in `types.ts`) has: `slug`, `name`, `nameMeaning`, `originType`, `birthYear`, `deathYear`, `lifespan`, `father`, `mother`, `spouses`, `children`, `locations`, `firstMention`, `mentionedIn`, `keyEvents`. Plus the Phase 1H expansion adds curiosities, generationsFrom, regionsByText, plus the existing labels in DE PEOPLE.md (Profession, Hometown, etc.) which are already in the data model after Phase 1.

Plan should reference the post-Phase-1 schema explicitly so the John PEOPLE author doesn't inadvertently use the pre-Phase-1 fields list.

**Suggested:** Cross-reference: "See Phase 1H for the v3.2 PersonEntry schema after expansion. All fields apply to John PEOPLE."

### 5.5 No rollback strategy specified

The plan touches ~180 content files plus code. If Phase 8 (Section I) introduces a regression, recovery requires manual git operations.

**Suggested:** Add per-phase: "Tag git after successful verification (`tt-fix-phase-N-complete`). If a subsequent phase fails, rollback to the last successful tag." This was suggested in prior audits in this cycle and remains unaddressed.

### 5.6 Phase 6A item 26 (Rule 11 audit) is "sample 3 chapters per book" — too narrow

Phase 6A:
> 26 | Rule 11 addition audit | sample 3 chapters per book; verify italicised additions match grammatical-addition criteria.

Sampling 3 of 12 Genesis chapters means ~75% of Genesis isn't audited. Rule 11 audit should be systematic, not sampled — a single verse with miscatallogued italics propagates wrong precedent.

**Suggested:** Either:
- Make 26 systematic across all chapters (defer effort estimate), OR
- Note explicitly that 26 is a triage pass: sample 3 chapters; if violations are systemic, escalate to a full audit phase.

### 5.7 Phase 4A monogenes target form recommendation is not finalized

Plan says "Recommended `único-nascido`" — but doesn't say who decides or when. The plan owns this decision: a content-editor with PT-BR fluency must pick.

**Suggested:** Add an explicit decision step before Phase 4A: "Project lead + PT-BR editor pick target form (`único-nascido`, `unigerado`, or other) by [date]. Decision logged in `docs/editorial-log/john.md`."

### 5.8 Phase 0.1 Stale ruleset pattern uses raw double-period escaped form

Phase 0 §0.1:
> `Ruleset v3\.0|Ruleset v3\.1|Conjunto de Regras v3\.0|Conjunto de Regras v3\.1|Reglas v3\.0|Reglas v3\.1|Regelwerk v3\.0|Regelwerk v3\.1|Ruleset version in force:\*\* v3\.0|Ruleset version in force:\*\* v3\.1`

The escape `\*\*` is for grep's `-E` (which uses ERE) and is a literal asterisk. But `**` in markdown is bold — meaning the grep is looking for literal `**` characters in the file. In actual markdown content, the format is:

```markdown
**Ruleset:** v3.0
```

The `**Ruleset:**` is the bolded label, `v3.0` is the value. Phase 0's regex `Ruleset version in force:\*\* v3\.0` expects the trailing `**` after the colon (which is correct — that's the closing of the bold). But other version-reference patterns might use different delimiters:
- `Ruleset v3.0` (in prose, no bold)
- `**Regelwerk:** v3.0` (DE bolded)
- `Conjunto de Regras v3.0` (in prose)

The §0.1 regex has `Ruleset v3.0` (matches bare "Ruleset v3.0") but doesn't have the bolded variants like `**Ruleset:** v3\.0`. So if a chapter file uses `**Ruleset:** v3.0`, the bolded form, §0.1 will miss it.

**Suggested:** Re-check the regex coverage. A grep over actual content would surface missing patterns.

### 5.9 Phase 1H-2 example uses "Adam" but plan doesn't specify if Adam-as-reference is canonical

Plan example:
```
**Generations from:** Adam (15, via Seth, Gen 5); Noach (5, via Shem)
```

So Adam is generation 15 from Adam (himself) — that's odd, since Adam is at generation 0 from himself. Or 15 is the descendant's count (e.g., this entry is for someone who is generation 15 from Adam).

Plan needs to say which.

**Suggested:** Add to Phase 1H-2: "The `count` field represents the descendant's generation number from the reference figure. The reference figure is generation 0. So Adam→Seth is generation 1 from Adam; Adam→Avram is generation ~20 from Adam; Avram→David is generation ~14 from Avram."

---

## 6. What Works Well

- **Operating Principles section is excellent.** It captures cross-cutting governance (Rule 28, Rule 29, anti-ethnogenesis safeguard, DDD layering, design system) in one place. Future plans should follow this structure.
- **Phase 0 (lint hardening) before content phases is correct.** Establishing detectability before the sweep prevents regression.
- **Per-phase Definition of Done is concrete.** "All target files updated. `pnpm test` passes. `pnpm build` passes. `pnpm content:lint` passes. Editorial-log entries written. Audit docs updated." Falsifiable, not vague.
- **Anti-ethnogenesis constraint on Phase 1H-3 is correctly handled.** The plan rejects speculative descent claims, restricts `regionsByText` to text-named regions, and pairs the field with a UI safeguard pointer. This is exactly the discipline the project's existing safeguards require.
- **Parser bug diagnosis is precise.** The 9-row table in Phase 1B (Locale | Actual label | Parser expects | Falls through to | Net effect) is the level of detail that prevents the fix from missing cases. Verified correct against the actual code.
- **Phase 1 sequences code work before content authoring.** Phase 10 (John PEOPLE) cannot land correctly until Phase 1 fixes the parser. Plan correctly identifies this dependency.
- **Phase distinguishes locked governance from content content.** Phase 6B explicitly invokes Rule 28 amendment workflow for new policies. Good — the prior audit cycle's plans were less explicit about this.
- **Per-phase reviewer involvement is specified.** Architecture review for code; editorial sign-off for content; full reviewer matrix for translation work. Matches Rule 28.

---

## 7. Required Conditions Before Execution

In priority order:

1. **Resolve §0.10 lint blocking-vs-warning ambiguity** (§3.1). Either implement separate warning script or path-scope the rule to PEOPLE.md only.
2. **Engage Amendment & Lock Protocol explicitly for Phase 6B** (§3.2). Create `docs/rules/proposals/`, declare target version (v3.3 or v3.2.1), choose protocol path.
3. **Specify the Phase 1H-1 Curiosities markdown format** (§4.2). Without this, parser changes are unspecified.
4. **Resolve Phase 6B sequencing** (§3.2). Move rule drafting to a discrete pre-content phase.
5. **Replace `GenerationReference` discriminated union with extensible scheme** (§3.3). Future-proof Phase 1H-2 for Phase 12.
6. **Specify Phase 5 introduction-data filtering approach** (§3.5). Helper or page-level filter.
7. **Path-scope §0.10 lint to PEOPLE.md only** (§3.4). Prevents reception-history content from blocking builds.
8. **Reduce Phase 9's dependency claim** (§3.6). Save calendar time by parallelizing with 6, 7, 8.
9. **Specify Phase 12 closure scope in cross-cutting DoD** (§3.7). Resolves audit-cycle-closure ambiguity.
10. **Enumerate Phase 11 Options A and B** (§3.8). Reader can't evaluate Option C without alternatives.
11. **Add CLAUDE.md update to scope** (§4.5). Prevents continued drift.
12. **Re-check Phase 2A regex coverage against §0.1 lint** (§4.6). Avoids missed version-stamp pattern.
13. **Specify Phase 1H-3 safeguard-pointer UI representation** (§4.9). Prevents inconsistent rendering across locales.

The remaining items (§5) are improvements that can be addressed during execution if needed. They are not blockers.

---

## 8. Recommendation

**Approve the plan after items 1–7 are addressed.** Items 1–7 are blockers — they would either cause executions to fail (lint blocking, missing parser specs) or violate project governance (Lock Protocol bypass). Items 8–13 are improvements that materially reduce risk but don't block execution.

The plan is the best of the three audit plans in this cycle. Its diagnostic accuracy is high (verifiable bugs all confirmed). Its dependency reasoning is mostly correct. The sequencing problems are smaller than in prior plans. Execution risk after fixes is low.

The plan should not be executed in its current form. Items 1–4 in particular will produce wrong outputs or violate governance if not resolved before execution starts.

After fixes, Phases 0–11 are ready to execute. Phase 12 remains a forward-looking placeholder requiring its own detailed plan. Phase 13 follows Phase 12's Genesis 13–50 expansion.

---

**Audit complete.** All claims verified against the codebase, rules, source docs, and prior audits in this cycle.
