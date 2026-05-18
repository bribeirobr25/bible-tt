# Tier 2 Note Bloat Propagation Plan — Apply Rule 29 §Tier 2 Relocation Protocol to Remaining 17 Chapters

**Status:** REVISED 2026-05-18 (audit v1 absorbed; awaiting project-lead decision lock before execute)
**Scope:** Rule 29 §Tier 2 Relocation Protocol propagation across Genesis 1–8 + 10–12 + John 1–3 + Matthew 1–3 × 4 locales
**Source:** `docs/feedback/FEEDBACK.md` item 19 (PARTIAL since Phase 6B Gen 9 pilot, 2026-05-09)
**Precedent:** `docs/editorial-log/genesis.md` Entry 2026-05-09-100 (Gen 9 pilot — 7-step protocol validated)
**Governing rule:** `docs/rules/RULES-CORE.md` Rule 29 §Tier 2 Relocation Protocol (line citations omitted as fragile per audit-v1 §4.2)
**Revisions:**
- 2026-05-18 — Initial draft.
- 2026-05-18 — Absorbed audit v1 (`docs/audit/AUDIT_TIER_2_NOTE_BLOAT_PLAN.md`). 4 significant findings + 5 minor issues + 1 design-system constraint addressed (with 1 partial dissent on detection unit). Audit-absorption ledger at §9.

---

## 0. TL;DR

The Gen 9 pilot validated a 7-step protocol for moving overgrown Tier 2 notes into companion sections. 17 chapters remain. The hottest chapters (Gen 10, John 2, John 3, John 1) carry roughly half the total bloat. This plan asks 6 decisions (sequencing, scope-strictness, cross-locale strategy, companion-edit policy, log granularity, commit cadence), then executes the same per-chapter 7-step protocol — bounded by the project lead's effort budget.

---

## 1. Pinned verified facts (as of 2026-05-18)

### 1.1 Rule 29 §Tier 2 Relocation Protocol (RULES-CORE.md Rule 29 §Tier 2 Relocation Protocol, paraphrased)

> "Tier 2 notes should normally stay under 3 sentences. Move material to companion files when it contains: ANE parallels, later reception history, statistical analysis, theological trajectories, extended archaeology/history, multiple scholarly positions, modern scientific comparison, or anti-misuse discussion that requires more than a short warning. Before moving: (1) identify the source verse; (2) choose the receiving companion section; (3) preserve a short Tier 2 pointer; (4) add or update Section H source provenance in the companion; (5) log the relocation in the editorial log if it changes interpretive framing."

### 1.2 Gen 9 pilot validated 7-step technique (`docs/editorial-log/genesis.md` Entry 2026-05-09-100)

1. **Identify candidate notes** — regex over `^> - \*\*` blockquote bullets; flag those with ≥4 sentence-end punctuation tokens.
2. **Inspect content type** — does the note carry §734's enumerated content types?
3. **Locate receiving companion section** — search `study/CHAPTER-N-CONTEXT.md` for an existing entry covering the material.
4. **Tighten Tier 2** — reduce to ≤3 sentences; preserve glossary term, Hebrew/Greek, transliteration, core takeaway.
5. **Append explicit pointer** — `→ For [topic], see companion §X` (locale-translated).
6. **Cross-locale propagate** — same condense-and-pointer in PT-BR / DE / ES.
7. **Validate** — re-run detector + `pnpm test` + `pnpm content:lint`.

### 1.3 Oversize-note diagnostic (≥4 sentence-ends per note) — 2026-05-18 scan

| Chapter | EN | PT-BR | DE | ES | Avg/locale | Total ×4 |
|---|---|---|---|---|---|---|
| genesis/CH-1 | 0 | 0 | 1 | 0 | 0.2 | 1 |
| genesis/CH-2 | 10 | 10 | 11 | 9 | 10.0 | 40 |
| genesis/CH-3 | 13 | 13 | 13 | 13 | 13.0 | 52 |
| genesis/CH-4 | 6 | 6 | 6 | 6 | 6.0 | 24 |
| genesis/CH-5 | 3 | 3 | 3 | 3 | 3.0 | 12 |
| genesis/CH-6 | 10 | 9 | 9 | 9 | 9.2 | 37 |
| genesis/CH-7 | 7 | 7 | 8 | 7 | 7.2 | 29 |
| genesis/CH-8 | 3 | 4 | 4 | 2 | 3.2 | 13 |
| genesis/CH-10 | 26 | 25 | 26 | 26 | 25.8 | 103 |
| genesis/CH-11 | 8 | 8 | 10 | 8 | 8.5 | 34 |
| genesis/CH-12 | 12 | 11 | 12 | 11 | 11.5 | 46 |
| john/CH-1 | 20 | 19 | 16 | 19 | 18.5 | 74 |
| john/CH-2 | 25 | 25 | 27 | 27 | 26.0 | 104 |
| john/CH-3 | 18 | 19 | 20 | 21 | 19.5 | 78 |
| matthew/CH-1 | 13 | 13 | 11 | 13 | 12.5 | 50 |
| matthew/CH-2 | 11 | 12 | 10 | 11 | 11.0 | 44 |
| matthew/CH-3 | 8 | 10 | 10 | 11 | 9.8 | 39 |
| **TOTAL** | — | — | — | — | **11.5** | **780** |

### 1.4 Gen 9 pilot baseline conversion rate

- Pre-pilot: 7 oversize notes per locale.
- Relocated: 3 (43%).
- Remaining post-pilot: 4 (borderline 4-sentence lexical/grammatical — don't trigger §734's enumerated content-type criteria).

If the same ~43% rate holds across all 17 chapters, **expected relocations ≈ 335 across all locales** (~84 unique relocations × 4 locales). Hot chapters (Gen 10, John 2) may run higher; lexical-heavy chapters (Gen 5, 8) may run lower.

### 1.5a Pivotal-verse exception (added post-audit v1 §3.4)

`docs/editorial-log/genesis.md:1055-1068` (Entry 2026-05-08, pre-Gen-9-pilot) documents the pivotal-verse exception clause: certain designated verses are permitted extended Tier 2 notes that legitimately exceed the 3-sentence cap. The four currently-designated pivotal verses are **Gen 8:21, 9:6, 9:13, 9:22**. Of these, only **Gen 8:21** falls within this sweep's scope (the others are in Gen 9, already addressed by the pilot). The Gen 8:21 notes ("PLEASING AROMA / *reach ha-nichoach*", "SAME DIAGNOSIS, OPPOSITE CONCLUSION", "SAID IN HIS HEART") are intentionally and legitimately long; they MUST NOT be flagged for §734 relocation.

Verified scope: zero pivotal-verse designations exist in `docs/editorial-log/john.md` or `docs/editorial-log/matthew.md` (grep confirmed). The exception is currently Genesis-only.

### 1.5 Effort estimate from Gen 9 pilot

- Gen 9 took ~1h for 1 chapter × 4 locales (3 notes × 4 locales = 12 edits).
- Phase 6B closure estimate at the time: ~27h for the remaining 18 chapters. With Gen 9 now complete, **17 chapters remain at the same trajectory ≈ 25h** as the FEEDBACK.md estimate.
- Per-chapter time varies by hotness: Gen 10 + John 2 (~26 oversize/locale) likely takes 2–3h each; light chapters (Gen 1, 5, 8) take well under an hour.

### 1.6 Out-of-scope

- INTRODUCTION.md, PEOPLE.md, study/CHAPTER-N-CONTEXT.md, CHAPTER-N-PROPHECY.md files — these are not Tier 2 verse-notes and not governed by §734 in the same way. Companion files are where Tier 2 material relocates **into**; they're not subject to the same 3-sentence cap.
- Re-tightening Gen 9 (already done in the pilot).
- "Borderline" 4-sentence lexical/grammatical notes that don't trigger §734's enumerated content types — Phase 7 territory (readability prose-economy), not this sweep.
- **Pivotal-verse exception notes** (added post-audit v1 §3.4) — `Gen 8:21` notes are permitted extended length per `genesis.md` Entry 2026-05-08 (pivotal-verse exception clause). Excluded from detection scope regardless of sentence count. Gen 9:6, 9:13, 9:22 are also designated pivotal but fall outside this sweep's chapter scope (Gen 9 already done).

---

## 2. Decision questions

### Q1 — Chapter sequencing order

Which order should the 17 chapters be processed in?

**Option A — Hottest-first (RECOMMENDED):**
- Order (by Avg/locale from §1.3 table): john/2 (26.0) → gen/10 (25.8) → john/3 (19.5) → john/1 (18.5) → gen/3 (13.0) → matt/1 (12.5) → gen/12 (11.5) → matt/2 (11.0) → gen/2 (10.0) → matt/3 (9.8) → gen/6 (9.2) → gen/11 (8.5) → gen/7 (7.2) → gen/4 (6.0) → gen/8 (3.2) → gen/5 (3.0) → gen/1 (0.2)
- Pros: Front-loads the highest-impact work; biggest readability wins land first; allows early checkpoint (if effort budget is exceeded after the top 4 chapters, the project has already captured ~50% of total bloat).
- Cons: Inconsistent reading order; the hottest chapters mix Genesis + John + Matthew rather than completing book-by-book.

**Option B — Sequential per book (canonical order):**
- Order: gen/1 → gen/2 → gen/3 → gen/4 → gen/5 → gen/6 → gen/7 → gen/8 → gen/10 → gen/11 → gen/12 → john/1 → john/2 → john/3 → matt/1 → matt/2 → matt/3
- Pros: Clean book-by-book completion; reviewer experience aligns with how a reader encounters the text.
- Cons: Defers the hottest chapters (John 2/3 at positions 13/14, Gen 10 at position 9). If budget runs out mid-stream, the worst bloat may remain unaddressed.

**Option C — By book:**
- Order: all 11 Genesis chapters → all 3 John → all 3 Matthew.
- Pros: One book's worth of editorial logs lands cleanly; matches existing per-book log structure (anchor + sister entries).
- Cons: Same defer-the-hottest issue as Option B.

**Option D — Project-lead choice from the table** (the project lead nominates the order from §1.3).

**My recommendation: Option A (hottest-first).** The Gen 9 pilot showed that the technique is mechanical and well-validated; the highest-impact deployment is at the bloated chapters. If the project lead wants book-grouped editorial logs, Q5 = Option A can still produce one anchor entry per book (the per-chapter execution order doesn't determine log structure).

### Q2 — Scope strictness (which 4-sentence notes get relocated?)

The Gen 9 pilot relocated only notes that BOTH (a) had ≥4 sentence-ends AND (b) carried §734's enumerated content types (ANE parallels, multiple positions, etc.). Borderline 4-sentence lexical/grammatical notes were LEFT in Tier 2.

**Option A — Match Gen 9 pilot exactly (RECOMMENDED):**
- Relocate only when content type is on the §734 list.
- Lexical/grammatical 4-sentence notes stay in Tier 2 (their information density is per-word; condensing damages the note's purpose).
- Expected relocation rate ≈ 43% (per pilot).
- Pros: Validated approach; no scope creep; lexical/grammatical notes that genuinely belong in Tier 2 stay there.
- Cons: 4-sentence lexical notes that violate the 3-sentence guidance remain; addressing them is a future readability pass (Phase 7 territory).

**Option B — More aggressive: relocate every ≥4-sentence note regardless of content type:**
- Expected relocation rate close to 100%.
- Pros: Strict adherence to "Tier 2 notes should normally stay under 3 sentences."
- Cons: Damages lexical/grammatical notes that need the extra sentence to convey precision; potential for over-flattening; doesn't match the pilot's validated technique.

**Option C — Wider threshold: include 3-sentence notes that have companion-grade content too:**
- Some 3-sentence notes may already qualify for relocation by content type alone.
- Pros: Cleaner Tier 2 / Tier 3 boundary by content type, not just length.
- Cons: Scope expands significantly (would need a fresh diagnostic pass on 3-sentence notes too); subjective on a per-note basis; deviates from the pilot.

**My recommendation: Option A.** It's the validated approach. The borderline lexical/grammatical residue is a documented separate problem with a separate solution path (readability pass / Phase 7).

### Q3 — Cross-locale strategy

The Gen 9 pilot did per-chapter all-4-locales-in-one-go (12 edits per chapter). Should this scale?

**Option A — Per-chapter, all-4-locales-in-one-go (Gen 9 pilot pattern) (RECOMMENDED):**
- For each chapter, identify candidate notes in EN, then apply the same relocation across PT-BR / DE / ES.
- Per-chapter unit is "all locales at once."
- Pros: Validated by pilot; preserves cross-locale consistency at every chapter close; reviewer can verify a single chapter end-to-end.
- Cons: Slightly more switching overhead between chapter content and locale-specific notes.

**Option B — EN-first across all 17 chapters, then PT-BR, then DE, then ES (assembly-line):**
- Pros: Reviewer can validate the EN pass in isolation before non-EN starts; reduces context-switching within a single pass.
- Cons: Diverges from Gen 9 pattern; cross-locale consistency risks (drift in pointer wording, section choice) if EN evolves mid-sweep.

**My recommendation: Option A.** Same pattern as pilot, validated, minimizes drift.

### Q4 — Companion-edit policy

Gen 9 pilot: "No companion file was edited in this pilot — the receiving sections were already in place." For other chapters, some relocations may need the target companion section to be CREATED or EXPANDED.

**Option A — Pointer-only (no companion edits in this sweep) — strict pilot pattern:**
- If a candidate note's content has no existing companion home, leave the note alone (don't relocate); flag in the per-chapter log as "deferred — needs companion authoring."
- Pros: Tightest scope; no new content authoring; pilot-validated.
- Cons: May leave some genuinely §734-qualified notes un-relocated for lack of a home; some readers may see uneven coverage.

**Option B — Pointer + companion expansion when needed (RECOMMENDED):**
- If a candidate note's content has no existing companion home, AUTHOR a brief companion-section addition (≤1 paragraph; preserve cite-source labels per Rule 29).
- Pros: Higher relocation completeness; serves the reader; expands companion authoritatively.
- Cons: Adds authoring work; expands scope beyond pilot's strict mechanical pattern.

**Option C — Pointer-only NOW; track companion gaps in a side document for a follow-up pass:**
- Same as A, but with a tracked-gap output document so the deferred relocations have a path forward.
- Pros: Stages the work cleanly; preserves pilot pattern; gives the next pass a precise starting line.
- Cons: Half-finished feeling; two passes instead of one.

**My recommendation: Option B (pointer + companion expansion).** The pilot's pointer-only worked because Gen 9's companions were already complete. For 17 chapters of varying companion maturity, some companion authoring is unavoidable if we want meaningful relocation. But the authoring should be MINIMAL — ≤1 paragraph per new companion sub-entry, with Section H source provenance updated when a new source enters.

### Q5 — Editorial-log granularity

Per Rule 28, every interpretive-framing change needs a log entry. The Gen 9 pilot's entry covered all 12 edits (3 notes × 4 locales) for ONE chapter under a single entry.

**Option A — One anchor entry per book (3 entries: genesis, john, matthew) (RECOMMENDED):**
- One `genesis.md` Entry 2026-MM-DD-N covers Gen 1–8 + 10–12 (11 chapters) bundled, listing per-chapter relocations.
- One `john.md` Entry J-N covers John 1–3.
- One `matthew.md` Entry M-N covers Matthew 1–3.
- Pros: Reasonable log size; matches the project's "anchor + sisters" pattern used in M-024 + J-023 + 2026-05-17-106; one entry per book is greppable.
- Cons: Each entry is large (lists many per-chapter relocations); reviewer must scroll.

**Option B — One entry per chapter (17 entries total):**
- Pros: Each entry is small and focused on one chapter; easy to find a specific relocation.
- Cons: 17 new editorial-log entries is a lot of metadata; bloats the logs.

**Option C — Single mega-anchor entry covering all 17 chapters:**
- Pros: Single source of truth.
- Cons: Doesn't match the anchor + sister pattern; cross-book changes feel forced into one file.

**My recommendation: Option A.** Matches established pattern. The per-chapter relocations within each book's entry can be bulleted.

### Q6 — Commit cadence

**Option A — Single atomic commit covering all 17 chapters × 4 locales (RECOMMENDED):**
- Pros: Clean rollback path (per Step 6 single-commit discipline established in the DE familiar-names plan); single commit-message tells the full story.
- Cons: Large diff; if you want to review per-chapter, the single commit makes it harder.

**Option B — One commit per book (3 commits):**
- Pros: Smaller per-commit diffs; reviewable per-book.
- Cons: 3 commits to log; mid-sweep rollback is messier (revert one book's commit while keeping the others requires care).

**Option C — One commit per chapter (17 commits):**
- Pros: Per-chapter atomicity; granular history.
- Cons: 17 commits is noisy; if anything's wrong, 17 reverts are needed; doesn't match the per-bundle commit pattern we've established.

**My recommendation: Option A (single atomic commit)** — matches the precedent set by all recent sweeps (M-024, 2026-05-17-106, DE familiar-names). If you want to review mid-stream, the per-chapter classification doc (see Step 1 below) provides the granular log without needing per-chapter commits.

---

## 3. Alternatives considered (and rejected)

- **Skip the relocation entirely; document it in a guideline for future authors.** Rejected — FEEDBACK item 19 is explicitly tracked as PARTIAL with the propagation as the open work. The existing oversize notes affect current readers.
- **Lower the threshold to ≥3 sentence-ends (catch more notes).** Rejected — would defeat the §734 protocol's "≤3 sentences" guideline (a 3-sentence note is already compliant). The threshold matches the pilot.
- **Use the existing readability pass (Phase 7) instead of §734.** Rejected — Phase 7's readability scope addresses prose economy (sentence-level tightening); §734 addresses content type (move ANE parallels etc. to companion). They're complementary but distinct.
- **Mechanize via a regex-only auto-rewrite.** Rejected — per Gen 9 pilot's step 2, content-type inspection is required. Pure regex can't classify §734's enumerated content types. The protocol needs human judgment per note.

---

## 4. Out-of-scope

- Re-tightening Genesis 9 (already done in the pilot).
- Borderline 4-sentence lexical/grammatical notes that don't trigger §734's content-type criteria — defer to Phase 7 readability pass.
- INTRODUCTION.md, PEOPLE.md, study/, PROPHECY.md files.
- Translation-choice changes (the relocation is content-redistribution, not translation revision).
- Companion-section reorganization (existing companion structure is preserved; new content added to existing sections per Q4).

---

## 5. Execution plan (post-decision lock)

### Step 0 — Lock decisions + verify baseline (added post-audit v1 §3.3)

- Project lead answers Q1–Q6 via AskUserQuestion (single turn).
- Plan updated with lock summary at §10.
- **Pre-execution baseline verification (mandatory per audit-v1 §3.3):**
  - Run `pnpm test` → record actual test count (current: 819 verified 2026-05-18).
  - Run `pnpm content:lint` → record actual warning count + rule IDs (current verified 2026-05-18: 2 warnings — `§0.10` + `§0.11`).
  - Run `pnpm lint` → record clean (no errors expected).
  - Run `pnpm build` → record clean.
  - Use these recorded numbers as the Step 3 verification baseline, NOT plan documentation.

### Step 1 — Per-chapter classification

For each of the 17 chapters (order per Q1):

**1a — Detect oversize Tier 2 notes** (revised post-audit v1 §3.1 — clarified to multi-line per-note aggregation; the audit's CONCERN about single-line scanning was the correct concern but my actual diagnostic does multi-line, and the audit's RECOMMENDED per-verse aggregation conflicts with §734's per-note unit):
1. Parse `content/en/{book}/CHAPTER-N.md` line by line.
2. Each `> - **...**` line begins a new **note**. Subsequent `>` lines (including blank `>`, continuation `>   text`, or in-blockquote headers like `> 🔴 **HEADER**`) are aggregated into the current note's buffer until the next `> - **` bullet OR a non-blockquote line is reached.
3. For each note, count sentence-end punctuation tokens (`. ` / `? ` / `! ` followed by space, newline, or end-of-line) in the **aggregate** content (not just the bullet's first line).
4. Flag notes where sentence-count ≥ 4 as oversize candidates.
5. **Verified note structure (2026-05-18 corpus scan):** chapter files use predominantly single-line bullets with all content on one long line; zero `>   indented-continuation` lines exist across the 17 chapter files × 4 locales = 68 files. The multi-line aggregation is forward-compatible (handles either style) but the current corpus is single-line dominant.
6. **Pivotal-verse exception (added per audit-v1 §3.4):** before running detection on Genesis 8, exclude any notes attached to **Gen 8:21** (the only in-scope pivotal verse per `genesis.md` Entry 2026-05-08 designation). Log the exclusion in the classification doc.

**Note on detection unit (partial dissent from audit-v1 §3.1):** the audit recommended per-verse aggregation (sum sentence-ends across all notes for a verse). This plan retains the Gen-9-pilot-validated per-note aggregation because Rule 29 §Tier 2 Relocation Protocol explicitly addresses "Tier 2 NOTES" (singular per-note unit), not verse aggregates. A verse with 5 short separate notes each of 1 sentence is rule-compliant; a verse with one 5-sentence note is not. Per-verse aggregation would conflate these legitimate cases.

**1b — Per-note classification** (Gen 9 pilot's step 2):
- **RELOCATE** — note carries §734-enumerated content type (ANE parallels, later reception, statistical analysis, theological trajectories, extended archaeology/history, multiple scholarly positions, modern scientific comparison, anti-misuse discussion). Output: target companion section.
- **KEEP** — note is lexical/grammatical or otherwise outside §734's enumerated triggers. Defer to Phase 7.
- **KEEP-CONTENT-REQUIRED** (added per audit-v1 §5.6) — note is §734-qualifying BUT condensing to ≤3 sentences would drop one of: (a) a unique gloss/transliteration that appears only in this note, (b) the primary textual/grammatical observation, (c) a Rule 13 confidence marker or uncertainty label. Keep at current length; flag for project-lead review during classification-doc gate.

**1c — Map to companion section** (Gen 9 pilot's step 3):
- For each RELOCATE note, identify the receiving section in `content/en/{book}/study/CHAPTER-N-CONTEXT.md`.
- If section exists with relevant content → pointer-only.
- If section exists but no relevant content → per Q4 = B, plan a brief companion expansion (≤1 paragraph).
- If section doesn't exist → flag for project-lead review (rare for already-authored chapters).

**1d — Output** `docs/audit/_tier2_chapter_<book>_<n>_classification.md` per chapter with:
- Per-note: verse anchor, current sentence count, content-type verdict (RELOCATE/KEEP), target companion section, pointer text.
- Per-note: PT-BR / DE / ES locale-equivalent pointer wording (`companheiro §X`, `Begleiter §X`, `compañero §X`).

This Step 1 output is a single roll-up document `docs/audit/TIER_2_NOTE_BLOAT_CLASSIFICATION.md` aggregating all 17 chapters.

### Step 2 — Apply relocations (per Q3 = A: per-chapter all-locales)

For each chapter (order per Q1):

**2a — EN pass:**
- Tighten each RELOCATE note in `content/en/{book}/CHAPTER-N.md` to ≤3 sentences.
- **Preservation constraint (added per audit-v1 §5.6):** when tightening, the condensed version MUST retain — (a) any unique gloss or transliteration that appears only in this note; (b) the primary textual/grammatical observation; (c) any Rule 13 confidence marker or uncertainty label. If condensing to ≤3 sentences would require dropping one of these, the note is reclassified to `KEEP-CONTENT-REQUIRED` (Step 1b) and left at its current length, not relocated.
- Append the EN pointer: `→ For [topic], see chapter companion §X.`
- If Q4 = B and companion expansion needed: add the ≤1-paragraph block to the target companion section + update Section H if new source cited. **Mark the new companion sub-entry** as `**Status:** provisional — added via §734 sweep; pending readability review` (added per audit-v1 §4.1) so the expansion is reviewable in a follow-up pass without blocking sweep completion.

**2b — Cross-locale propagate (PT-BR / DE / ES):**

Apply the same condense-and-pointer per locale, using locale-verified pointer text:
  - **EN**: `→ For [topic], see chapter companion §X.` (per pilot)
  - **PT-BR**: `→ Para [tópico], veja o companheiro do capítulo §X.` (verify against established convention before execution)
  - **DE** (corrected per audit-v1 §3.2 — DE files use **Begleitmaterial Abschnitt X**, never "Kapitelbegleiter"; verified across `de/matthew/CHAPTER-{1,2,3}.md` + `de/john/CHAPTER-{1,2,3}.md`):
    - Long form: `→ Für ausführlichere Behandlung von [Thema], siehe Begleitmaterial Abschnitt X.`
    - Short form: `→ Für [Thema], siehe Begleitmaterial Abschnitt X.`
    - **Section format note:** DE uses both `Begleitmaterial Abschnitt A` (dominant) and `Begleitmaterial §A` (e.g., `de/matthew/CHAPTER-1.md:402`). Either is established; prefer `Abschnitt X` for new pointers to match dominant convention.
  - **ES**: `→ Para [tema], vea el compañero del capítulo §X.` (verify against established convention before execution)

**Pre-execution locale-pointer verification (added per audit-v1 §3.2 caveat about "verify EN, PT-BR, and ES pointer templates"):** before Step 2b runs in each locale, grep for existing pointer patterns in that locale's chapter files (e.g., `grep "veja o companheiro\|see chapter companion\|Begleitmaterial\|vea el compañero" content/<locale>/*/CHAPTER-*.md | head -5`) and confirm the template matches the established convention. Update this section if drift is found before sweep.

**2c — Per-chapter validation:**
- Re-run oversize detector — verify the chapter's count drops by the planned relocation count.
- Quick sanity scan: pointer text is consistent; no broken sentences from over-tightening.

### Step 3 — Aggregate verification (after all 17 chapters complete)

- Re-run oversize detector across all 17 chapters × 4 locales → confirm total drops from ~780 to the expected residual (~445 if 43% relocation rate, lower if Q4 = B catches more).
- `pnpm test` (expect: baseline count unchanged — content-only sweep, no parser/test changes).
- `pnpm content:lint` (expect: baseline 2 warnings — §0.10 + §0.11 — unchanged).
- `pnpm build` clean.
- `pnpm lint` clean.
- Visual: MCP browser spot-check 4 hot chapters (`/en/genesis/chapter/10`, `/en/john/chapter/2`, `/en/john/chapter/3`, `/en/matthew/chapter/1` — sample across books) — verify rendering, no parser regressions.

### Step 4 — Logging (per Q5 = A: one anchor entry per book)

**Pre-Step-4 entry-number verification (added per audit-v1 §4.5):** immediately before authoring entries, run `tail -5 docs/editorial-log/{genesis,john,matthew}.md` to verify the current last-entry ID per log. Use `last + 1` as the new ID. The Genesis log uses date-based IDs (`YYYY-MM-DD-NNN`); use the authoring date as the date prefix and the next ordinal after the current last (e.g., if last is `2026-05-18-107`, new is `2026-05-18-108`). Do NOT use placeholder IDs in the committed entries.

- `docs/editorial-log/genesis.md` — new entry `<date>-<ordinal>` (verified at execution) covering Gen 1–8 + 10–12, with per-chapter bulleted relocation list. Anchor entry.
- `docs/editorial-log/john.md` — new entry J-NN (verified at execution) covering John 1–3. Sister entry pointing to genesis anchor.
- `docs/editorial-log/matthew.md` — new entry M-NN (verified at execution) covering Matthew 1–3. Sister entry pointing to genesis anchor.
- Each entry includes:
  - List of relocated notes (verse anchor → companion section).
  - Total relocation count + remaining oversize count (the deferred borderline lexical/grammatical) + `KEEP-CONTENT-REQUIRED` count if any.
  - Per Q4 = B: list of newly-authored companion sub-entries marked `provisional`.
  - Pivotal-verse exclusions logged (Gen 8:21).
  - AI provenance + cross-references to this plan + to Gen 9 pilot Entry 2026-05-09-100.
- `docs/audit/PENDING.md` — FEEDBACK item 19 wording (revised per audit-v1 §4.3): **"RESOLVED — §734-qualifying content relocated (~335 of ~780 oversize notes). Remaining ~445 are borderline lexical/grammatical notes outside §734's enumerated relocation triggers; legitimately deferred to Phase 7 readability pass per Gen 9 pilot precedent (Entry 2026-05-09-100)."** This honest wording acknowledges the residual rather than misleadingly claiming full closure.
- `CLAUDE.md` — execution-status line refreshed with the sweep closure note.

### Step 5 — Single atomic commit (per Q6 = A)

- Title: `apply Rule 29 §734 Tier 2 Relocation Protocol to remaining 17 chapters (FEEDBACK item 19)`.
- Body: full context including Q1–Q6 decisions, total relocations by book, remaining oversize residual.
- Pre-commit: re-run Step 3 verification one final time.

---

## 6. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Per-note content-type classification (Step 1b) is subjective; different operators may classify differently | Step 1d's classification doc is reviewable before any chapter content is edited; project-lead can spot-check classifications by sampling. |
| Cross-locale pointer-text drift | Per Q3 = A, all 4 locales are updated in the same per-chapter pass; pointer wording uses the pilot's exact template per locale. |
| Companion section doesn't exist for a relocation candidate | Per Q4 = B, ≤1-paragraph companion expansion is in scope; per Q4 alternatives, candidates without companion homes are deferred. Step 1c flags this case before Step 2 starts. |
| Over-tightening a note damages its content | Step 2's "preserve glossary term, Hebrew/Greek, transliteration, core takeaway" requirement per Gen 9 pilot step 4; spot-check during per-chapter validation. |
| Effort budget exceeded mid-sweep | Per Q1 = A hottest-first ordering, ~50% of bloat is addressed in the first 4 chapters; if budget exhausts at any point, the remaining lower-impact chapters can be deferred. Plan §11 records partial-completion state. |
| Single mega-commit difficult to review | Per-chapter classification doc (Step 1d aggregate at `TIER_2_NOTE_BLOAT_CLASSIFICATION.md`) gives reviewer a granular index; commit message lists per-book totals. |
| Detection regex misses notes (the `\b`-style bug from DE familiar-names sweep) | Step 1a uses sentence-end punctuation tokens (`. ` / `? ` / `! ` followed by space or EOL), NOT word-boundary regex; no Unicode-superscript edge cases. |
| Detection unit ambiguity (per-note vs per-verse) | Per-note retained per Gen 9 pilot + §734 unit; partial dissent from audit-v1 §3.1 with reasoning documented in Step 1a and §9. |
| Pivotal-verse note accidentally relocated | Step 1a explicitly excludes Gen 8:21 (the only in-scope designation); future pivotal-verse designations beyond Genesis would need a re-scan of editorial logs. |
| DE pointer wording diverges from established convention | Step 2b uses verified `Begleitmaterial Abschnitt X` per audit-v1 §3.2; pre-execution locale-pointer verification step added to confirm EN/PT-BR/ES templates against established conventions before each locale sweep. |
| Content-lint baseline assumption masks regression | Step 0 mandates running `pnpm content:lint` pre-execution to record actual rule IDs as baseline (added per audit-v1 §3.3). |
| Companion expansions ship without quality review | Step 2a marks new sub-entries `**Status:** provisional — added via §734 sweep; pending readability review` (added per audit-v1 §4.1). |
| Condensing a note damages required content | Step 1b's `KEEP-CONTENT-REQUIRED` flag added per audit-v1 §5.6; Step 2a's preservation constraint enforces (a)/(b)/(c) checklist before tightening. |

---

## 7. Rollback plan

- Single-commit atomic rollback per Q6 = A.
- Step 1d classification doc (saved as `docs/audit/TIER_2_NOTE_BLOAT_CLASSIFICATION.md`) retains per-note before/after state — partial rollback per chapter is feasible if needed.
- Test + content-lint baselines provide regression signal.

---

## 8. Estimated effort

- Step 0 (decisions): ~10 min (AskUserQuestion turn).
- Step 1 (classification across 17 chapters): ~3h (per-chapter ~10 min, hot chapters ~15 min each).
- Step 2 (relocations × locales): ~18h (Gen 9 pilot's 1h/chapter scales; hot chapters 2–3h, light chapters <30 min). With Q4 = B (companion expansions), add ~3h for new companion content.
- Step 3 (verification): ~30 min.
- Step 4 (logging): ~1h (3 anchor editorial-log entries + PENDING.md + CLAUDE.md).
- Step 5 (commit): ~10 min.
- **Total: ~25h** — matches FEEDBACK item 19's pilot estimate.

If the project lead wants to time-box this:
- **Hottest-4 only** (gen/10, john/2, john/3, john/1): ~10h, captures ~50% of bloat.
- **Hottest-8** (above + gen/3, matt/1, matt/2, gen/12): ~16h, captures ~70%.
- **Full 17**: ~25h, captures ~100%.

---

## 9. Audit-absorption ledger

**Audit source:** `docs/audit/AUDIT_TIER_2_NOTE_BLOAT_PLAN.md` (Claude Opus 4.7, 2026-05-18, independent review).
**Method:** Each audit finding re-verified against current files before absorbing. Verifications performed against `docs/editorial-log/genesis.md` (full read of Entry 2026-05-09-100 + grep for "pivotal"), `docs/editorial-log/john.md` + `matthew.md` (pivotal-verse search returned zero), `scripts/content-lint.sh` (verified §0.11 exists), `pnpm content:lint` actual run (verified 2 warnings baseline), grep for "Kapitelbegleiter" vs "Begleitmaterial" across `content/de/`, line-by-line inspection of DE John 1 note structure for continuation-line claim.

| Audit finding | Severity | Verification result | Absorption status | Plan updates |
|--------------|---------|---------|---------|---------|
| §3.1 Step 1a single-line regex misses multi-line note structure | Significant | **PARTIAL** — Verified: zero `>   indented-continuation` lines exist across all 17 chapter files × 4 locales. The current corpus uses single-line bullets predominantly. My `find_notes` function already aggregates multiple `>` lines per bullet so multi-line works. BUT the audit's CONCERN about clarity in the spec is valid — original Step 1a text was ambiguous. The audit's RECOMMENDED per-verse aggregation conflicts with §734's per-note unit. | **PARTIAL ABSORPTION** | Step 1a rewritten with 6-step multi-line aggregation spec + verified note structure note + explicit per-note unit retention. Partial dissent on per-verse aggregation documented in Step 1a's "Note on detection unit" subsection — §734 governs per-NOTE, not per-verse. |
| §3.2 DE pointer "Kapitelbegleiter" wrong term | Significant | **FULLY VERIFIED** — grep across `content/de/` returned 0 occurrences of "Kapitelbegleiter" and 7+ occurrences of "Begleitmaterial Abschnitt X" in DE chapter files. Audit was correct. | **ABSORBED** | Step 2b rewritten with verified DE template `Begleitmaterial Abschnitt X` + note that `Begleitmaterial §X` is also established (e.g., `de/matthew/CHAPTER-1.md:402`). Added pre-execution locale-pointer verification step for EN/PT-BR/ES too. |
| §3.3 Content-lint baseline "2 warnings" requires pre-execution verification | Significant | **VERIFIED** — content-lint.sh line 208-216 has §0.11; live `pnpm content:lint` run confirms 2 warnings (`§0.10` + `§0.11`) as the plan asserted. Audit was caveated about not being able to verify (MCP unresponsive); the substantive recommendation (verify-before-lock as practice) is sound. | **ABSORBED** | Step 0 expanded with mandatory pre-execution baseline verification block (run `pnpm test` / `content:lint` / `lint` / `build`; record actual numbers; use as Step 3 baseline). |
| §3.4 Pivotal-verse exception notes not excluded from detection | Significant | **FULLY VERIFIED** — `genesis.md:1055-1068` (Entry 2026-05-08) documents the pivotal-verse exception for Gen 8:21, 9:6, 9:13, 9:22. Only Gen 8:21 falls in this sweep's scope. Grep for "pivotal" in john.md and matthew.md returned zero — Genesis-only designation. | **ABSORBED** | §1.5a added (pivotal-verse exception clause); §1.6 out-of-scope expanded; Step 1a step 6 explicitly excludes Gen 8:21 from detection. |
| §4.1 Q4 Option B companion expansions need provisional-status marking | Minor | **REASONABLE** — Gen 9 pilot didn't expand companions; expansions in this sweep are new territory. Status-marker pattern matches existing project convention (M-024, J-021 are all `provisional`). | **ABSORBED** | Step 2a expanded to mark new companion sub-entries `**Status:** provisional — added via §734 sweep; pending readability review`. |
| §4.2 "RULES-CORE.md line 734" fragile citation | Minor | **VERIFIED CORRECT** — same lesson as AUDIT_DE_FAMILIAR_NAMES_PLAN.md §5.2 (line 491→492 drift). Line numbers shift with rule edits. | **ABSORBED** | Plan header replaced "line 734" with section-path citation. §1.1 header changed to "Rule 29 §Tier 2 Relocation Protocol" without line number. |
| §4.3 "RESOLVED" wording misleading given ~445 residual | Minor | **VERIFIED CORRECT** — math checks out: 780 × 0.43 = 335 relocated, leaving 445 borderline. "RESOLVED" alone reads as full closure. | **ABSORBED** | Step 4 PENDING.md wording revised to "RESOLVED — §734-qualifying content relocated (~335 of ~780 oversize notes). Remaining ~445 are borderline lexical/grammatical notes outside §734's enumerated relocation triggers; legitimately deferred to Phase 7 readability pass per Gen 9 pilot precedent." |
| §4.4 Q1 Option A table-consistency: "(26)" for both john/2 and gen/10 | Minor | **CORRECT** — my original used rounded integer "(26)" for both; audit suggests Avg/locale decimal would clarify (john/2 = 26.0, gen/10 = 25.8). | **ABSORBED** | Q1 Option A rewritten with Avg/locale decimals across all 17 chapters. |
| §4.5 Editorial-log entry-number verification at execution time | Minor | **REASONABLE** — matches POSSIBLE_CONTENT_BUNDLE_PLAN.md "re-verify at execution time" discipline; entry IDs should never be hardcoded in plans. | **ABSORBED** | Step 4 prefaced with pre-Step-4 `tail -5` instruction; placeholder IDs explicitly disallowed in committed entries. |
| §5.6 Render quality preservation constraint | Minor | **VERIFIED REASONABLE** — TT-DESIGN-SYSTEM.md anti-slop checklist + Rule 13 confidence-label preservation make this concrete. | **ABSORBED** | Step 1b added `KEEP-CONTENT-REQUIRED` classification; Step 2a added explicit preservation constraint (a)/(b)/(c) checklist (unique gloss, primary observation, confidence marker). |
| §6/§7/§8 ("What works well", "Required conditions", "Recommendation") | — | **POSITIVE FEEDBACK ACKNOWLEDGED** | **NO CHANGE NEEDED** | Q1=A (hottest-first), Q2=A (pilot-scope), Q3=A (per-chapter all-locales), Q4=B (≤1-paragraph expansions), Q5=A (per-book log), Q6=A (single commit) all validated. Time-boxed alternatives (hottest-4 / hottest-8 / full-17) retained. |

---

## 10. Decision-lock summary

| Question | Decision | Date |
|----------|---------|------|
| Q1 (chapter order) | **Option C — By book (Genesis 1–8 + 10–12 → John 1–3 → Matthew 1–3)** | 2026-05-18 |
| Q2 (scope strictness) | **Option A — Pilot scope (§734 content-types only)** | 2026-05-18 |
| Q3 (cross-locale strategy) | **Option A — Per-chapter, all 4 locales together** | 2026-05-18 |
| Q4 (companion-edit policy) | **Option B — Pointer + ≤1-paragraph expansion when needed (marked provisional)** | 2026-05-18 |
| Q5 (log granularity) | **Option A — One anchor entry per book, 3 entries total** | 2026-05-18 |
| Q6 (commit cadence) | **Project-lead commits manually** (custom answer) — sweep stages all changes; no automated commit | 2026-05-18 |

Plan ready for execution starting at Step 0 baseline verification, then Step 1 classification.
