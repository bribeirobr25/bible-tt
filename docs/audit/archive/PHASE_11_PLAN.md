# Phase 11 — John & Matthew Prophecy Material (Option C)

**Created:** 2026-05-13
**Revised:** 2026-05-13 post-audit round 1 (`docs/audit/archive/AUDIT_PHASE_11_PLAN.md` §§1–8) — 2 critical execution-blockers + 4 significant concerns absorbed.
**Re-revised:** 2026-05-13 post-audit round 2 (`docs/audit/archive/AUDIT_PHASE_11_PLAN.md` §§"Post-Revision Second-Pass Verification") — 2 additional critical risks (R2.1 single-line fulfillmentNotes, R2.2 `--` em-dash lint blocker) + 2 improvements (R2.3 stale test comment, R2.4 missing-ruleset DoD check) absorbed.
**Source:** `docs/audit/FIX_IMPLEMENTATION.md` Phase 11; `docs/audit/PENDING.md` "John / Matthew prophecy material — DECISION NEEDED"
**Status:** drafted; revised post-audit; awaiting project-lead approval before execution
**Path chosen:** **Option C (recommended)** — hybrid: author PROPHECY files only where chapter-level content is currently insufficient to surface Prophecy view-mode

## Audit revisions absorbed (2026-05-13)

Independent audit (`docs/audit/archive/AUDIT_PHASE_11_PLAN.md`) verified the plan's claims against the actual codebase. Two execution-blockers + four significant concerns found by tracing the full rendering chain from content file → parser → domain type → UI component. All findings agreed with after verification:

- **Critical C1 — `**Scholarly note:**` is silently dropped by the parser.** The parser's `parseProphecyMarkdown` dispatch in `prophecy-parser.ts` recognizes only: `verse`, `text says`, `context`, `subject`, `fulfillment status`, `fulfillment notes`, `readings`. Any other `**Key:**` line matches the field-line regex but falls through all dispatch branches without storing. There's no `scholarlyNote` field on `ProphecyEntry`, no UI rendering. The plan's original §4 + §5 use of "Scholarly note" would have produced authoring effort that never appears in the UI. **This bug exists in current Genesis prophecy files too** — their `**Scholarly note:**` lines are silently discarded. Flagged as pre-existing forward-tracking item in §10 below; out of Phase 11 scope, but worth fixing in a future parser-UI pass.
- **Critical C2 — All `→ See [target]` cross-references would be dropped** (since they were planned to live inside Scholarly note). Follows from C1.
- **Fix for C1+C2:** scholarly content (manuscript variants, original-context concerns, LXX/MT divergence, cross-references) now lives inside `**Fulfillment notes:**` — the field that IS parsed (dispatched via `key.includes("fulfillment notes")` / `"notas"` / `"anmerkungen"`) and IS rendered (as a small italic paragraph at the bottom of each ProphecyCard at lines 106-110 of `prophecy-view.tsx`).
- **Caveat on fix:** `fulfillmentNotes` renders as **plain text** (no `dangerouslySetInnerHTML`, no markdown processing). Consequences:
  - `*parthenos*` renders as literal `*parthenos*` (no italics)
  - `→ See M-002` renders as literal text (no hyperlink — cross-reference is human-readable only, not clickable)
  - Greek/Hebrew Unicode characters render fine (no markdown required)
  - Newlines within fulfillmentNotes are preserved but appear as runs of whitespace, not line breaks (single-paragraph rendering)
- **Significant S1 — `subject` is parsed but never rendered.** The field exists on `ProphecyEntry` and is populated by the parser, but `prophecy-view.tsx` never references it. This is consistent with Genesis prophecy files (which also include `**Subject:**` lines). Authors filling Subject for completeness and parser-validation alignment, but readers will not see it. Documented in §5 conventions below.
- **Significant S2 — Readings must be single-line.** The `READING_LINE` regex is `/^- \*\*(.+?)(?:\s*\/\s*(.+?))?\*\*:\s*(.+)\s*\[(.+?)\]$/` — anchored at start with `^- **` and at end with `]$`. Multi-line readings are silently truncated. No trailing whitespace after the closing `]`. Each Jewish/Christian/Islamic reading paragraph must fit on one line (long lines are OK; line breaks are not).
- **Significant S3 — Re-verify test baseline at execution time** (not just at plan-draft time). Added as explicit pre-step in §6.
- **Significant S4 — DoD entry-count wording clarified.** "6 prophecy entries each per locale" was ambiguous; corrected to "6 prophecy entries per locale, distributed as 1+1+4 across the three files".

### Round-2 findings absorbed

- **R2.1 (CRITICAL — silent data loss)** — `**Fulfillment notes:**` key and value must be on the SAME line. The parser's `FIELD_LINE = /^\*\*(.+?):\*\*\s*(.*)$/` captures `(.*)` only to end-of-line; content on subsequent lines silently disappears. The single-line example in §5 implicitly demonstrates this, but §5 now explicitly states the constraint to prevent multi-line authoring drift across 12 files × 6 entries.
- **R2.2 (CRITICAL — build blocker)** — Content-lint rule `§0.2` (raw em-dash residue ` -- `) applies to `$STUDY_DIRS` which includes all `content/{locale}/{book}/study/` directories. PROPHECY files in study/ ARE linted. Year ranges or compound dates written with ` -- ` shorthand (e.g., `735 BCE -- crisis`) would block `pnpm build`. §5 now explicitly forbids ` -- ` in PROPHECY content and directs authors to Unicode em-dash `—`.
- **R2.3 (improvement)** — `src/infrastructure/content/__tests__/prophecy-parser.test.ts` has a stale comment claiming "Parser bug: parseFulfillmentStatus checks FULFILLED before UNFULFILLED" — but the current code checks UNFULFILLED first (verified at parser lines 75–86). Test passes; comment is outdated documentation. Fixed in step 11.7 alongside editorial-log entries (no code-test-cycle cost since the assertion already passes correctly).
- **R2.4 (improvement)** — Content-lint `§0.1` flags WRONG ruleset versions (v3.0/v3.1/v3.2) but does NOT flag MISSING `**Ruleset:**` lines. §8 DoD now includes an explicit manual check: "verify `**Ruleset:** v3.3` present in front-matter of all 12 PROPHECY files".

---

## 1. Goal (one sentence)

Light up **Prophecy view-mode** for John and Matthew chapters that contain prophetic statements dense enough to warrant dedicated treatment — without duplicating the fulfillment-formula entries already governed by `docs/editorial-log/matthew.md` Entry M-001 or the parthenos/almah analysis in M-002.

Prophecy view-mode is already coded in `src/ui/prophecy/prophecy-view.tsx`, the parser is shipped (`prophecy-parser.ts` — 23 tests passing), and the 5-mode chapter-view UI checks for prophecy file existence to render the tab. Currently for John + Matthew, the tab is invisible because no PROPHECY files exist.

## 2. Why Option C (not A or B)

The FIX_IMPLEMENTATION.md Phase 11 entry enumerates three options:

- **Option A** — no PROPHECY files at all. Prophecy view-mode stays dark for John/Matthew. Existing prophetic material lives in chapter companions + editorial-log M-001. **Trade-off:** readers navigating via Prophecy view never see John's or Matthew's prophetic content. Smallest authoring cost (0h), worst reader experience.
- **Option B** — comprehensive: every John/Matthew chapter with prophetic statements gets a PROPHECY file. **Trade-off:** ~20-30h authoring; significant duplication with M-001 and verse notes. Best Prophecy-view coverage, worst maintenance burden.
- **Option C (this plan)** — hybrid: author PROPHECY files only for the densest prophetic chapters. Three target chapters: **John 3** (the Numbers 21 / Yeshua-lifted parallel is narratively central), **Matthew 1** (Isa 7:14 *parthenos*/*almah* — the foundational birth-narrative prophecy), **Matthew 2** (four-formula sequence: Mic 5:1+2 Sam 5:2; Hos 11:1; Jer 31:15; Natsri unresolved — densest prophetic chapter in Matt 1–3).

Option C populates Prophecy view-mode meaningfully without duplicating every fulfillment-formula entry.

## 3. Files to author

3 chapters × 4 locales = **12 files**:

- `content/{en,pt-br,de,es}/john/study/CHAPTER-3-PROPHECY.md`
- `content/{en,pt-br,de,es}/matthew/study/CHAPTER-1-PROPHECY.md`
- `content/{en,pt-br,de,es}/matthew/study/CHAPTER-2-PROPHECY.md`

Parser auto-discovers `CHAPTER-N-PROPHECY.md` via filesystem scan (verified — Genesis 3/9/12 prophecy files load identically); no code changes needed.

## 4. Per-prophecy decision table

Six total prophecy entries across the three files. Each row pins interpretive decisions upfront so 4-locale propagation is mechanical.

| # | File | Prophecy entry | Verse | Subject | Fulfillment status | Cross-reference target |
|---|------|----------------|-------|---------|-------------------|-----------------------|
| 1 | John 3 | Numbers 21 / "lifted up" Son of Man parallel | John 3:14–15 | The Son of Man "must be lifted up" as Mosheh lifted the bronze serpent in Numbers 21:8–9 | **CLAIMED** (Christian); DEBATED (Jewish reading) | John 3 CONTEXT §A6 *Hypsōthēnai* + §B2 bronze-serpent background |
| 2 | Matt 1 | Isa 7:14 — virgin/young-woman conception | Matt 1:22–23 | The "virgin/young woman" (*parthenos*/*almah*) will conceive and bear a son called Immanu'el | **CLAIMED** (Matthew's typological reading); DEBATED (Isaiah's historical Ahaz context) | `docs/editorial-log/matthew.md` Entry **M-002** (parthenos/almah slash policy) |
| 3 | Matt 2 | Mic 5:1 + 2 Sam 5:2 — Bethlehem birthplace | Matt 2:5–6 | The anointed one will come from Bethlehem of Yehudah | **CLAIMED** (Matthew's composite formula); **PARTIAL** (the prophecy fits a Davidic descent claim regardless of dating) | `docs/editorial-log/matthew.md` Entry **M-001** §Composite (the Mic 5:1 reversed + 2 Sam 5:2 blended quotation) |
| 4 | Matt 2 | Hos 11:1 — "out of Egypt I called my son" | Matt 2:15 | Original Hosea: God called Israel out of Egypt (historical exodus). Matthew: typologically reapplied to Yeshua's return from Egypt as an infant | **CLAIMED** (Matthew's typological reapplication); the Hosea text is **NOT** a future-tense prophecy in original context | `docs/editorial-log/matthew.md` Entry **M-001** §Typological |
| 5 | Matt 2 | Jer 31:15 — Rachel weeping for her children | Matt 2:17–18 | Rachel weeping at Ramah; Matthew applies to the slaughter of Bethlehem infants | **CLAIMED** (Matthew's temporal-resultive formula τότε ἐπληρώθη — "then was fulfilled"); Jeremiah's original context is the Babylonian exile | `docs/editorial-log/matthew.md` Entry **M-001** §Temporal-resultive |
| 6 | Matt 2 | "Natsri" — unresolved source | Matt 2:23 | "He will be called a Nazarene" — no known single OT source matches; proposed sources include Isa 11:1 (*netzer*, "branch"), Judg 13:5/7 (Nazirite), or a lost prophetic text | **DEBATED** (the source itself is genuinely unidentified) | `docs/editorial-log/matthew.md` Entry **M-001** §Unresolved |

### Readings field (Jewish / Christian / Islamic per Genesis precedent)

Each entry includes three readings paragraphs labeled with [DOCUMENTED] (as in Genesis prophecy files) — Jewish, Christian, Islamic — so the Prophecy view-mode presents the same multi-tradition lens already established for Genesis. For entries where Islamic tradition has no direct engagement (e.g., Natsri unresolved source), the Islamic paragraph states explicitly that the Quran does not engage this specific text.

**Format constraint (audit S2):** each reading is a single line ending with `[CONFIDENCE]` (no trailing whitespace). Multi-line readings are silently truncated by the `READING_LINE` regex. Plan locale propagation MUST keep readings as single-line entries — long lines are fine, line breaks are not.

### Scholarly content + cross-references — placed inside Fulfillment notes (audit C1+C2 fix)

The textual/historical-critical context (manuscript variants, original-context concerns, LXX vs MT divergence, cross-references to M-001 / M-002 / John 3 CONTEXT §A6) lives inside `**Fulfillment notes:**` — NOT in a separate `**Scholarly note:**` field, which the parser silently drops.

The `**Fulfillment notes:**` value:
- Is parsed (parser dispatch on `fulfillment notes` / `notas` / `anmerkungen`)
- Is rendered (italic-small paragraph at the bottom of each ProphecyCard at lines 106-110 of `prophecy-view.tsx`)
- Renders as **plain text** (no `dangerouslySetInnerHTML`) — `*parthenos*` will not italicize, `→ See M-002` will not link. Cross-references are human-readable plain-text pointers.

Format per entry: one fulfillment-notes string containing both the scholarly framing (1-3 sentences) AND the cross-reference pointer at the end, separated by `→`. Example for Matt 1:23:

> **Fulfillment notes:** Matthew quotes the LXX (parthenos) rather than the Hebrew (almah). Isaiah 7:14's original context addresses King Achaz during the Syro-Ephraimite crisis (c. 735 BCE); Matthew applies typologically to Yeshua's birth. Confidence labels per Rule 13 (CLAIMED for Matthew's fulfillment claim; DEBATED for the relationship to Isaiah's original context). → See M-002 for the full parthenos/almah slash-policy reasoning.

## 5. Translation conventions to pin

These convention questions are pre-resolved here so locale propagation in steps 5–7 is mechanical, not interpretive:

| Convention | Decision |
|------------|----------|
| Fulfillment-status token | Use the parser-recognized tokens directly: `CLAIMED` / `DEBATED` / `PARTIAL` / `FULFILLED` / `UNFULFILLED` / `MULTI_STAGE` for EN. Locale-translated tokens per parser (`BEANSPRUCHT` for DE CLAIMED, `REIVINDICADA` for PT-BR, `RECLAMADA` for ES, etc. — already supported by `parseFulfillmentStatus` in `prophecy-parser.ts`). |
| Reading labels | EN: `Jewish` / `Christian` / `Islamic`. PT-BR: `Judaica` / `Cristã` / `Islâmica`. DE: `Jüdisch` / `Christlich` / `Islamisch`. ES: `Judía` / `Cristiana` / `Islámica`. (Match existing Genesis prophecy file conventions verbatim.) |
| Confidence on Readings | `[DOCUMENTED]` for established traditions; `[POSSIBLE]` for individual scholar proposals; `[UNCERTAIN]` for genuinely contested. Locale-translated by parser (DOKUMENTIERT / DOCUMENTADO etc.). |
| *parthenos*/*almah* in Matt 1 prophecy | Render slash form per M-002 policy: "virgin/young woman" (EN), "virgem/jovem mulher" (PT-BR), "Jungfrau/junge Frau" (DE), "virgen/joven mujer" (ES) |
| YHWH in OT quotation context | Per GS Divine Name Policy Option C: render as "the Lord" (*kyrios*) in body of Matthew quote; flag in scholarly note that Hebrew source has the Tetragrammaton |
| Cross-reference format | Plain-text pointer at the end of `**Fulfillment notes:**` (NOT a separate Scholarly note field — audit C1+C2). EN: `→ See M-002 for the full parthenos/almah policy.` PT-BR: `→ Veja M-002 para a política completa de parthenos/almah.` DE: `→ Siehe M-002 für die vollständige parthenos/almah-Politik.` ES: `→ Vea M-002 para la política completa de parthenos/almah.` Note italics are dropped — rendered as literal text. |
| Front-matter | Same boilerplate as existing Genesis prophecy files (Chapter / Language / Ruleset v3.3 / Status: provisional). |
| `**Subject:**` field | Authored for completeness + parser-validation alignment, even though `subject` is parsed-but-not-rendered in `prophecy-view.tsx` (audit S1). Matches Genesis prophecy file convention. Subject text should be 1-2 sentences identifying who/what the prophecy refers to. |
| **`**Fulfillment notes:**` format (audit R2.1 — CRITICAL)** | Field key and **entire** value must be on **one line**: `**Fulfillment notes:** Full scholarly framing + cross-reference. → See M-002.` The parser's `FIELD_LINE` regex captures only same-line content; **everything after a line break is silently dropped**. Long lines are acceptable; line breaks are not. Authoring pattern to AVOID: `**Fulfillment notes:**\n[content on next line]` — yields empty string, nothing renders. |
| **Em-dash in PROPHECY content (audit R2.2 — CRITICAL)** | Use the Unicode em-dash `—` (or `,` / `;`) for ranges, parentheticals, and compounds. Do NOT use ` -- ` (space-hyphen-hyphen-space) — this matches content-lint rule `§0.2` (applies to `$STUDY_DIRS` which includes PROPHECY files), fails the lint, and blocks `pnpm build`. Applies to all text in all PROPHECY fields, including fulfillmentNotes and readings. Year ranges: use `735–732 BCE` (Unicode en-dash) per Phase 6.6A convention. Compounds: use ` — ` (em-dash with spaces) per Phase 2C convention. |

## 6. Execution sequence

**Pre-execution baseline check (audit S3):** **immediately before starting step 11.1**, re-run `pnpm test` and verify it reports 796/796 with prophecy-parser test suite at 23/23. Plan-draft-time baseline does not guarantee execution-time baseline (other phases may have shipped between draft and execution). If discrepant, investigate before authoring — do NOT silently update the baseline number.

| Step | Scope | Effort |
|------|-------|--------|
| **11.1** | EN John 3 PROPHECY — author the 1 Numbers-21 entry with all fields | 30 min |
| **11.2** | EN Matthew 1 PROPHECY — author the 1 Isa 7:14 entry | 30 min |
| **11.3** | EN Matthew 2 PROPHECY — author the 4 entries (Mic 5+2 Sam, Hos 11:1, Jer 31:15, Natsri) | 1.25 h |
| **11.4** | PT-BR mirror of all 3 files (1 + 1 + 4 = 6 entries × 1 locale) | 1.25 h |
| **11.5** | DE mirror | 1.25 h |
| **11.6** | ES mirror | 1.25 h |
| **11.7** | Editorial-log entries (J-020 + M-018) + meta-doc sync (CLAUDE.md test count, PENDING.md, DEFERRED_TASKS.md, FIX_IMPLEMENTATION.md closure note) + **stale-test-comment cleanup (audit R2.3)**: update the UNFULFILLED test comment in `src/infrastructure/content/__tests__/prophecy-parser.test.ts` from "Parser bug: parseFulfillmentStatus checks FULFILLED before UNFULFILLED" to a note that the bug was fixed and UNFULFILLED is now checked first (parser lines 75–86). No test-assertion change; only the comment. | 50 min |

**Total: ~7 h** (matches FIX_IMPLEMENTATION.md's 6–10 h estimate).

After each step: `pnpm test` (must stay 796/796 + 23 prophecy tests), `pnpm content:lint` (exit 0), `pnpm build` (must stay clean). Phase 7 post-execution-audit pattern adopted: run a systematic gap audit before declaring DoD.

## 7. Editorial-log entries

Two entries — one per book — following §EDITORIAL LOG SPECIFICATION format:

- **`docs/editorial-log/john.md` Entry J-020** — Phase 11 Option C, John 3 PROPHECY file authored. Cite: Rule 13 (uncertainty levels), Rule 29 (Companion Governance), the John 3:14 / Numbers 21 typological linkage decision, and the cross-reference to existing John 3 CONTEXT §A6 / §B2.
- **`docs/editorial-log/matthew.md` Entry M-018** — Phase 11 Option C, Matthew 1+2 PROPHECY files authored. Cite: Rule 13, Rule 29, the relationship between this file and the upstream Entry M-001 (fulfillment-formula policy) and M-002 (parthenos/almah). Sister entry to J-020.

Both entries' Cross-references field MUST include `docs/audit/archive/PHASE_11_PLAN.md` (plan source) and `docs/audit/archive/AUDIT_PHASE_11_PLAN.md` if an independent audit is requested before execution.

The two entries also serve as the chronological-link receipt: each cites Phase 7 closure (`docs/editorial-log/john.md` Entry J-019 / `docs/editorial-log/matthew.md` Entry M-017) as the predecessor, per the established audit §5.5 cross-reference pattern from Phase 6.6.

## 8. Definition of Done

- All 12 files authored (3 chapters × 4 locales). **Total prophecy entries per locale = 6**, distributed as 1 + 1 + 4 across the three files (1 in John 3; 1 in Matt 1; 4 in Matt 2). Total entries written across all locales = 24 (6 × 4). (Audit S4 clarification.)
- Each entry has: Verse, Text says, Context, Subject, Fulfillment status, **Fulfillment notes** (containing scholarly framing + cross-reference pointer; audit C1+C2 fix), Readings (3-tradition single-line per Genesis precedent + audit S2 format constraint)
- Parser tests still 23/23 passing — author files conform to the parser schema verified against `src/infrastructure/content/prophecy-parser.ts`
- `pnpm test` reports 796/796 (same baseline; no new parser tests required since schema is unchanged)
- `pnpm content:lint` exit 0
- `pnpm build` clean across all 4 locales × 3 books (with the new prophecy tabs visible on the relevant chapter pages)
- Visual check: `/{locale}/{matthew,john}/chapter/{1,2,3}` shows the **Prophecy** tab where applicable; clicking it renders the new entries
- Cross-locale consistency: every prophecy entry uses the same fulfillment-status token (per the parser's locale-token table), same 3-reading structure, same cross-reference target
- **Manual front-matter check (audit R2.4):** verify `**Ruleset:** v3.3` is present in front-matter of all 12 PROPHECY files. Content-lint `§0.1` only flags WRONG versions (v3.0/v3.1/v3.2) and does NOT flag MISSING Ruleset lines, so this check must be performed manually as part of the integrity sweep
- **Multi-line fulfillmentNotes audit (audit R2.1):** grep each of the 12 PROPHECY files to verify every `**Fulfillment notes:**` line has its value on the same line (i.e., no `**Fulfillment notes:**$\n` ending a line followed by content). The parser silently drops next-line content; this DoD check catches it before deploy
- **`--` em-dash audit (audit R2.2):** verify `grep -rE " -- " content/{en,pt-br,de,es}/{john,matthew}/study/CHAPTER-*-PROPHECY.md` returns 0 hits before declaring DoD. Otherwise `pnpm content:lint` will block the build
- Editorial-log entries J-020 + M-018 logged
- `docs/audit/FIX_IMPLEMENTATION.md` Phase 11 closure log added
- `docs/audit/PENDING.md` "John / Matthew prophecy material" entry updated from DECISION NEEDED to RESOLVED 2026-05-13 (or actual close date)
- Phase-7-style post-execution audit pass: grep each prophecy file for the §5 conventions; flag any deviation before declaring DoD

## 9. Risks + mitigations

| # | Risk | Severity | Mitigation |
|---|------|----------|-----------|
| 1 | Fulfillment-status choices (CLAIMED vs DEBATED vs PARTIAL) become theologically contested | MEDIUM | The §4 table pre-resolves each entry's status upfront; locale editors execute mechanically. The choices reflect scholarly conventions: CLAIMED for Matthew's quoted fulfillment formulas (Matthew explicitly claims it); DEBATED for Jewish vs Christian readings; PARTIAL only where the prophecy has both a near-term and far-term referent. The editorial-log entry documents the rationale. |
| 2 | Hos 11:1 "out of Egypt" entry triggers Jewish-Christian-dialogue sensitivity | MEDIUM | Frame as Matthew's **typological reapplication** of Hosea's original Israel-exodus reference. The Fulfillment notes field (audit C1+C2 fix) explicitly distinguishes: "Hosea's original context describes Israel's historical exodus, not a future-tense prophecy. Matthew's use is typological reapplication, attested in Second Temple Jewish interpretation." Cross-reference M-001 §Typological. |
| 3 | Matt 1 prophecy entry duplicates M-002 | LOW with discipline | Plan §4 explicitly designates M-002 as the cross-reference target. The prophecy entry's Fulfillment notes is 2-3 sentences pointing to M-002 for the full slash-policy reasoning. Per Phase 7 audit §5.1, the rich M-002 entry is the canonical target, NOT to be restated. |
| 4 | Locale fulfillment-status translations not parser-recognized | LOW | `prophecy-parser.ts` already lists EN/PT/DE/ES variants for each status. Verified at draft time: BEANSPRUCHT (DE CLAIMED), REIVINDICADA (PT-BR CLAIMED), RECLAMADA (ES CLAIMED), DEBATTIERT/DEBATIDA/DEBATIDO all present. |
| 5 | Reading labels typo'd in non-EN locales (Judaica vs Judia, Christã vs Cristã) | LOW | Match Genesis prophecy file conventions verbatim — they're already in production and parser-validated. Lift those exact labels. |
| 6 | Prophecy view mode breaks / parser fails on new files | LOW | Author one file (EN John 3) first; run `pnpm test` to verify parser handles it; only then propagate. Step 11.1 doubles as a canary. |
| 7 | Phase 7-style grep-coverage misses in locale audit | LOW–MEDIUM | Adopt the post-execution audit pattern from Phase 7. Each fulfillment-status token AND each reading label AND each cross-reference target validated per file per locale. |
| 8 | Multi-line `**Fulfillment notes:**` silently drops content (audit R2.1) | MEDIUM if not caught | §5 conventions table explicitly forbids multi-line; §8 DoD includes a grep-based check that all `**Fulfillment notes:**` lines have value on same line. EN canary (step 11.1) doubles as a manual check before locale propagation. |
| 9 | ` -- ` em-dash residue in PROPHECY content blocks build via content-lint §0.2 (audit R2.2) | MEDIUM if introduced | §5 conventions table explicitly forbids ` -- ` (use Unicode `—` or en-dash `–`). §8 DoD includes a grep-based pre-build check. Build will block immediately so the failure mode is loud, not silent. |
| 10 | Missing `**Ruleset:** v3.3` front-matter line not caught by lint (audit R2.4) | LOW | §8 DoD includes a manual visual check across all 12 files. Boilerplate-copy pattern from canary file minimizes drift. |

## 10. Out of scope (deliberately deferred)

- **John 1 prophecy material** — John 1:51 (ascending/descending Son of Man / Jacob's ladder echo) is already discussed in `john/CHAPTER-1-CONTEXT.md` §G2. Not dense enough to warrant a dedicated prophecy file. Reader gets full context via chapter companion + Prophecy tab stays dark for John 1.
- **John 2 prophecy material** — John 2:19–22 (raise the temple) is already in `john/CHAPTER-2-CONTEXT.md` §A2/§A5. Same reasoning.
- **Matthew 3 prophecy material** — Matt 3:3 (Isa 40:3, voice in wilderness) is already discussed in `matthew/CHAPTER-3-CONTEXT.md`. Single fulfillment formula, doesn't warrant a separate prophecy file.
- **Comprehensive Option B coverage** — Every fulfillment-formula entry across all chapters. Explicitly rejected per §2; Option C is the curated subset. If a future reader needs the full Option B map, M-001 already lists all 6 fulfillment-formula occurrences with their types.
- **New parser tests** — schema is unchanged from existing Genesis prophecy files; the 23 existing tests in `prophecy-parser.test.ts` already cover all schema variations. No new tests required unless new fields are introduced (none planned).
- **Other Phase 11 future expansions** — Jewish messianic-prophecy collections, full Davidic typology — outside this phase. Forward-tracked in `DEFERRED_TASKS.md` if surfaced.
- **Pre-existing parser bug: `**Scholarly note:**` silently dropped** (audit C1) — **RESOLVED 2026-05-13 via Phase 11.5** (`docs/audit/archive/PHASE_11_5_PLAN.md`). Phase 11.5 added `scholarlyNote` to `ProphecyEntry` domain type, parser dispatch for 4 locale variants, explicit `finalizeEntry` round-trip per audit Critical fix, UI render (Option B unlabeled italic with `border-t` divider matching the existing `fulfillmentNotes` pattern), 4 i18n keys at `prophecy.fields.scholarlyNote`, +5 parser tests (796→801). The 4 Genesis CHAPTER-3-PROPHECY scholarly notes now render at `/{locale}/genesis/chapter/3` Prophecy tab. Originally forward-tracked as path (a) "code fix"; path (b) "content migration" explicitly NOT taken (Phase 11's fulfillmentNotes-bundled content stays as-is per round-1 audit decision). See `docs/editorial-log/genesis.md` Entry 2026-05-13-102 and `docs/feedback/DEFERRED_TASKS.md` item E.

## 11. Status

**Drafted:** 2026-05-13 by claude-opus-4-7
**Revised:** 2026-05-13 post-audit round 1 — 2 critical + 4 significant findings absorbed
**Re-revised:** 2026-05-13 post-audit round 2 — 2 additional critical + 2 improvements absorbed (R2.1 single-line fulfillmentNotes, R2.2 `--` em-dash lint, R2.3 stale test comment, R2.4 missing-ruleset DoD)
**Pre-execution test baseline:** `pnpm test` reports 796/796 + prophecy-parser 23/23 (verified at draft time; re-verify at execution time per audit S3)
**Round-2 auditor recommendation:** "Approve after R2.1 and R2.2 are addressed" — both now addressed via §5 conventions table; R2.3 + R2.4 incorporated into step 11.7 + §8 DoD
**Awaiting:** project-lead approval of §4 prophecy decision table + §5 conventions (now including R2.1 + R2.2 critical constraints) before execution
**Trigger to start:** any green-light from project lead — execution can begin immediately at step 11.1 (EN John 3 PROPHECY canary file).

---

**Plan author:** claude-opus-4-7, 2026-05-13 (revised through two audit rounds same day)
**Audit (round 1):** `docs/audit/archive/AUDIT_PHASE_11_PLAN.md` §§1–8 — verdict "After fixes, the plan is clean". 2 execution-blockers (C1 scholarly-note dropped, C2 cross-refs dropped) + 4 significant concerns (S1 subject not rendered, S2 readings single-line constraint, S3 baseline re-verification, S4 DoD wording). Resolved by consolidating scholarly content + cross-references into `**Fulfillment notes:**`.
**Audit (round 2):** `docs/audit/archive/AUDIT_PHASE_11_PLAN.md` §§"Post-Revision Second-Pass Verification" — verdict "Approve after R2.1 and R2.2 are addressed". 2 additional critical risks (R2.1 single-line fulfillmentNotes constraint, R2.2 `--` em-dash content-lint blocker) + 2 improvements (R2.3 stale UNFULFILLED test comment, R2.4 manual missing-ruleset check). All 4 resolved: R2.1/R2.2 in §5 conventions table; R2.3 in step 11.7; R2.4 in §8 DoD.
**Cross-references:** `docs/audit/FIX_IMPLEMENTATION.md` Phase 11 (parent — Option C recommended); `docs/audit/archive/AUDIT_PHASE_11_PLAN.md` (independent audit absorbed pre-execution); `docs/audit/PENDING.md` "John / Matthew prophecy material" (open status); `docs/editorial-log/matthew.md` Entry M-001 (fulfillment formula policy) + Entry M-002 (parthenos/almah slash policy) + Entry M-006 (anarthrous pneuma hagion); existing Genesis prophecy files at `content/{locale}/genesis/study/CHAPTER-{3,9,12}-PROPHECY.md` as schema reference (with the documented pre-existing scholarly-note bug forward-tracked in §10); `src/infrastructure/content/prophecy-parser.ts` (parser, lines 138-189 for field dispatch); `src/ui/prophecy/prophecy-view.tsx` (UI, lines 106-110 for fulfillmentNotes rendering); `docs/audit/archive/PHASE_7_PLAN.md` + Phase 7 closure as the structural template for this plan.
