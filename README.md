# The Transparent Translation (TT)

A multilingual Bible translation and study web application built for radical linguistic transparency.

> *"A translation with nothing hidden."*

## What is the Transparent Translation?

The TT is a disciplined translation of the Hebrew Bible from the Masoretic Text into English, Brazilian Portuguese, and German. It preserves Hebrew ambiguity rather than smoothing it, marks every word added for grammar, and refuses to import later theological vocabulary into the ancient text.

**Current scope:** Genesis 1–6 in all three languages, with contextual study companions.

## Read it

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Three ways to read

### Reading Mode

Continuous prose with superscript verse numbers. Clean typography. The text speaks; the UI recedes.

### Study Mode

Verse-by-verse with expandable color-coded notes:
- **Critical** — major textual or translation decisions
- **Lexical** — word meanings, root patterns, glossary terms
- **Grammatical** — Hebrew structure, verb forms, syntax
- **Theological** — interpretive options, ambiguity preservation

Plus expandable glossary, cross-chapter tracking, and supplementary analysis.

### Context Mode

Contextual study companion with expandable topic sections:
- **Hebrew Text Features** — what the TT makes visible that traditional translations smooth
- **Ancient Near Eastern Parallels** — Enuma Elish, Atrahasis, Gilgamesh, comparative motifs
- **Historical & Archaeological** — ANE cosmology, flood evidence, treaty traditions
- **Linguistic Deep Dives** — rare words, semantic fields, comparative Semitics
- **Scientific Correspondence** — what the text presents vs. what modern science describes (neither concordism nor anti-concordism)
- **Later Reception** — Jewish, Christian, Islamic readings (labeled as post-biblical)
- **Curiosities** — text-linked observations and open questions

Every entry labeled by claim-type and confidence level. Sources cited. The enrichment draws no conclusions — the reader does.

## Languages

Switch between languages on any page — the current book and chapter are preserved:

| Locale | URL | Example |
|--------|-----|---------|
| English | `/en/genesis/1` | *In beginning, God created the skies and the land.* |
| Português | `/pt-br/genesis/1` | *Em princípio, Deus criou os céus e a terra.* |
| Deutsch | `/de/genesis/1` | *Im Anfang schuf Gott den Himmel und das Land.* |

## Translation methodology

Governed by a [29-rule system](docs/rules/RULES.md) (v2.5) with a Prime Directive:

1. Do not simplify what the Hebrew keeps complex.
2. Do not clarify what the Hebrew leaves ambiguous.
3. Do not add what the Hebrew does not say.
4. When addition is unavoidable, signal it clearly.

Key decisions:
- **YHWH** rendered consonantally (not "LORD") — Rule 25
- **Ambiguity preserved** via slash notation (*wind/spirit*, *side/rib*, *desire/turning*) — Rule 2
- **No imported theology** (*nachash* = serpent, not Satan; no "Fall" vocabulary) — Rule 3
- **Hebrew structure visible** (*"dying you shall die"*, not "you shall surely die") — Rule 5
- **Contextual enrichment governed** by Rule 29 — companion files only, labeled by type and certainty
- **Restraint matters both ways** — anti-traditional reflex is as dishonest as traditional smoothing (Rule 3 corollary)

All decisions logged in the [editorial log](docs/editorial-log/genesis.md).

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, RSC, Turbopack) |
| Styling | Tailwind CSS v4, OKLCH tokens |
| Typography | Newsreader serif + Geist sans + Geist Mono |
| Icons | Lucide (1.5px stroke) |
| i18n | next-intl (URL-based routing) |
| Content | Markdown parsed at build time |
| Testing | Vitest (117 parser tests) |
| Linting | Biome |

## Project structure

```
bible-tt/
├── en/genesis/              # English chapters + study companions
│   └── study/               # Contextual companion files
├── pt-br/genesis/           # Portuguese chapters + companions
│   └── study/
├── de/genesis/              # German chapters + companions
│   └── study/
├── docs/
│   ├── rules/               # RULES.md (29 rules, v2.5)
│   ├── architecture/        # STANDARDS.md (DDD, code standards)
│   ├── design/              # TT-DESIGN-SYSTEM.md (UI/UX)
│   ├── editorial-log/       # Decision log
│   └── templates/           # Companion file template
├── src/
│   ├── domain/              # Pure types (Chapter, Verse, Note, Enrichment)
│   ├── infrastructure/      # Parsers, i18n config
│   ├── ui/                  # Components (reading, study, enrichment, navigation)
│   └── app/                 # Next.js pages
└── public/                  # Static assets
```

## Standards

- **UI/UX:** [docs/design/TT-DESIGN-SYSTEM.md](docs/design/TT-DESIGN-SYSTEM.md) — typography, color, accessibility, anti-slop
- **Architecture:** [docs/architecture/STANDARDS.md](docs/architecture/STANDARDS.md) — DDD, TypeScript, testing, dependencies
- **Translation:** [docs/rules/RULES.md](docs/rules/RULES.md) — 29-rule governance system

## Contributing

The translation is governed by `docs/rules/RULES.md`. All chapter files carry `provisional` status pending reviewer sign-off (Rule 28). The project needs:

- **Hebraist** — reading proficiency in Biblical Hebrew; access to BHS/BHQ apparatus
- **Target-language editors** — native speakers for EN, PT-BR, DE
- **Cross-alignment reviewer** — reads all three target languages

See Rule 28 for the full review workflow.

## License

Content and code are open. Formal license TBD.

---

**Developers:** Bar (Project Lead) & Claude (AI Assistant)
**Source analysis:** Video transcripts by Elan (Hebrew speaker)
