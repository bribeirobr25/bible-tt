# Execution History — Bible TT Project

Canonical chronological record of completed phases and bundles. This is the home for the
"what was done and when" narrative that used to live in `CLAUDE.md`. Per-decision rationale
lives in `docs/editorial-log/`; open items live in `docs/audit/PENDING.md`; the feedback
re-audit status lives in `docs/feedback/FEEDBACK.md`; archived plan + audit artifacts live in
`docs/audit/archive/` (see its `README.md`).

**Latest editorial-log anchors:** `genesis.md` Entry `2026-06-03-110` · `john.md` J-027 · `matthew.md` M-026.

---

## Completed phases & bundles (chronological by closure)

| Closed | Phase / bundle | What it did | Plan artifact |
|--------|----------------|-------------|---------------|
| 2026-05-08 | **Phase 5.5** | Landed Ruleset **v3.3** (§Punctuation Governance, §Idiom Policy, §Glossary Expansion Procedure, formalized §Editorial Log Specification, John 1:1c worked example). Hybrid Lock-Protocol path; proposal artifacts retained in `docs/rules/proposals/`. | `FIX_IMPLEMENTATION.md` Phase 5.5 |
| 2026-05-09 | **Phases 0–6** | Tooling (Phase 0 content-lint §0.x rules), People-surface foundation, mechanical content fixes (version stamps, em-dash, ψυχή typo), ES NT remediation, PT-BR/DE consistency, introduction split. Phase 6A re-verified the 9 NOT VERIFIED audit items (PT-BR Almeida Option B, *charis* slash, title-cap Option 2). Phase 6B piloted the Rule 29 §734 Tier 2 Relocation Protocol on Genesis 9. | `FIX_IMPLEMENTATION.md` Phases 0–6 |
| 2026-05-09 | **Phase 6.6** (sub-phases A–I) | Post-Phase-6 UX + content polish: en-dash sweep; people-parser familiar-name auto-extract; introduction disclaimer in collapsed `<details>`; person-card field reorder + birth/death rows; HTML-native single-expand accordion; chapter breadcrumb; Matthew 5 NT figures × 4 locales; women-timeline audit; dead-code audit (0 actionable removals). | `archive/NEW_PLAN.md` |
| 2026-05-13 | **Phase 7** | Readability sweep on John & Matthew companions — 32 in-scope files (24 companions + 8 introductions × 4 locales); technical terms glossed at first use. | `archive/PHASE_7_PLAN.md` |
| 2026-05-13 | **Phase 11** (Option C) | John & Matthew prophecy files — 12 PROPHECY files (John 3, Matthew 1, Matthew 2 × 4 locales). | `archive/PHASE_11_PLAN.md` |
| 2026-05-13 | **Phase 11.5** | `scholarlyNote` parser+UI fix + Cham/Yafet AM-year compute. | `archive/PHASE_11_5_PLAN.md` |
| 2026-05-14 | **Phase 10** | John PEOPLE.md authored across 4 locales (11 entries each: 2 see-only to Matthew, 5 full profiles, 1 Yehudim group entry, 3 see-only stubs to future books). | `archive/PHASE_10_PLAN.md` |
| 2026-05-14 | **Phase 8** | Section I (The World at the Time) coverage — 44 cross-reference quote-blocks added to Gen 2–12 × 4 locales (OT → structural parity with NT) + 8 narrative-specific entries × 4 locales = 32 new I-A entries. | `archive/PHASE_8_PLAN.md` (+ `_DIAGNOSTIC`, `_TRIAGE`) |
| 2026-05-15 | **Phase 9** | Book Context page content cycle — new `BookContextData` domain type + `book-context-parser.ts` + `book-context-view.tsx`; 12 CONTEXT.md files; 20 motifs × 4 locales = 80 entries; §0.10 lint extended to CONTEXT.md; +15 parser tests. | `archive/PHASE_9_PLAN.md` (+ `_MOTIF_CANDIDATES`) |
| 2026-05-16 | **Possible-Content Bundle** (Topics 2/5/10) | Three content additions × 4 locales: Iakobos see-only PEOPLE.md stub, *et*/alef-tav §F5 SPECULATIVE catalogue, comparative-transmission §E5/§E4 with Rule-3 anti-apologetic safeguards. Editorial-log: M-022, M-023, J-025, `2026-05-16-105`. | `POSSIBLE_CONTENT_BUNDLE_PLAN.md` |
| 2026-05-18 | **DE familiar-names sweep** (FEEDBACK item 35) | 259 redundant-parens `Name (Name)` occurrences swept across 17 DE chapter files + 1 study file. Landed Ruleset **v3.3.1** (emergency amendment — DE name-rendering clarification in RULES-HB.md §PROPER-NAME TABLE notes). Editorial-log: `2026-05-18-107` (anchor) + J-026 + M-025. | `DE_FAMILIAR_NAMES_PLAN.md` |
| 2026-05-18 | **Tier 2 note bloat propagation** (FEEDBACK item 19) | Genesis + John + Matthew sub-sweeps; 10 real relocations × locale fan-out = 35 edits. Strict §734 review reduced 64 heuristic candidates → 10 relocations (15.6% vs. Gen-9 pilot's 43%). Editorial-log: `2026-05-18-108` (anchor) + J-027 + M-026. | `TIER_2_NOTE_BLOAT_PLAN.md` |
| 2026-05-18 | **Phase 13** — Cross-Book Canonical PEOPLE formalization | Landed Ruleset **v3.3.2** (emergency amendment — RULES-CORE.md Rule 29 §People and Genealogy Files extended with cross-book canonical-entry convention + 5-change new-book activation checklist). New warn-only §0.12 content-lint rule (7-slug allow-list). Editorial-log: `2026-05-18-109` (anchor). | `PHASE_13_PLAN.md` |
| 2026-06-03 | **Source-Analysis Methodology formalization** | Formalized the source-analysis method as the project-owned **TT Source-Analysis Method** (`docs/source-analysis/METHOD.md` + per-language adaptation table); distilled the former `genesis_template/` video transcripts into a structured, de-personalized Hebrew corpus (Gen 1:1–1:13 + word studies); stubbed Greek/Aramaic; anonymized the contributor (name retained only in one internal provenance line); §0.13 leakage guard added. Emergency-class CORE metadata/pointer refresh — **no version bump**. Editorial-log: `2026-06-03-110` (anchor). | `SOURCE_ANALYSIS_METHODOLOGY_PLAN.md` |

## Ruleset version trail

- **v3.3** (2026-05-08, Phase 5.5) — governance expansion (punctuation, idiom, glossary expansion, editorial-log schema, John 1:1c example).
- **v3.3.1** (2026-05-18) — emergency amendment: DE name-rendering clarification (RULES-HB.md).
- **v3.3.2** (2026-05-18) — emergency amendment: cross-book PEOPLE formalization (RULES-CORE.md Rule 29).

See `docs/rules/CHANGELOG-v3.1.md` / `-v3.2.md` / `-v3.3.md` for full change detail and the proposal artifacts in `docs/rules/proposals/`.

## Still open

- **Phase 12** — Genesis 13–50 content cycle (not yet authored; parser auto-discovers new files).
- **Cross-book canonical PEOPLE source-merge** — the deep "fetch full bio from canonical home" implementation (the v3.3.2 see-only-stub pattern is in production; the merge UI is deferred). See `PENDING.md` C3.
- **README.md staleness** — targeted ~30-min fix deferred per Phase 13 Q4=C.
- **Deferred content seeds** — Akedah→Crucifixion typology (Gen 22 §F), Moses *karan*/horns (Exod 34), Mary-as-Ark (Luke 1 §F). See `PENDING.md`.

For the full open-item tracker and the 38-item feedback re-audit, see `docs/audit/PENDING.md` and `docs/feedback/FEEDBACK.md`.
