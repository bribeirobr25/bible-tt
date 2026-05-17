# Phase 9 — Book Context Page Content Cycle

**Status:** DRAFT (audit round 1 absorbed; ready for execution after step 9.3 project-lead decision)
**Drafted by:** claude-opus-4-7, 2026-05-14
**Source:** `docs/audit/FIX_IMPLEMENTATION.md` Phase 9 (lines 913–952 — "Topic 1, Option A"); `docs/audit/PENDING.md` (placeholder route at `/{locale}/{book}/context`); `docs/feedback/DEFERRED_TASKS.md` (priority queue item 2 post-Phase-8).
**Ruleset:** v3.3 (RULES-CORE.md §Rule 29 "Contextual and Comparative Study Material" governs motif-entry authoring; §Companion Pre-Submission Checklist applies; Rule 13 confidence labels mandatory).

---

## Audit revisions absorbed (2026-05-14, rounds 1 + PV + 2)

Independent audit at `docs/audit/archive/AUDIT_PHASE_9_PLAN.md` ran in two rounds plus a PV pass. Round 1 + PV flagged 1 critical, 3 significant, 5 minor concerns + 4 post-verification findings (all verified and absorbed below). Round 2 reviewed the revised plan, confirmed round-1 + PV absorption, and surfaced 1 new minor finding (R2.3 Unicode normalization in slug derivation) + captured project-lead Q1–Q5 decisions (R2.4).

### Round 2 additions

- **R2.1 (verification only — confirmed round-1 + PV absorption is correct).**
- **R2.2 (informational — Phase 8 Triage context).** Phase 8 chose Option A Maximal with 12 genuine-gap cells across 8 chapters; Genesis 2–12 cross-reference quote-blocks added as step 8.4a. Phase 9 motif work is consistent with and independent of this — no conflict.
- **R2.3 (NEW minor — APPLIED).** Slug derivation needs explicit Unicode normalization decision. §5.2.1 now specifies: titles are NFD-decomposed and stripped of non-ASCII combining characters before slugging (e.g., `ō` → `o`, `ā` → `a`). Test case 3 fixture for `## 3. *Anōthen*` updated with the concrete expected slug.
- **R2.4 (RESOLVED — project-lead Q1–Q5 decisions captured below).** Step 9.3 gate is now formally passed:
  - **Q1 = Medium** (~300 words, 2–3 paragraphs + source per entry)
  - **Q2 = Option A flat** (`motifs: BookContextMotif[]`)
  - **Q3 = Option A Canary** (Genesis EN canary → John+Matthew EN → locale mirrors)
  - **Q4 = Reuse `EnrichmentEntryCard`** (MotifCard deferred to Phase 9.5)
  - **Q5 = Path A** (restrict `BookContextMotif.claimType` to existing 8-member `ClaimType` union; semantic remap)
- **R2.5 (verification table update).** Editorial-log numbering claim flagged as "plausible but unverified" — defensive `verify at execution time` instruction in step 9.17 correctly handles this.

### Round 1 + PV (originally absorbed)

- **§3.1 (CRITICAL — build blocker) — APPLIED.** Verified: `ClaimType` in `src/domain/content/types.ts` is a strict 8-member union; `EnrichmentEntryCard` expects `EnrichmentEntry.claimType: ClaimType`. Plan's original `BookContextMotif.claimType: string` would fail TypeScript build. **Added Q5 to §6 decision gate; recommended Path A — restrict `BookContextMotif.claimType` to the existing `ClaimType` union with semantic remapping (STRUCTURAL → TEXTUAL, LINGUISTIC → TEXTUAL, TYPOLOGICAL → COMPARATIVE PARALLEL, NARRATIVE → STRONG INFERENCE).** PV.3 confirmed Path B would require +16 i18n entries × 4 locales = +64 i18n adds, reinforcing Path A.
- **§3.2 (SIGNIFICANT) — APPLIED.** Slug derivation algorithm documented in §5.2; test case 3 updated with concrete input/expected-output pair.
- **§3.3 (SIGNIFICANT) — PARTIALLY APPLIED.** Verified: `john.md` ends at J-023 (not J-021 as the audit assumed — Phase 8 added J-022, post-Phase-8 cleanup added J-023); `matthew.md` ends at M-020. The plan's J-024 + M-021 ARE correct given current state. But the audit's defensive recommendation ("verify last entry at execution time") is good practice — absorbed as a note to step 9.17.
- **§3.4 (SIGNIFICANT) — APPLIED.** Verified: `context-view.tsx` calls `sortByConfidence(section.entries)`. Plan now explicitly states in step 9.6 + §5.1 that `book-context-view.tsx` renders motifs in **authoring order** (no `sortByConfidence`).
- **§4.1 / PV.1 (SIGNIFICANT) — APPLIED.** Verified: §0.10 in `content-lint.sh` uses `$PEOPLE_FILES` hardcoded list. §0.1 + §0.2 already cover CONTEXT.md via `$CONTENT_DIRS` recursive scan. §0.7 + §0.8 are PEOPLE.md-specific patterns (`## The Transparent Translation` H2; `## Translit (Translit)` collision) that don't apply to CONTEXT.md's `## N. Motif title` format. Step 9.17 now includes the §0.10 `$CONTEXT_FILES` extension.
- **§4.2 (SIGNIFICANT) — APPLIED.** "Hour has not yet come — Jn 2, 7+" illustrative motif fixed: `chapters[]` restricted to authored range (Jn 2); forward-trajectory references moved to body text per §5.1 documented convention.
- **§5.1 (MINOR) — APPLIED.** Step 9.6 clarifies: reference `context-view.tsx` for `EnrichmentEntryCard` usage pattern only; do NOT mirror its section-grouping, `<details>` accordion, or confidence-sort structure.
- **§5.2 (MINOR) — APPLIED.** §4.2 diagnostic now notes: grep detects only `### A{N}.` numbered §A entries; unnumbered entries require supplementary manual scan.
- **§5.3 / PV.4 (MINOR) — APPLIED.** Step 9.4 pre-check now runs `pnpm test` to record actual baseline. Verified at audit time: baseline is still 801 (Phase 11.5 i18n shipped but no parser tests were added beyond the existing 801).
- **§5.4 / PV.2 (MINOR) — APPLIED.** Verified: `nav.bookContext` + `nav.bookContextDescription` + `nav.comingSoon` keys all exist in en.json. Step 9.8 now distinguishes NEW motif-specific keys (`bookContext.disclaimer`, `bookContext.chapters`, etc.) from existing nav keys.
- **§5.5 (MINOR) — APPLIED.** §8 conventions document that motif body text is rendered as markdown via `renderMarkdownSafe`; explicit guidance on `*italics*`, `**bold**`, em-dash, and the absence of `[text](url)` link rendering.

Approval condition from audit §8 met: items 1–5 (critical + 4 significant) and 6–7 (minor improvements) all addressed.

---

## 1. Goal (one sentence)

Replace the **"Content coming soon"** placeholder at `/{locale}/{book}/context` (currently rendered by `src/app/[locale]/[book]/context/page.tsx`) with a populated **Book Context** page that surfaces **cross-chapter motifs** within each authored book (Genesis 1–12, John 1–3, Matthew 1–3) across all 4 locales — patterns that span multiple chapters and that the per-chapter Context view-mode cannot meaningfully surface.

---

## 2. Why a plan (not just authoring)

Phase 9 differs from prior content-authoring phases (Phase 7 readability sweep, Phase 8 Section I, Phase 10 PEOPLE.md, Phase 11 prophecy) in **three structurally significant ways** that warrant pre-decision:

1. **New domain type + parser + UI component.** Phase 9 introduces `BookContextData` (a new domain type), `book-context-parser.ts` (a new parser with its own test suite), `book-context-view.tsx` (a new UI component), and replaces the placeholder page. Prior phases only added content within existing parsers (markdown, enrichment, prophecy, people, introduction). This is the largest infrastructure-touching phase since Phase 1.

2. **No prior content model exists to mirror.** Phase 7/8/10/11 mirrored existing patterns (companion files, PEOPLE.md, prophecy files). Book Context is a **novel surface** — the data model, the file structure, and the UI conventions are all decisions to make in this phase.

3. **Cross-chapter motif selection is editorial judgment, not mechanical extraction.** A "motif" here is a thematic, linguistic, structural, or narrative pattern that recurs across two or more chapters and that benefits from being read **as a pattern** rather than chapter-by-chapter. Examples (illustrative — actual selections at step 9.2): the *toledot* (Hebrew: *תּוֹלְדוֹת*, "generations") spine in Genesis; the *eretz* (Hebrew: *אֶרֶץ*, "earth"/"land") semantic shift across Genesis 1–12; the seven signs schema in John 1–3+; the fulfillment-formula sequence in Matthew 1–3. Selecting the right motifs is the highest-leverage editorial decision in this phase; doing it poorly produces low-value content.

A plan is needed because the **scope decisions (Q1–Q4 in §6)** materially shape every subsequent step. Without them, the executor has no basis for deciding whether to author 4 motifs or 12, whether to mirror `EnrichmentData` schema or invent a new one, whether to canary on one book or fan out across all three.

---

## 3. Scope

### In scope (3 books × 4 locales = 12 new content files + 1 parser + 1 UI + 1 page rewrite)
- **Content:** `content/{en,pt-br,de,es}/{genesis,john,matthew}/CONTEXT.md` — 12 files total.
- **Domain type:** `BookContextData` + `BookContextMotif` in `src/domain/content/types.ts`.
- **Parser:** `src/infrastructure/content/book-context-parser.ts` with companion test file (≥ 8 cases per spec).
- **Repository:** extend `src/infrastructure/content/fs-content-repository.ts` with `readBookContext(locale, book)` and `src/lib/content-loader.ts` with `getBookContextData(locale, book)`.
- **UI component:** `src/ui/enrichment/book-context-view.tsx` reusing `EnrichmentEntryCard` (per FIX_IMPLEMENTATION.md spec, Phase 9 implementation step 5).
- **Page replacement:** `src/app/[locale]/[book]/context/page.tsx` — replace the "coming soon" stub with `<BookContextView data={data} />`.
- **i18n labels:** new keys in `src/infrastructure/i18n/messages/{en,pt-br,de,es}.json` for "Cross-chapter motifs", section headings, etc.
- **Tests:** ≥ 8 parser tests as required by FIX_IMPLEMENTATION.md.

### Per-book motif targets (from FIX_IMPLEMENTATION.md §Per-book targets)

| Book | Chapters authored | Motif targets |
|------|-------------------|---------------|
| Genesis | Gen 1–12 | **8–12 motifs** |
| John | Jn 1–3 | **4–6 motifs** |
| Matthew | Mt 1–3 | **4–6 motifs** |

Targets revisited as books expand (Phase 12 Genesis 13–50 likely surfaces 5–8 additional motifs; those land in a follow-up content edit, not Phase 9).

### Out of scope (deliberately deferred)
- **`/{locale}/books` (book index) redesign.** Phase 9 only fills the `context` sub-route; the book landing page is unchanged.
- **Cross-book motifs** (patterns spanning Genesis + John + Matthew, e.g., creation-fall-redemption typology). These belong in a future cross-book-context surface (Phase 13 candidate); per-book CONTEXT.md is the scope here.
- **Motif backfill for Phase 12 books.** When Genesis 13–50 is authored, the Genesis CONTEXT.md is amended; that's Phase 12's responsibility, not Phase 9.
- **Editorial-log motif catalog.** Some motifs are documented in scattered editorial-log entries (e.g., genesis.md entries on *toledot* renderings); Phase 9 may cite these as cross-references but does not aggregate them into a new editorial-log surface.
- **Per-motif scholarly-source review.** Sources cited within motif entries follow Rule 29's source-provenance hygiene (PEER-REVIEWED / ACADEMIC POPULAR / POPULAR / PRIMARY); a separate audit of every cited source for currency/access is not in Phase 9 scope.
- **UI navigation changes.** The `/{locale}/{book}/context` route already exists in the nav (book landing page links to it); the link target was a placeholder until now. No new navigation edges added.

---

## 4. Motif-selection methodology (step 9.2)

### 4.1 Three input sources for motif candidates

For each book, motif candidates are drawn from three sources, in order of priority:

1. **Existing editorial-log entries that codify cross-chapter patterns.** E.g., `genesis.md` has entries on *toledot* renderings, the *eretz* semantic shift, the Cain-Abel/Sarah-Hagar typology, etc. These are pre-vetted by the project lead and represent decisions already made.
2. **Recurring §A (source-text features) entries across multiple chapter companions.** When the same source-text feature is discussed in 2+ chapter companions, it's a candidate cross-chapter motif. E.g., "creation-by-speech" appears in Gen 1, 2, 3, 8 companions; "anōthen double-meaning" appears in Jn 3 companion + alluded in Jn 1.
3. **Recurring §F (later reception) or §H (sources) cross-chapter threads.** When the same scholar / commentary is cited across multiple chapters within a book, that's an interpretive frame — but typically too source-driven for a motif entry; deprioritized.

### 4.2 Diagnostic command (step 9.1 prep)

```bash
# For each book, find cross-chapter recurrence of A-section subentries
for book in genesis john matthew; do
  for ch in content/en/$book/study/CHAPTER-*-CONTEXT.md; do
    grep -E "^### A[0-9]+\\." "$ch" | sed 's/^### //'
  done | sort | uniq -c | sort -rn | head -20
done
```

The diagnostic produces a frequency table of recurring §A entries within each book. Entries with count ≥ 2 are motif candidates; entries with count ≥ 3 are strong motif candidates.

**Caveat (per audit §5.2):** The grep detects only `### A{N}.` numbered §A entries. Any unnumbered §A entries using the template form `### [Topic title]` (without `A1.` prefix) are not detected by this diagnostic. A supplementary manual scan of §A section bodies for cross-chapter thematic recurrence is recommended at step 9.1 — this is a 5-minute supplementary read across all 18 authored chapter companions, not a separate workstream.

### 4.3 Diagnostic artifact

Output: `docs/audit/archive/PHASE_9_MOTIF_CANDIDATES.md` containing:
- Per book: ranked list of cross-chapter recurrence candidates
- Per candidate: chapters of occurrence + brief notes on whether the pattern is structurally significant or incidental
- Recommended motif selection per book (8–12 for Genesis, 4–6 for John, 4–6 for Matthew)

This artifact gates the project-lead decision in §6.

### 4.4 Illustrative motif candidates (subject to step 9.2 confirmation)

These are illustrative only — actual selections happen at step 9.2 after the diagnostic produces the candidate list. Format is `[Book] [Working title] — [chapters where it recurs] — [confidence: structural / narrative / linguistic / typological]`.

**Genesis (8 illustrative; target 8–12):**
- Gen — *Toledot* spine — Gen 2:4, 5:1, 6:9, 10:1, 11:10, 11:27 — structural
- Gen — *Eretz* semantic shift — Gen 1, 2, 6, 9, 12 — linguistic
- Gen — Creation-by-speech vs. creation-by-action — Gen 1, 2 — structural
- Gen — Divine name alternation (Elohim / YHWH / YHWH Elohim) — Gen 1–2, 4, 6–9 — linguistic
- Gen — Flood-as-uncreation parallel structure — Gen 1 ↔ Gen 7–8 — typological
- Gen — Cain → Lamekh escalation pattern — Gen 4 — narrative (intra-chapter; borderline)
- Gen — Cursed-ground motif — Gen 3, 4, 5, 8 — linguistic
- Gen — Wife-sister episodes (Avraham + Sarai, Yitschak + Rivkah-to-come) — Gen 12 — narrative (forward-pointer)

**John (4 illustrative; target 4–6):**
- Jn — The *semeion* (sign) sequence — Jn 2:1–11, 4:46–54+ — narrative (Jn 2 first; forward-pointers)
- Jn — *Anōthen* / "born from above" double meaning — Jn 3, alluded Jn 1 — linguistic
- Jn — Light / darkness contrast — Jn 1, 3 — typological
- Jn — Water / spirit / rebirth motif — Jn 1, 2, 3 — typological
- Jn — "Hour has not yet come" — Jn 2 — narrative (forward-trajectory through Jn 7, 12, 17 mentioned in body text per §5.1 forward-trajectory convention)

**Matthew (4 illustrative; target 4–6):**
- Mt — Fulfillment-formula sequence — Mt 1:22, 2:5–6, 2:15, 2:17–18, 2:23, 3:3 — structural
- Mt — Son-of-David genealogical claim — Mt 1:1, 1:6, 1:17 — structural
- Mt — Magi → flight → return three-act arc — Mt 2 — narrative
- Mt — Yeshua-as-Mosheh typology (Egypt sojourn) — Mt 2:13–15 — typological

---

## 5. Domain type + parser schema decision (step 9.3)

### 5.1 BookContextData shape (Path A — uses existing ClaimType union per audit §3.1)

```typescript
// In src/domain/content/types.ts
export interface BookContextData {
  book: string;
  locale: string;
  motifs: BookContextMotif[];
}

export interface BookContextMotif {
  slug: string;              // auto-derived from title; see §5.2 derivation algorithm
  title: string;             // e.g., "Toledot spine"
  claimType: ClaimType;      // existing 8-member union — see semantic-remap table below (audit §3.1 Path A)
  confidence: ConfidenceLevel; // existing union (VERIFIED | PROBABLE | POSSIBLE | UNCERTAIN); Rule 29 extended schema (DOCUMENTED, SPECULATIVE) absorbed via parser
  chapters: number[];        // ONLY chapters within currently-authored range where the motif substantively appears
  body: string;              // markdown body rendered via renderMarkdownSafe (see §8 conventions)
  source?: string;           // optional, mirrors EnrichmentEntry.source field naming
}
```

**Semantic remap table** for motif categories that don't map 1:1 to existing `ClaimType` members (audit §3.1 Path A resolution):

| Motif category | Maps to ClaimType | Rationale |
|----------------|------------------|-----------|
| Structural (e.g., toledot spine, fulfillment formula sequence) | `TEXTUAL` | Structural features of the source text |
| Linguistic (e.g., *eretz* semantic shift, divine-name alternation) | `TEXTUAL` | Language-level features of the source text |
| Typological (e.g., flood-as-uncreation, Yeshua-as-Mosheh) | `COMPARATIVE PARALLEL` | Cross-text interpretive pattern |
| Narrative (e.g., Cain → Lamekh escalation, Magi three-act arc) | `STRONG INFERENCE` | Inferred from narrative structure |
| Historical / Archaeological | `HISTORICAL / ARCHAEOLOGICAL` | Direct map |
| Later reception | `LATER RECEPTION` | Direct map |

The semantic granularity is lower than originally proposed but the display is consistent with the rest of the app, and the data layer requires zero changes to `ClaimType`, `CLAIM_COLORS`, `CLAIM_TYPE_KEYS`, `enrichment-entry.tsx`, or `parseClaimType()`. The 4 motif-category labels (Structural, Linguistic, Typological, Narrative) MAY still appear in motif body text as descriptive prose; they just don't drive the typed badge.

**Forward-trajectory references** (audit §4.2): The `chapters: number[]` field strictly records authored chapters where the motif substantively appears. Forward-trajectory notes ("this motif develops further in Jn 7, 12, 17 — to be addressed when those chapters are authored") belong in the motif body text, NOT in the chapters array.

### 5.2 CONTEXT.md file structure (proposed)

```markdown
# {Book} — Book Context

**Book:** {Book}
**Language:** {Locale}
**Scope:** Cross-chapter motifs in {Book} {chapter range}
**Ruleset:** v3.3 (Rule 29 governs this file)
**Status:** provisional

---

> **About this surface:** This page surfaces patterns that span multiple chapters within {Book} — patterns that recur, build, or transform across the narrative. For per-chapter world-context (Section I), see each chapter's Context companion. For people and genealogies, see the People page. For prophecies, see the Prophecy view.

---

## 1. {Motif title}
**[CLAIM TYPE — CONFIDENCE]**
**Chapters:** {N1}, {N2}, {N3}

{Body paragraph(s)}

**Source:** {citation(s)}

---

## 2. {Next motif} ...
```

The H2-per-motif structure differs from `enrichment-parser.ts` ENTRY_HEADER (`/^### (.+)$/` H3-only). For Book Context, since each motif is a top-level concept (not nested under a section), **H2 per motif is the correct level**. This means the parser uses `/^## (.+)$/` for motif headers, skipping the page-level H1 (`# {Book} — Book Context`).

### 5.2.1 Slug derivation algorithm (per audit §3.2 + round-2 R2.3)

Slugs are auto-derived from motif H2 titles using the following deterministic algorithm:

1. Take the H2 line content after the `## ` prefix (e.g., `1. Toledot spine`).
2. Strip the leading `N. ` index prefix (regex: `^\d+\.\s*`).
3. Strip markdown emphasis markers: `*`, `_`, `**`, `__`.
4. Strip parenthesized content (regex: `\s*\([^)]*\)\s*`).
5. **Unicode-normalize to ASCII (per round-2 R2.3):** apply NFD decomposition (`string.normalize('NFD')`), then strip combining-diacritic characters (`replace(/[̀-ͯ]/g, '')`). This deterministically maps `ō` → `o`, `ā` → `a`, `é` → `e`, etc. — avoiding Unicode collation surprises in the test runner and ensuring portable React `key` values across all execution environments.
6. Lowercase the remainder.
7. Replace any sequence of non-alphanumeric characters with a single `-` hyphen.
8. Trim leading/trailing hyphens.

Examples (concrete fixtures pinned for parser test case 3):
- `## 1. Toledot spine` → `toledot-spine`
- `## 2. The *eretz* semantic shift` → `the-eretz-semantic-shift`
- `## 3. *Anōthen* / "born from above" double meaning` → `anothen-born-from-above-double-meaning` (Unicode `ō` normalized to `o` per step 5)
- `## 4. "Hour has not yet come" (motif)` → `hour-has-not-yet-come` (parenthesized "(motif)" stripped at step 4)

**Collision policy:** Slugs serve only as React `key` values, not URL fragments. Collisions are low-risk and handled by the parser appending `-2`, `-3` suffixes to duplicates. The collision-handling logic is a parser-test case (test case 11 added — see §5.3).

### 5.3 Parser test cases (≥ 8 per spec, expanded per audit §3.2)

1. Parses a file with 1 motif correctly
2. Parses a file with multiple motifs correctly
3. Extracts slug from heading per §5.2.1 algorithm. Concrete fixture: input `## 2. The *eretz* semantic shift` → expected slug `the-eretz-semantic-shift`. Second fixture: `## 1. Toledot spine` → `toledot-spine`.
4. Extracts claim-type + confidence from `[CLAIM TYPE — CONFIDENCE]` line — only the 8 existing `ClaimType` union members are accepted; invalid claim types default to `TEXTUAL` with a parser warning logged.
5. Extracts chapter list from `**Chapters:** N, N, N` line (or per-locale equivalent: `**Capítulos:**`, `**Kapitel:**`).
6. Handles missing optional `**Source:**` / `**Fonte:**` / `**Quelle:**` / `**Fuente:**` line.
7. Handles markdown emphasis (italics, bold) in body — body string preserves the markdown syntax for later rendering by `renderMarkdownSafe`.
8. Returns null for missing/unreadable file (graceful degradation; matches existing `readPeople` / `readProphecy` pattern).
9. Skips disclaimer quote-block (`> **About this surface:** ...`) as non-motif content.
10. Preserves order of motifs as written (authoring order, NOT confidence-sorted; per audit §3.4).
11. Slug collision handling: two motifs whose titles produce identical slugs receive `-2`, `-3` suffixes on the duplicates.

---

## 6. Project-lead decision point (step 9.3) — RESOLVED per round-2 R2.4

All five Q-decisions were captured at audit round 2 (see "Audit revisions absorbed" block at top of plan):

| Q | Decision | Result |
|---|----------|--------|
| Q1 — Authoring depth | **Medium** | ~300 words, 2–3 paragraphs + source per entry; matches existing §A companion depth |
| Q2 — Schema | **Option A flat** | `motifs: BookContextMotif[]`; no section grouping at 8–12 motifs |
| Q3 — Execution scope | **Option A Canary** | Genesis EN canary → John+Matthew EN → locale mirrors; ~32–47h |
| Q4 — UI component | **Reuse `EnrichmentEntryCard`** | MotifCard deferred to Phase 9.5 |
| Q5 — `claimType` resolution | **Path A** | Restrict `BookContextMotif.claimType` to existing 8-member `ClaimType` union with semantic remap (§5.1); zero changes to `ClaimType`, `CLAIM_COLORS`, `CLAIM_TYPE_KEYS`, `parseClaimType()`, or i18n files |

**Step 9.3 gate is now formally passed.** Execution proceeds to step 9.4 (domain type + parser + tests).

The original decision-gate question text is preserved below for traceability / reference; each Q section's `(recommended)` option is the one selected at R2.4.

### Q1 — Authoring depth per motif entry
- **Light:** 1 paragraph + claim-type/confidence label + chapter list. ~150 words/entry. Faster to author and translate; smaller payload; risk of feeling thin compared to chapter companions.
- **Medium (recommended):** 2–3 paragraphs + claim-type/confidence + chapter list + 1 cross-reference per chapter + optional `**Source:**` line. ~300–400 words/entry. Comparable depth to a chapter companion §A entry.
- **Heavy:** 4–6 paragraphs + full Rule 29 dual-label schema + sources + cross-references to related editorial-log entries. ~600–800 words/entry. Closest to a §B comparative-religion entry; high authoring + translation cost.

**Recommendation: Medium.** Matches the depth of existing §A entries that the page draws candidates from; faster than Heavy without feeling thin.

### Q2 — Schema choice
- **Option A (recommended): flat motif list** per `BookContextData = { motifs: BookContextMotif[] }` above.
- **Option B: section-grouped** like `EnrichmentData = { sections: [...] }`. Sections might be "Structural", "Narrative", "Linguistic", "Typological".

**Recommendation: Option A (flat).** With only 8–12 motifs per book, grouping adds visual clutter without information gain. Each motif already carries a `claimType` field that conveys category (structural/narrative/linguistic/typological).

### Q3 — Execution scope (canary vs. maximal)
- **Option A (Canary + propagation, recommended):** Author Genesis EN first as canary; verify rendering + content quality; THEN John EN + Matthew EN; THEN locale propagation. Estimate: 6–10h Genesis EN; 4–6h Jn+Mt EN; 2–3h per locale × 3 locales × 3 books = 18–27h locale propagation; +4–6h code/parser/UI. **Total: ~32–49h.**
- **Option B (Maximal — all 3 books EN at once, then locale fan-out):** Higher cognitive load; risk of inconsistent quality across books; comparable total effort. **Total: ~40–55h.**
- **Option C (Genesis-only this phase, defer John+Matthew to a follow-up):** Reduces commitment; lights up Book Context for Genesis only. Books not authored show the existing "Coming soon" placeholder (graceful degradation via repository returning null). **Total: ~20–28h.**

**Recommendation: Option A (Canary + propagation).** Genesis is the right canary (most chapters → richest motif material; project lead is most familiar with the content).

### Q4 — UI component approach
- **Reuse `EnrichmentEntryCard` directly (recommended):** Each motif renders as an enrichment card with title + claim-type/confidence chips + body. Per FIX_IMPLEMENTATION.md spec. Combined with Q5 Path A, the motif → enrichment-entry adapter is a trivial object shape transformation.
- **Create new `MotifCard` variant:** Allows motif-specific affordances (e.g., a "Chapters" badge linking to each chapter where the motif appears). Higher code cost; deferrable.

**Recommendation: Reuse `EnrichmentEntryCard`.** Defer `MotifCard` to a Phase 9.5 if reader feedback requests chapter-link affordances.

### Q5 — `claimType` resolution (NEW per audit §3.1 critical finding)

`EnrichmentEntryCard` requires `EnrichmentEntry.claimType: ClaimType` (strict 8-member union). The original plan's `BookContextMotif.claimType: string` with motif-specific values ("STRUCTURAL", "LINGUISTIC", "TYPOLOGICAL", "NARRATIVE") would NOT type-check against `ClaimType` and would block `pnpm build`.

- **Path A (recommended): Restrict `BookContextMotif.claimType` to the existing `ClaimType` union with semantic remapping** (see §5.1 remap table). Zero changes to `ClaimType`, `CLAIM_COLORS`, `CLAIM_TYPE_KEYS`, `parseClaimType()`, or i18n message files. Lowest friction.
- **Path B: Extend `ClaimType` with 4 new members** (STRUCTURAL, LINGUISTIC, TYPOLOGICAL, NARRATIVE). Requires editing `types.ts`, `enrichment-entry.tsx` (×2 records), `enrichment-parser.ts` (4 dispatch branches), and 4 i18n files × 4 new keys each = +16 new i18n entries. Larger code change; the 4 new claim types only apply to Book Context motifs and would clutter the chapter-Context UI's claim-type vocabulary.
- **Path C: Create a new `MotifCard` component** that accepts `BookContextMotif` directly. Avoids the type-system mismatch but requires duplicating the visual design of `EnrichmentEntryCard`. Higher code cost; defers the claim-type vocabulary decision.

**Recommendation: Path A.** Per audit PV.3, Path B would add +16 i18n entries × 4 locales for a vocabulary distinction that the semantic remap (§5.1 table) handles adequately. Path C splits the design surface unnecessarily for a small content type.

---

## 7. Execution sequence (post-decision)

Sequencing assumes **Q3 = Option A Canary + propagation**, **Q1 = Medium**, **Q2 = flat**, **Q4 = reuse**, **Q5 = Path A** (audit §3.1 critical finding).

| Step | Action | Owner | Est. (h) |
|------|--------|-------|---------|
| **9.1** | Generate motif-candidate diagnostic → `docs/audit/archive/PHASE_9_MOTIF_CANDIDATES.md`. | Claude | 1.5 |
| **9.2** | Project-lead review of motif-candidate diagnostic; finalize motif list per book. | Project lead | (gated) |
| **9.3** | ~~**Project-lead decision** on Q1 + Q2 + Q3 + Q4 + Q5.~~ **RESOLVED 2026-05-15 per audit round-2 R2.4** — see §6 decisions table. | Project lead | done |
| **9.4** | **Code: domain type + parser + tests.** Pre-check: `pnpm test` to record current baseline (per audit §5.3). Land `BookContextData` + `BookContextMotif` in `domain/content/types.ts` per §5.1 (Q5 Path A — `claimType: ClaimType`). Author `book-context-parser.ts` with ≥ 8 test cases (§5.3 expanded list). Verify parser tests pass + actual count = baseline + ≥ 8 before any content is authored. | Claude | 3–4 |
| **9.5** | **Code: repository + content-loader.** Extend `fs-content-repository.ts` with `readBookContext()`; extend `content-loader.ts` with `getBookContextData()`. Type-checks pass. | Claude | 1 |
| **9.6** | **Code: UI component.** Author `book-context-view.tsx`. Reference `context-view.tsx` for `EnrichmentEntryCard` usage pattern ONLY — do NOT mirror its section-grouping, `<details>` accordion, or `sortByConfidence` call (per audit §3.4 + §5.1). Motifs render in **authoring order** as written in CONTEXT.md. Simple adapter: `<EnrichmentEntryCard entry={{ title, claimType, confidence, content: body, source }} />`. Storybook-style local test with a fixture. | Claude | 1.5 |
| **9.7** | **Code: page replacement.** Replace placeholder in `app/[locale]/[book]/context/page.tsx` with `BookContextView`. Handle missing-data fallback ("Coming soon" preserved for books without CONTEXT.md). | Claude | 0.5 |
| **9.8** | **Code: i18n.** Add NEW motif-specific keys to 4 locale message files: at minimum `bookContext.disclaimer` (the about-this-surface text) and `bookContext.chapters` (label for the chapter list); add any additional labels needed by `book-context-view.tsx`. Existing keys `nav.bookContext`, `nav.bookContextDescription`, `nav.comingSoon` already exist and stay unchanged (per audit §5.4 / PV.2). Type-check passes. | Claude | 0.5 |
| **9.9** | **Content: Genesis EN canary.** Author `content/en/genesis/CONTEXT.md` with 8–12 motifs. Verify in dev server. | Claude | 5–7 |
| **9.10** | **Canary verification: visual smoke + lint + tests + build.** Project-lead checkpoint after Genesis EN canary lands — confirm reader experience is good before fanning out. | Claude → project lead | 0.5 + (gated) |
| **9.11** | **Content: John EN + Matthew EN.** Author 4–6 motifs per book per FIX_IMPLEMENTATION.md target. | Claude | 4–6 |
| **9.12** | **Content: PT-BR mirror (3 books).** | Claude | 5–7 |
| **9.13** | **Content: DE mirror (3 books).** | Claude | 5–7 |
| **9.14** | **Content: ES mirror (3 books).** | Claude | 5–7 |
| **9.15** | **Cross-locale integrity sweep.** Motif-count parity per book × locale; source-list parity; chapter-list parity. | Claude | 1 |
| **9.16** | **Visual smoke + integration audit.** All 12 routes × `/{locale}/{book}/context` HTTP 200; motifs render with confidence chips; cross-references resolve. | Claude | 1 |
| **9.17** | **Editorial-log entries + content-lint update + meta-doc sync.** Editorial-log entries: Genesis anchor (verify last entry ID in `docs/editorial-log/genesis.md` at execution time, then increment — current state ends at `2026-05-14-103`); John (verify last entry ID — current state ends at J-023, so next is J-024); Matthew (verify last — current state ends at M-020, so next is M-021). **Content-lint update (per audit §4.1 / PV.1):** add a new `$CONTEXT_FILES` variable to `scripts/content-lint.sh` listing all 12 `content/{locale}/{book}/CONTEXT.md` paths; extend §0.10 (modern-mapping smell-test) `check_pattern_warn` to also scan `$CONTEXT_FILES`. §0.1 + §0.2 already cover CONTEXT.md via `$CONTENT_DIRS` recursive scan — no change. Meta-doc sync (CLAUDE.md verified-state date + Phase 9 closure; PENDING.md Phase 9 → RESOLVED; DEFERRED_TASKS.md priority queue updated; FIX_IMPLEMENTATION.md Phase 9 closure note). | Claude | 1.5 |

**Total: ~32–47h** (Option A Canary).

---

## 8. Translation + content conventions

Same conventions established in prior phases:

- **Rule 13 confidence labels** on every motif entry: `[CLAIM TYPE — CONFIDENCE]`. Extended Rule 29 schema applies (VERIFIED / PROBABLE / POSSIBLE / DOCUMENTED / SPECULATIVE).
- **Rule 29 source provenance** on every entry that cites a source: PEER-REVIEWED / ACADEMIC POPULAR / POPULAR / PRIMARY. POPULAR sources only for documenting *how* a tradition reads a passage (LATER RECEPTION).
- **Grandmother-test glossing** per Phase 7. Technical terms (e.g., *toledot*, *anōthen*, fulfillment-formula, typology) glossed parenthetically on first use within each motif entry.
- **Em-dash convention** per Phase 6.6A: `—` not ` -- `; en-dash `–` for numeric ranges; chapter ranges use en-dash (`Gen 1–12`).
- **Transliteration tables** per RULES-HB / RULES-GS locked tables. *Toledot*, *eretz*, *YHWH*, *Yeshua*, *Mosheh*, etc. — all follow the locked forms.
- **Locale field-keys.** EN uses `**Chapters:**`, PT-BR `**Capítulos:**`, DE `**Kapitel:**`, ES `**Capítulos:**`. Parser alias dictionary must cover all 4.
- **Markdown rendering of motif body (audit §5.5):** `EnrichmentEntryCard` renders `entry.content` via `dangerouslySetInnerHTML={{ __html: renderMarkdownSafe(entry.content, "note") }}`. Motif body text (the `body` field, mapped to `content` via the §9.6 adapter) is therefore rendered with markdown — `*italics*` and `**bold**` render correctly. Em-dash convention applies. **Do NOT use markdown link syntax `[text](url)`** — `renderMarkdownSafe` does not render links; the text would appear as literal `[text](url)` to readers. Cross-references to chapters should use plain text like "see Gen 4 §A2" rather than markdown links.

---

## 9. Optional content-lint rule (decide at step 9.17)

Adding a content-lint rule for CONTEXT.md presence is **possible but lower priority**:

- **§0.12 candidate:** for each book that has `CHAPTER-1.md` authored, fail if `CONTEXT.md` doesn't exist per locale.
- **Trade-off:** Phase 12 (Genesis 13–50) will trigger CONTEXT.md amendments; if a transient state during Phase 12 authoring lacks CONTEXT.md, the lint would block. Could be addressed with a more nuanced rule (CONTEXT.md must exist if `book has ≥ N chapters authored`) but adds complexity.

**Recommendation:** defer to step 9.17. The phase's primary success metric is rendered content quality, not lint enforcement.

---

## 10. Definition of Done

- [ ] **9.1 motif-candidate diagnostic landed** at `docs/audit/archive/PHASE_9_MOTIF_CANDIDATES.md`.
- [ ] **9.2 motif list finalized** per book by project lead (8–12 Genesis, 4–6 John, 4–6 Matthew).
- [ ] **9.3 project-lead decision** captured for Q1 + Q2 + Q3 + Q4 in plan-front "Audit revisions absorbed" block.
- [ ] **9.4–9.8 code infrastructure landed:** `BookContextData` + `book-context-parser.ts` + ≥ 8 parser tests pass; `readBookContext()` + `getBookContextData()`; `book-context-view.tsx` reusing `EnrichmentEntryCard`; `context/page.tsx` rendering data with "Coming soon" fallback when data is null; i18n keys in all 4 locales.
- [ ] **9.9–9.10 Genesis EN canary** authored + visual-smoke-verified + project-lead checkpoint passed.
- [ ] **9.11 John + Matthew EN** authored to motif targets.
- [ ] **9.12–9.14 PT-BR + DE + ES** mirrored for all 3 books.
- [ ] **9.15 Cross-locale parity:** motif count per book × locale matches; chapter lists match; source lists match.
- [ ] **9.16 Visual smoke:** HTTP 200 across 12 routes (4 locales × 3 books); motif cards render; confidence chips visible; chapter lists displayed; no broken cross-references.
- [ ] **9.17 Closure:** editorial-log entries created (Genesis anchor + John/Matt sisters); meta-doc sync (CLAUDE.md verified-state date + Phase 9 closure; PENDING.md Phase 9 → RESOLVED; DEFERRED_TASKS.md priority queue updated; FIX_IMPLEMENTATION.md Phase 9 closure note); optional content-lint rule decision recorded.
- [ ] `pnpm test` passes (parser test suite +≥ 8 tests; total 801 + 8 = 809+).
- [ ] `pnpm content:lint` passes.
- [ ] `pnpm build` succeeds.

---

## 11. Risks + mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Motif selection feels arbitrary or unprincipled | Medium | High | The 3-input prioritization in §4.1 (editorial-log entries → recurring §A entries → recurring §F/H threads) anchors selection in pre-existing project-lead-vetted decisions, not free invention. |
| Authored entries duplicate existing §A entries in chapter companions | High | Medium | Each motif entry's body should explicitly say what's NEW vs. what readers can find in chapter X §A-N; cross-reference rather than duplicate. The "what's new about reading across chapters" angle is the value-add. |
| Parser test count + complexity grows the test suite significantly | Low | Low | 8 tests is a small increment to 801 existing tests; the parser is simpler than enrichment-parser (no section taxonomy) so test scope is bounded. |
| Locale propagation drift (PT-BR/DE/ES diverge from EN in motif count or content) | Medium | Medium | Phase 7/10 mirror-then-integrity-sweep pattern: EN canary then integrity sweep at step 9.15. Each locale mirrors EN sentence-for-sentence with translation only. |
| Rendering regression — Book Context page breaks existing book landing nav | Low | Medium | The page replacement happens at step 9.7 with a `data === null` fallback to the existing "Coming soon" UI. Books without CONTEXT.md render exactly as today. |
| Cross-reference chapter links lead to non-existent chapters (e.g., Gen 13 referenced before Gen 13 is authored) | Medium | Medium | Per §3 out-of-scope, motif entries cite ONLY chapters within the currently-authored range (Gen 1–12, Jn 1–3, Mt 1–3). Phase 12 will amend CONTEXT.md as Gen 13–50 authoring lands. |
| `BookContextData` schema chosen at Q2 turns out to be a poor fit after authoring 8 motifs | Low | High | The canary checkpoint at step 9.10 surfaces schema issues before the locale propagation commits to 8 more books × 3 locales = 24 file translations. If schema needs revision, only Genesis EN needs re-authoring. |

---

## 12. Out of scope (deliberately deferred)

- **Cross-book motif surface** (e.g., creation-fall-redemption typology spanning Genesis + John + Matthew). Phase 13 candidate.
- **Phase 12 Genesis 13–50 motif additions.** Phase 12 amends CONTEXT.md as new chapters land.
- **Reader-facing chapter-link affordances on motif cards** (e.g., clickable chapter chips). Phase 9.5 candidate based on reader feedback.
- **Search / filter UI for motifs** (e.g., filter by claim-type, by chapter). Phase 9.5 candidate.
- **Editorial-log motif catalog** (a separate `docs/editorial-log/motifs.md`). Phase 13 candidate — duplicates the CONTEXT.md content surface without adding value.
- **Auto-generation of motif candidates from §A entries** (a script that detects recurring §A titles). Phase 9.1 uses a manual grep + judgment workflow; automation is a Phase 9.5 candidate.
- **Per-motif scholarly-source re-verification.** Sources cited follow Rule 29 provenance hygiene; a separate sources audit is not in scope.

---

## 13. Status

- [x] Plan drafted (this document)
- [x] Independent audit absorbed — round 1 + PV (`docs/audit/archive/AUDIT_PHASE_9_PLAN.md`; 1 critical + 3 significant + 5 minor + 4 PV findings all verified + applied)
- [x] Independent audit absorbed — round 2 (R2.3 Unicode normalization in §5.2.1 + R2.4 Q1–Q5 decisions captured; see "Audit revisions absorbed" block at top)
- [ ] Step 9.1 motif-candidate diagnostic landed
- [ ] Step 9.2 motif list finalized
- [x] Step 9.3 project-lead decisions captured (Q1=Medium, Q2=Flat, Q3=Canary, Q4=Reuse `EnrichmentEntryCard`, Q5=Path A)
- [ ] Steps 9.4–9.17 executed per decision

**Plan is approved for execution.** Next action: step 9.1 (motif-candidate diagnostic).

---

**Cross-references:** `docs/audit/FIX_IMPLEMENTATION.md` Phase 9 (parent spec, lines 913–952); `docs/audit/archive/AUDIT_PHASE_9_PLAN.md` (round-1 + PV audit absorbed pre-execution per "Audit revisions absorbed" block above); `docs/audit/PENDING.md` (placeholder route flagged); `docs/feedback/DEFERRED_TASKS.md` priority queue item 2 (post-Phase-8); `docs/rules/RULES-CORE.md` Rule 29 §Companion Pre-Submission Checklist (governs motif-entry authoring); `docs/audit/archive/PHASE_8_PLAN.md` (precedent for canary + locale-mirror + integrity-sweep workflow); `docs/audit/archive/PHASE_10_PLAN.md` (precedent for new-file + new-parser + new-UI execution sequence); `src/app/[locale]/[book]/context/page.tsx` (the file to replace at step 9.7); `src/ui/enrichment/enrichment-entry.tsx` (`EnrichmentEntryCard` to reuse per Q4 recommendation; `EnrichmentEntry.claimType: ClaimType` strict union per Q5 Path A); `src/ui/enrichment/context-view.tsx` (reference for `EnrichmentEntryCard` usage pattern only — its section-grouping + `<details>` accordion + `sortByConfidence` are NOT mirrored per audit §3.4 + §5.1); `src/domain/content/types.ts` (8-member `ClaimType` union — Path A target); `src/infrastructure/content/people-parser.ts` (closest existing parser by complexity — 866 lines, 51 tests); `src/lib/content-loader.ts` (extension point for `getBookContextData()`); `scripts/content-lint.sh` lines 23 (`$PEOPLE_FILES`), 197–200 (§0.10) — extension target at step 9.17.
