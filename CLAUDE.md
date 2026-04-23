# CLAUDE.md — Bible TT Project

## What this project is

The Transparent Translation (TT) — a multilingual Bible translation project with a web application for reading, studying, and exploring contextual enrichment. The translation currently covers Genesis 1–6 in English, Brazilian Portuguese, and German, governed by a 29-rule system (v2.5) that prioritizes Hebrew fidelity, ambiguity preservation, and theological restraint.

## Project structure

```
bible-tt/
├── en/genesis/              # English chapter files (CHAPTER-1.md through CHAPTER-6.md)
│   └── study/               # Contextual companion files (CHAPTER-N-CONTEXT.md)
├── pt-br/genesis/           # Brazilian Portuguese chapter files + study companions
│   └── study/
├── de/genesis/              # German chapter files + study companions
│   └── study/
├── docs/
│   ├── rules/               # RULES.md (v2.5 — the 29-rule governance system)
│   ├── architecture/        # STANDARDS.md (DDD, code standards, TypeScript, testing)
│   ├── design/              # TT-DESIGN-SYSTEM.md (UI/UX, typography, color, accessibility)
│   ├── audit/               # Audit feedback and response documents
│   ├── editorial-log/       # Decision log (genesis.md, transliteration-decisions.md)
│   ├── implementation/      # PLAN.md, FEEDBACK.md, SCHEMA-FUTURE.sql
│   └── templates/           # Companion file template
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
- `pnpm test` — run all unit tests (117 parser tests: 108 chapter + 9 enrichment)
- `pnpm lint` — run Biome linter

## Architecture

Governed by `docs/architecture/STANDARDS.md`. Key decisions:

- **Static-first:** Authored markdown parsed at build time. No database. No API. Pages served from CDN.
- **DDD layers:** `domain/` (pure types) → `infrastructure/` (adapters) → `ui/` (components) → `app/` (routing). Domain knows nothing about Next.js.
- **Content pipeline:** Two parsers:
  - `markdown-parser.ts` — chapter files → `ChapterData` (verses, notes, glossary, cross-chapter tracking)
  - `enrichment-parser.ts` — companion files → `EnrichmentData` (sections A–H with claim-type + confidence labels)
- **i18n:** URL-based locale routing (`/en/genesis/1`, `/pt-br/genesis/1`, `/de/genesis/1`). Content translation in .md files; UI strings in `src/infrastructure/i18n/messages/`.
- **Three view modes:** Reading (continuous prose) | Study (verse-by-verse with notes) | Context (enrichment companion)

## Design system

Governed by `docs/design/TT-DESIGN-SYSTEM.md`. Key standards:

- **Typography:** Newsreader (serif, reading) + Geist (sans, UI) + Geist Mono (data). Minimum 14px for prose, 12px for mono labels only.
- **Color:** OKLCH tokens. Warm paper background. No hardcoded hex. No pure black/white.
- **Icons:** Lucide at 1.5px stroke. Never emoji as UI icons.
- **Accessibility:** WCAG 2.2 AA. Focus rings on all interactive elements. 44×44px tap targets. `prefers-reduced-motion` respected.
- **Anti-slop:** No religious clichés, no gradient orbs, no card soup, no decorative animation.

## Translation rules

Governed by `docs/rules/RULES.md` (v2.5, 29 rules). Key principles:

- **Prime Directive:** Do not simplify what Hebrew keeps complex; do not clarify what Hebrew leaves ambiguous.
- **Rule 25 (YHWH):** Rendered consonantally (YHWH in EN/PT, JHWH in DE), not as "LORD."
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

**Translation decisions:**
- Log in `docs/editorial-log/genesis.md` before drafting.
- New glossary terms added to RULES.md locked glossary.
- EN-first, then PT-BR and DE follow.

## Tech stack

- Next.js 16 (App Router, React Server Components, Turbopack)
- Tailwind CSS v4 with OKLCH color tokens
- next-intl for i18n
- Lucide for icons (1.5px stroke)
- Vitest for testing (117 tests)
- Biome for linting
- 8 production dependencies, 9 dev dependencies
