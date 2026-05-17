# CLAUDE.md — Bible TT Project

## What this project is

The Transparent Translation (TT) — a multilingual Bible translation project with a web application for reading, studying, and exploring contextual enrichment. The translation currently covers Genesis 1–12, John 1–3, and Matthew 1–3 in English, Brazilian Portuguese, German, and Spanish, governed by a 29-rule system (v3.3) that prioritizes source-text fidelity, ambiguity preservation, and theological restraint.

## Verified state (2026-05-14)

- **Tests:** 816 passing across 7 files (chapter parser 576, enrichment 117, prophecy 28, people 51, introduction 17, render-markdown-safe 12, book-context 15).
- **Rules:** RULES-CORE at v3.3 (added §Punctuation Governance, §Idiom Policy, §Glossary Expansion Procedure, formalized §Editorial Log Specification, added John 1:1c worked quadrilingual example). RULES-HB / RULES-GS unchanged at v3.2 lock for proper-name tables and source-language-specific rules.
- **Content scope verified:** Genesis 1–12 + INTRODUCTION + PEOPLE in all four locales; John 1–3 + INTRODUCTION + PEOPLE in all four locales; Matthew 1–3 + INTRODUCTION + PEOPLE in all four locales.
- **Editorial logs:** `genesis.md` (Entry 2026-05-15-104), `john.md` (J-024), `matthew.md` (M-021), `transliteration-decisions.md` — all present. Phase 10 added john.md J-021 (John PEOPLE.md across 4 locales). Post-Phase-10 audit cleanup added matthew.md M-019 (DE/ES matthew Yochanan heading + DE `keyEvents` parser alias). Phase 8 added genesis.md 2026-05-14-103 + john.md J-022 + matthew.md M-020 (Section I coverage — 44 cross-reference quote-blocks + 8 narrative-specific entries × 4 locales = 32 entries). Post-Phase-8 small-wins bundle added john.md J-023 (1,128 ES diacritic replacements). **Phase 9 added genesis.md 2026-05-15-104 (anchor entry — Book Context page; 12 CONTEXT.md files; 20 motifs × 4 locales = 80 motif entries; new domain type + parser + UI + page replacement; +15 parser tests, baseline 801→816) + john.md J-024 + matthew.md M-021 (sister entries).**
- **Execution status:** Phases 0–6.6 closed 2026-05-09; Phase 7 closed 2026-05-13; Phase 11 (Option C) closed 2026-05-13; Phase 11.5 closed 2026-05-13; Phase 10 closed 2026-05-14; Phase 8 closed 2026-05-14 (`docs/audit/archive/PHASE_8_PLAN.md` executed under Interpretation A + Option A Maximal; `docs/audit/archive/PHASE_8_DIAGNOSTIC.md` + `docs/audit/archive/PHASE_8_TRIAGE.md` produced; 44 cross-reference quote-blocks added to Gen 2–12 × 4 locales bringing OT into structural parity with NT chapters; 8 narrative-specific (i) entries × 4 locales = 32 new I-A entries across gen/4, gen/9 ×2, gen/10, gen/11, gen/12, john/2, matt/3). Phase 5.5 landed Ruleset v3.3. Phase 6A re-verified the 9 NOT VERIFIED audit items. Phase 6B piloted the Rule 29 §734 Tier 2 Relocation Protocol on Genesis 9. Phase 6.6 (post-Phase-6 UX + content polish) landed across 9 sub-phases: 6.6A (numeric-range en-dash sweep across all 4 locales × 3 books); 6.6B (people-parser auto-extracts familiar name from heading + 4 new tests); 6.6C (introduction-view disclaimer in collapsed `<details>` "Reading note"); 6.6D (person-card biographical-fields reorder + birthYear/deathYear Field rows); 6.6E (HTML-native single-expand accordion via `name` attribute); 6.6F (chapter-view breadcrumb to book landing); 6.6G (Matthew 5 NT figures × 4 locales — explicit birthYear/deathYear/lifespan + numeric-anchor convention + Herod claim-type correction); 6.6H (women timeline audit — Eve/Sarai Option-1 + Bat-Sheva intentional absence documented); 6.6I (dead-code/content audit — 12 categories scanned, 0 actionable removals; all candidates KEEP-with-reason as forward-API or dynamic-reference). All blocking content-lint rules pass. Phase 9 closed 2026-05-15 (`docs/audit/archive/PHASE_9_PLAN.md` executed; `PHASE_9_MOTIF_CANDIDATES.md` step 9.1 diagnostic + step 9.2 finalized list; new `BookContextData` domain type + `book-context-parser.ts` + `book-context-view.tsx`; placeholder route replaced; 20 motifs × 4 locales = 80 motif entries authored at Q1 Medium depth; §0.10 lint extended to cover CONTEXT.md). **Possible-Content Bundle (Topics 2/5/10 from `docs/feedback/possible-content.md`) closed 2026-05-16** (`docs/audit/POSSIBLE_CONTENT_BUNDLE_PLAN.md` executed under Q1=B/Q2=B+SPECULATIVE/Q3=B/Q4=accepted/Q5=B; v1 + v2 audits absorbed pre-execution; three content additions × 4 locales each — Iakobos see-only PEOPLE.md stub, *et*/alef-tav §F5 SPECULATIVE catalogue, comparative-transmission §E5/§E4 with Rule-3 anti-apologetic safeguards; four editorial-log entries appended: M-022 + M-023 + J-025 + `2026-05-16-105`; ES Matthew mojibake side-finding logged to PENDING.md). Phases 12, 13 remain.
- **FEEDBACK status (2026-05-14):** 24 RESOLVED / 2 PARTIAL (8 PT-BR archaic register; 19 Tier 2 note bloat pilot complete + propagation deferred) / 12 NOT VERIFIED / 0 STILL OPEN of 38 prior-audit items. Item 33 (John PEOPLE.md governance) now RESOLVED via Phase 10.
- **Known open items** (see `docs/audit/{PENDING,FIX_IMPLEMENTATION}.md` and `docs/feedback/{FEEDBACK,DEFERRED_TASKS}.md` for full detail):
  - ~~John PEOPLE.md not authored in any locale~~ — RESOLVED 2026-05-14 via Phase 10 (`docs/audit/archive/PHASE_10_PLAN.md`).
  - ~~Readability sweep partial~~ — RESOLVED 2026-05-13 via Phase 7 (`docs/audit/archive/PHASE_7_PLAN.md`).
  - ~~Section I 10-category coverage audit per chapter~~ — RESOLVED 2026-05-14 via Phase 8 (`docs/audit/archive/PHASE_8_PLAN.md`).
  - ~~Book Context page content cycle (Phase 9)~~ — RESOLVED 2026-05-15 via Phase 9 (`docs/audit/archive/PHASE_9_PLAN.md`).
  - Tier 2 note bloat propagation: 17 chapters remain after Genesis 9 pilot (~25h estimated).
  - ~~John/Matthew prophecy material decision~~ — RESOLVED 2026-05-13 via Phase 11 Option C (`docs/audit/archive/PHASE_11_PLAN.md`).
  - Genesis 13–50 not yet authored (Phase 12).
  - 13 prior-audit items still NOT VERIFIED (15, 16, 19, 20, 24, 25, 27, 28, 29, 30, 31, 32, 35) — most likely closed by Phase 5.5 Ruleset v3.3 cascade but not re-audited.

## Project structure

```
bible-tt/
├── content/                 # All content files (moved from project root for NFT tracing)
│   ├── en/genesis/          # CHAPTER-1..12, INTRODUCTION, PEOPLE
│   │   └── study/           # CHAPTER-N-CONTEXT × 12; CHAPTER-{3,9,12}-PROPHECY
│   ├── en/john/             # CHAPTER-1..3, INTRODUCTION, PEOPLE
│   │   └── study/           # CHAPTER-N-CONTEXT × 3
│   ├── en/matthew/          # CHAPTER-1..3, INTRODUCTION, PEOPLE
│   │   └── study/           # CHAPTER-N-CONTEXT × 3
│   ├── pt-br/{genesis,john,matthew}/  # Brazilian Portuguese — same structure
│   ├── de/{genesis,john,matthew}/     # German — same structure
│   └── es/{genesis,john,matthew}/     # Spanish — same structure
├── docs/
│   ├── rules/               # RULES-CORE.md (v3.3) + RULES-HB.md + RULES-GS.md (v3.2 lock) + CHANGELOG-v3.1/v3.2/v3.3.md (29 rules total)
│   ├── architecture/        # STANDARDS.md (DDD, code standards, TypeScript, testing)
│   ├── design/              # TT-DESIGN-SYSTEM.md (UI/UX, typography, color, accessibility)
│   ├── audit/               # PENDING.md (verified open items)
│   ├── editorial-log/       # Decision log (genesis.md, john.md, matthew.md, transliteration-decisions.md)
│   ├── feedback/            # FEEDBACK.md (verified re-audit), DEFERRED_TASKS.md (verified deferred tasks)
│   ├── implementation/      # PLAN.md, SCHEMA-FUTURE.sql
│   └── templates/           # Companion file template + book introduction template
├── src/                     # Next.js web application
│   ├── app/                 # App Router pages
│   │   └── [locale]/[book]/ # Book landing, chapter/, people/, context/ sub-pages
│   ├── domain/              # Pure domain types (no framework deps)
│   ├── infrastructure/      # Adapters (markdown parser, enrichment parser, people parser, i18n)
│   ├── ui/                  # Presentation (reading/, study/, enrichment/, people/, navigation/, shared/)
│   ├── hooks/               # React hooks
│   └── lib/                 # Utilities and content loader
└── public/                  # Static assets (favicon)
```

## URL structure

| Route | Content |
|-------|---------|
| `/{locale}/{book}/` | Book landing — Overview + chapter list + 3 entry points (Introduction / People / Context) |
| `/{locale}/{book}/introduction` | Full book introduction — Authorship, Dating, Manuscript Transmission, Reading-in-TT, Sources |
| `/{locale}/{book}/chapter/{n}` | Chapter with 5 view modes |
| `/{locale}/{book}/people` | People & Genealogy — expanded profiles + SVG timeline |
| `/{locale}/{book}/context` | Book-level context (placeholder — future content) |

Old URLs (`/{locale}/{book}/{n}`) redirect automatically to the new `/chapter/{n}` pattern.

## Commands

- `pnpm dev` — start dev server with Turbopack (http://localhost:3000)
- `pnpm build` — production build
- `pnpm test` — run all unit tests (792 tests: chapter parser, enrichment parser, people parser, prophecy parser, introduction parser, render-markdown-safe)
- `pnpm lint` — run Biome linter
- `pnpm content:lint` — run hardened content lint (Phase 0 — see `docs/audit/FIX_IMPLEMENTATION.md`); allow-list at `scripts/lint-allowlist.txt`
- `pnpm content:lint:warn` — same lint in non-blocking mode (warns only, exit 0)

## Architecture

Governed by `docs/architecture/STANDARDS.md`. Key decisions:

- **Static-first:** Authored markdown parsed at build time. No database. No API. Pages served from CDN.
- **DDD layers:** `domain/` (pure types) → `infrastructure/` (adapters) → `ui/` (components) → `app/` (routing). Domain knows nothing about Next.js.
- **Content pipeline:** Four parsers:
  - `markdown-parser.ts` — chapter files → `ChapterData` (verses, notes, glossary, cross-chapter tracking)
  - `enrichment-parser.ts` — companion files → `EnrichmentData` (sections A–I with claim-type + confidence labels)
  - `people-parser.ts` — PEOPLE.md files → `PeopleData` (biographical entries with timeline data)
  - `prophecy-parser.ts` — prophecy files → `ProphecyData` (fulfillment tracking)
- **i18n:** URL-based locale routing (`/en/genesis/chapter/1`, `/pt-br/genesis/chapter/1`). Content translation in .md files; UI strings in `src/infrastructure/i18n/messages/`.
- **Five view modes:** Reading (continuous prose) | Study (verse-by-verse with notes) | Explore (curated highlights: curiosities, world-at-the-time, scientific) | Context (full enrichment companion) | Prophecy (prophecy tracking)

## Design system

Governed by `docs/design/TT-DESIGN-SYSTEM.md`. Key standards:

- **Typography:** Newsreader (serif, reading) + Geist (sans, UI) + Geist Mono (data). Minimum 14px for prose, 12px for mono labels only.
- **Color:** OKLCH tokens. Warm paper background. No hardcoded hex. No pure black/white.
- **Icons:** Lucide at 1.5px stroke. Never emoji as UI icons.
- **Accessibility:** WCAG 2.2 AA. Focus rings on all interactive elements. 44×44px tap targets. `prefers-reduced-motion` respected.
- **Anti-slop:** No religious clichés, no gradient orbs, no card soup, no decorative animation.

## Translation rules

Governed by `docs/rules/RULES-CORE.md` (v3.3) + `docs/rules/RULES-HB.md` + `docs/rules/RULES-GS.md` (v3.2 lock — proper-name tables and source-language-specific rules). 29 rules total. Key principles:

- **Prime Directive:** Do not simplify what the source text keeps complex; do not clarify what the source text leaves ambiguous.
- **Rule 25 (YHWH):** Rendered consonantally (YHWH in EN/PT/ES, JHWH in DE), not as "LORD."
- **Rule 3 + corollary:** No imported theology; restraint matters both ways (anti-traditional reflex is also dishonest).
- **Rule 11:** Additions for grammar marked in italics.
- **Rule 13:** Uncertainty levels (Probable / Possible / Uncertain) on all debated terms.
- **Rule 29:** Contextual enrichment in companion files only, labeled by claim-type + confidence. Tier 2 notes max 3 sentences; excess relocated to companion with pointer. Companion pre-submission checklist governs quality.
- **Name rendering (v3.2):** Familiar target-language names as default. Transliterated form shown once per section. Exceptions: YHWH/JHWH, Yehudim, technical transliterations.
- **Greek Article System:** GS-specific policy for articular vs. anarthrous nouns.
- **Ioudaioi Policy:** Three-sense decision tree for hoi Ioudaioi with anti-misuse safeguard.

All decisions logged in `docs/editorial-log/` (genesis.md, john.md, matthew.md, transliteration-decisions.md).

## Content authoring

**New chapter:**
1. Create `content/{locale}/{book}/CHAPTER-N.md` following the existing structure.
2. Create `content/{locale}/{book}/study/CHAPTER-N-CONTEXT.md` using `docs/templates/contextual-companion-template.md`.
3. Include Section I (The World at the Time) with multi-scenario composition framing (see existing chapters for template).
4. Parser auto-discovers new files via filesystem scan.
5. Run `pnpm test` → `pnpm build` to verify.

**New book introduction:**
1. Create `content/{locale}/{book}/INTRODUCTION.md` using `docs/templates/book-introduction-template.md`.
2. Sections A–F are AVAILABLE (include only with substantive content); Section G (Sources) is MANDATORY.
3. Follow the dual-label system (claim-type + confidence) and include the disclaimer block.
4. EN-first, then PT-BR, DE, and ES follow.

**Name rendering:**
- First occurrence per section: "Transliterated (Familiar)" — e.g., "Yochanan (John)"
- All subsequent: familiar form only — e.g., "John"
- Exceptions: YHWH/JHWH (always transliterated), Yehudim (always transliterated), technical terms (raqia, bara, etc.)
- See proper-name tables in RULES-HB.md and RULES-GS.md for all locale mappings.

**Translation decisions:**
- Log in the appropriate `docs/editorial-log/{book}.md` before drafting.
- New glossary terms added via glossary expansion policy (RULES-CORE.md).
- EN-first, then PT-BR, DE, and ES follow.

## Tech stack

- Next.js 16 (App Router, React Server Components, Turbopack)
- Tailwind CSS v4 with OKLCH color tokens
- next-intl for i18n
- Lucide for icons (1.5px stroke)
- Vitest for testing (792 tests)
- Biome for linting
