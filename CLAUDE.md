# CLAUDE.md — Bible TT Project

## What this project is

The Transparent Translation (TT) — a multilingual Bible translation project with a web application for reading, studying, and exploring contextual enrichment. The translation currently covers Genesis 1–9 in English, Brazilian Portuguese, German, and Spanish, governed by a 29-rule system (v2.6) that prioritizes source-text fidelity, ambiguity preservation, and theological restraint.

## Project structure

```
bible-tt/
├── en/genesis/              # English chapter files (CHAPTER-1.md through CHAPTER-9.md)
│   ├── INTRODUCTION.md      # Book-level introduction (Rule 29)
│   └── study/               # Contextual companion files (CHAPTER-N-CONTEXT.md)
├── pt-br/genesis/           # Brazilian Portuguese chapter files + study companions
│   ├── INTRODUCTION.md
│   └── study/
├── de/genesis/              # German chapter files + study companions
│   ├── INTRODUCTION.md
│   └── study/
├── es/genesis/              # Spanish chapter files + study companions
│   ├── INTRODUCTION.md
│   └── study/
├── docs/
│   ├── rules/               # RULES-CORE.md + RULES-HB.md + RULES-GS.md (v3.0, 29 rules)
│   ├── architecture/        # STANDARDS.md (DDD, code standards, TypeScript, testing)
│   ├── design/              # TT-DESIGN-SYSTEM.md (UI/UX, typography, color, accessibility)
│   ├── audit/               # Audit feedback, response documents, refactoring plans
│   ├── editorial-log/       # Decision log (genesis.md, transliteration-decisions.md)
│   ├── implementation/      # PLAN.md, FEEDBACK.md, SCHEMA-FUTURE.sql
│   └── templates/           # Companion file template + book introduction template
├── src/                     # Next.js web application
│   ├── app/                 # App Router pages ([locale]/[book]/[chapter], rules)
│   ├── domain/              # Pure domain types (no framework deps)
│   ├── infrastructure/      # Adapters (markdown parser, enrichment parser, i18n)
│   ├── ui/                  # Presentation (reading/, study/, enrichment/, navigation/, shared/)
│   ├── hooks/               # React hooks
│   └── lib/                 # Utilities and content loader
└── public/                  # Static assets (favicon)
```

## Commands

- `pnpm dev` — start dev server with Turbopack (http://localhost:3000)
- `pnpm build` — production build
- `pnpm test` — run all unit tests (chapter parser + enrichment parser)
- `pnpm lint` — run Biome linter

## Architecture

Governed by `docs/architecture/STANDARDS.md`. Key decisions:

- **Static-first:** Authored markdown parsed at build time. No database. No API. Pages served from CDN.
- **DDD layers:** `domain/` (pure types) → `infrastructure/` (adapters) → `ui/` (components) → `app/` (routing). Domain knows nothing about Next.js.
- **Content pipeline:** Two parsers:
  - `markdown-parser.ts` — chapter files → `ChapterData` (verses, notes, glossary, cross-chapter tracking)
  - `enrichment-parser.ts` — companion files → `EnrichmentData` (sections A–H with claim-type + confidence labels)
- **i18n:** URL-based locale routing (`/en/genesis/1`, `/pt-br/genesis/1`, `/de/genesis/1`, `/es/genesis/1`). Content translation in .md files; UI strings in `src/infrastructure/i18n/messages/`.
- **Four view modes:** Reading (continuous prose) | Study (verse-by-verse with notes) | Context (enrichment companion) | Explore (narrative enrichment)

## Design system

Governed by `docs/design/TT-DESIGN-SYSTEM.md`. Key standards:

- **Typography:** Newsreader (serif, reading) + Geist (sans, UI) + Geist Mono (data). Minimum 14px for prose, 12px for mono labels only.
- **Color:** OKLCH tokens. Warm paper background. No hardcoded hex. No pure black/white.
- **Icons:** Lucide at 1.5px stroke. Never emoji as UI icons.
- **Accessibility:** WCAG 2.2 AA. Focus rings on all interactive elements. 44×44px tap targets. `prefers-reduced-motion` respected.
- **Anti-slop:** No religious clichés, no gradient orbs, no card soup, no decorative animation.

## Translation rules

Governed by `docs/rules/RULES-CORE.md` + `docs/rules/RULES-HB.md` (v3.0, 29 rules). Key principles:

- **Prime Directive:** Do not simplify what the source text keeps complex; do not clarify what the source text leaves ambiguous.
- **Rule 25 (YHWH):** Rendered consonantally (YHWH in EN/PT/ES, JHWH in DE), not as "LORD."
- **Rule 3 + corollary:** No imported theology; restraint matters both ways (anti-traditional reflex is also dishonest).
- **Rule 11:** Additions for grammar marked in italics.
- **Rule 13:** Uncertainty levels (Probable / Possible / Uncertain) on all debated terms.
- **Rule 29:** Contextual enrichment in companion files only, labeled by claim-type + confidence.

All decisions logged in `docs/editorial-log/genesis.md`.

## Content authoring

**New chapter:**
1. Create `{locale}/genesis/CHAPTER-N.md` following the existing structure.
2. Create `{locale}/genesis/study/CHAPTER-N-CONTEXT.md` using `docs/templates/contextual-companion-template.md`.
3. Parser auto-discovers new files via filesystem scan.
4. Run `pnpm test` → `pnpm build` to verify.

**New book introduction:**
1. Create `{locale}/{book}/INTRODUCTION.md` using `docs/templates/book-introduction-template.md`.
2. Sections A–F are AVAILABLE (include only with substantive content); Section G (Sources) is MANDATORY.
3. Follow the dual-label system (claim-type + confidence) and include the disclaimer block.
4. EN-first, then PT-BR, DE, and ES follow.

**Translation decisions:**
- Log in `docs/editorial-log/genesis.md` before drafting.
- New glossary terms added to RULES.md locked glossary.
- EN-first, then PT-BR, DE, and ES follow.

## Tech stack

- Next.js 16 (App Router, React Server Components, Turbopack)
- Tailwind CSS v4 with OKLCH color tokens
- next-intl for i18n
- Lucide for icons (1.5px stroke)
- Vitest for testing
- Biome for linting
- 8 production dependencies, 9 dev dependencies
