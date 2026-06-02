# CLAUDE.md — Bible TT Project

## What this project is

The Transparent Translation (TT) — a multilingual Bible translation project with a web application for reading, studying, and exploring contextual enrichment. The translation currently covers Genesis 1–12, John 1–3, and Matthew 1–3 in English, Brazilian Portuguese, German, and Spanish, governed by a 29-rule system that prioritizes source-text fidelity, ambiguity preservation, and theological restraint.

## Verified state

- **Scope:** Genesis 1–12, John 1–3, Matthew 1–3 — all four locales (EN, PT-BR, DE, ES); each book has chapters + INTRODUCTION + PEOPLE + study companions (CONTEXT, and PROPHECY where warranted).
- **Rulesets:** RULES-CORE **v3.3** · RULES-HB **v3.3.1** · RULES-GS **v3.2** (lock). 29 rules total.
- **Tests:** 819 passing (`pnpm test`); `pnpm build`, `pnpm lint`, `pnpm content:lint` all clean.
- **Next up:** Genesis 13–50 (Phase 12); cross-book canonical PEOPLE source-merge; README staleness.

Pointers (do not duplicate their content here):
- Execution history (completed phases/bundles + ruleset trail) → `docs/audit/EXECUTION_HISTORY.md`
- Open items → `docs/audit/PENDING.md` · feedback re-audit → `docs/feedback/FEEDBACK.md` · deferred tasks → `docs/feedback/DEFERRED_TASKS.md`
- Per-decision rationale → `docs/editorial-log/` (genesis.md, john.md, matthew.md, transliteration-decisions.md)
- Source-language analysis method + worked-example corpus → `docs/source-analysis/` (internal)

*Update protocol: when work lands, refresh the scope/test lines above and record the detail in the editorial log + `EXECUTION_HISTORY.md`. Keep this section a compact snapshot — do not let it grow back into a changelog.*

## Project structure

```
bible-tt/
├── content/{en,pt-br,de,es}/{genesis,john,matthew}/   # CHAPTER-N, INTRODUCTION, PEOPLE
│   └── study/                                          # CHAPTER-N-CONTEXT; CHAPTER-N-PROPHECY (where warranted)
│   └── CONTEXT.md                                      # book-level cross-chapter motifs
├── docs/
│   ├── rules/                # RULES-CORE.md + RULES-HB.md + RULES-GS.md + CHANGELOG-v3.x + proposals/
│   ├── source-analysis/      # METHOD.md (source-analysis method) + hebrew/greek/aramaic worked-example corpus (internal)
│   ├── architecture/         # STANDARDS.md (DDD, code standards, TypeScript, testing)
│   ├── design/               # TT-DESIGN-SYSTEM.md (UI/UX, typography, color, accessibility)
│   ├── audit/                # PENDING.md, FIX_IMPLEMENTATION.md, EXECUTION_HISTORY.md, plans, archive/
│   ├── editorial-log/        # Decision logs (genesis, john, matthew, transliteration-decisions)
│   ├── feedback/             # FEEDBACK.md, DEFERRED_TASKS.md, possible-content.md
│   ├── implementation/       # PLAN.md, SCHEMA-FUTURE.sql
│   ├── guides/               # HOW-TO-READ-TT.md
│   └── templates/            # Companion + book-introduction templates
├── src/                      # Next.js web application
│   ├── app/[locale]/[book]/  # Book landing, chapter/, introduction/, people/, context/ sub-pages
│   ├── domain/               # Pure domain types (no framework deps)
│   ├── infrastructure/       # Adapters (5 parsers; i18n; fs-content-repository)
│   ├── ui/                   # Presentation (reading/, study/, enrichment/, people/, navigation/, shared/)
│   ├── hooks/                # React hooks
│   └── lib/                  # Utilities and content loader
└── public/                   # Static assets
```

## URL structure

| Route | Content |
|-------|---------|
| `/{locale}/{book}/` | Book landing — Overview + chapter list + 3 entry points (Introduction / People / Context) |
| `/{locale}/{book}/introduction` | Full book introduction |
| `/{locale}/{book}/chapter/{n}` | Chapter with 5 view modes |
| `/{locale}/{book}/people` | People & Genealogy — expanded profiles + SVG timeline |
| `/{locale}/{book}/context` | Book-level context — cross-chapter motifs |

Old URLs (`/{locale}/{book}/{n}`) redirect automatically to `/chapter/{n}`.

## Commands

- `pnpm dev` — dev server with Turbopack (http://localhost:3000)
- `pnpm build` — production build
- `pnpm test` — all unit tests (8 files: chapter, enrichment, people, prophecy, introduction, book-context parsers + render-markdown-safe + book-context-real)
- `pnpm lint` — Biome linter
- `pnpm content:lint` — hardened content lint (Phase 0 rules; see `docs/audit/FIX_IMPLEMENTATION.md`); allow-list at `scripts/lint-allowlist.txt`
- `pnpm content:lint:warn` — same lint, non-blocking (exit 0)

## Architecture

Governed by `docs/architecture/STANDARDS.md`. Key decisions:

- **Static-first:** authored markdown parsed at build time. No database, no API; pages served from CDN.
- **DDD layers:** `domain/` (pure types) → `infrastructure/` (adapters) → `ui/` (components) → `app/` (routing). Domain knows nothing about Next.js.
- **Content pipeline:** 5 parser files in `src/infrastructure/content/` → `markdown-parser` (chapters → `ChapterData`), `enrichment-parser` (companions → `EnrichmentData`; also hosts `parseIntroductionMarkdown` → `IntroductionData`), `people-parser` (PEOPLE.md → `PeopleData`), `prophecy-parser` (→ `ProphecyData`), `book-context-parser` (CONTEXT.md → `BookContextData`).
- **Cross-book PEOPLE pattern (RULES-CORE.md Rule 29, v3.3.2):** when a person spans books, one canonical entry lives in the "canonical home" book's PEOPLE.md; other books use a see-only stub (`**See:** {book}/PEOPLE.md` + `**In <Book>:** [role]`). Parser, UI (`CrossBookSeeField`), and `bookLabels` map handle this with a dangling-pointer fallback. See RULES-CORE.md for the 5-change new-book activation checklist before adding any new book's PEOPLE.md.
- **i18n:** URL-based locale routing; content in `.md` files, UI strings in `src/infrastructure/i18n/messages/`.
- **Five view modes:** Reading | Study | Explore (curated highlights) | Context (full enrichment) | Prophecy.

## Design system

Governed by `docs/design/TT-DESIGN-SYSTEM.md`. Essentials: Newsreader (serif reading) + Geist (UI) + Geist Mono (data), 14px min for prose; OKLCH tokens only (no hardcoded hex, no pure black/white); Lucide icons at 1.5px stroke (never emoji); WCAG 2.2 AA (focus rings, 44×44px tap targets, `prefers-reduced-motion`); anti-slop (no religious clichés, gradient orbs, card soup, or decorative animation).

## Translation rules

Governed by `docs/rules/RULES-CORE.md` + `RULES-HB.md` + `RULES-GS.md` (29 rules). Must-know principles:

- **Prime Directive:** do not simplify what the source keeps complex; do not clarify what it leaves ambiguous.
- **Rule 25 (divine name):** rendered consonantally — YHWH (EN/PT/ES), JHWH (DE) — never "LORD."
- **Rule 3 + corollary:** no imported theology; restraint cuts both ways (anti-traditional reflex is also dishonest).
- **Rule 11:** grammatical additions marked in italics. **Rule 13:** uncertainty levels (Probable / Possible / Uncertain) on debated terms.
- **Rule 29:** enrichment lives in companion files only, dual-labeled (claim-type + confidence); Tier 2 notes max 3 sentences, excess relocated with a pointer.
- **Name rendering (v3.2):** familiar target-language form as default, transliterated form once per section; exceptions: YHWH/JHWH, Yehudim, technical transliterations. See RULES-HB/GS proper-name tables.
- **GS specifics:** Greek Article System (articular vs. anarthrous); Ioudaioi three-sense policy with anti-misuse safeguard.

Log every decision in `docs/editorial-log/{book}.md` (schema in RULES-CORE.md §Editorial Log Specification).

**Source-language analysis:** the lexeme-level method behind Tier 1/2 rendering + the worked-example corpus live in `docs/source-analysis/` (`METHOD.md` + `hebrew/`/`greek/`/`aramaic/`) — internal-only; feeds main text, Tier 2 notes, and companion §A/§D.

## Content authoring

**New chapter:**
1. Create `content/{locale}/{book}/CHAPTER-N.md` following existing structure.
2. Create `content/{locale}/{book}/study/CHAPTER-N-CONTEXT.md` from `docs/templates/contextual-companion-template.md`.
3. Include Section I (The World at the Time) with multi-scenario composition framing (see existing chapters).
4. Parser auto-discovers new files. Run `pnpm test` → `pnpm build`.

**New book introduction:**
1. Create `content/{locale}/{book}/INTRODUCTION.md` from `docs/templates/book-introduction-template.md`.
2. Sections A–F AVAILABLE (include only with substantive content); Section G (Sources) MANDATORY.
3. Follow the dual-label system and include the disclaimer block.

**Name rendering:** first occurrence per section "Transliterated (Familiar)" (e.g. "Yochanan (John)"); subsequent: familiar only. Exceptions: YHWH/JHWH, Yehudim, technical terms (raqia, bara…). Never produce redundant `Name (Name)` (v3.3.1). See proper-name tables in RULES-HB/GS.

**Translation decisions:** log in `docs/editorial-log/{book}.md` before drafting; new glossary terms via the glossary expansion procedure (RULES-CORE.md). **EN-first, then PT-BR, DE, ES.**

## Tech stack

Next.js 16 (App Router, RSC, Turbopack) · Tailwind CSS v4 (OKLCH tokens) · next-intl · Lucide (1.5px) · Vitest · Biome.
