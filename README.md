# The Transparent Translation (TT)

A multilingual Bible translation and study web application built for radical linguistic transparency.

> *"A translation with nothing hidden."*

## What is the Transparent Translation?

The TT is a disciplined translation of the Hebrew Bible and Greek Scriptures into English, Brazilian Portuguese, German, and Spanish. It preserves source-text ambiguity rather than smoothing it, marks every word added for grammar, and refuses to import later theological vocabulary into the ancient text.

**Current scope:** Genesis 1–12, John 1–3, and Matthew 1–3 in all four languages, with contextual study companions, book introductions, people profiles with timeline, and prophecy tracking.

## Read it

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Five ways to read

### Reading Mode

Continuous prose with superscript verse numbers. Clean typography. The text speaks; the UI recedes.

### Study Mode

Verse-by-verse with expandable color-coded notes:
- **Critical** — major textual or translation decisions
- **Lexical** — word meanings, root patterns, glossary terms
- **Grammatical** — Hebrew/Greek structure, verb forms, syntax
- **Theological** — interpretive options, ambiguity preservation

Plus expandable glossary, cross-chapter tracking, and supplementary analysis.

### Explore Mode

Curated highlights from the chapter's background research — curiosities, historical context ("The World at the Time"), and scientific observations. Accessible narrative format with confidence indicators.

### Context Mode

Full contextual study companion with expandable topic sections:
- **Source Text Features** — what the TT makes visible that traditional translations smooth
- **ANE Parallels** — Enuma Elish, Atrahasis, Gilgamesh, comparative motifs
- **Historical & Archaeological** — ANE cosmology, flood evidence, treaty traditions
- **Linguistic Deep Dives** — rare words, semantic fields, comparative Semitics
- **Scientific Correspondence** — what the text presents vs. what modern science describes
- **Later Reception** — Jewish, Christian, Islamic readings (labeled as post-biblical)
- **Curiosities** — text-linked observations and open questions
- **The World at the Time** — multi-scenario historical context (what was life like when this was written?)

Every entry labeled by claim-type and confidence level. Sources cited. Entries sorted by confidence (most established first). The enrichment draws no conclusions — the reader does.

### Prophecy Mode

Tracks prophetic statements with fulfillment status across traditions (Jewish, Christian, Islamic). Each tradition's reading labeled as LATER RECEPTION — DOCUMENTED. No tradition privileged over others.

## People & Genealogy

Dedicated sub-page per book (`/{locale}/{book}/people`) with:
- Expanded biographical profiles (profession, social class, hometown, places lived, archaeological evidence, extra-biblical mentions)
- Historicity status per person (VERIFIED, PROBABLE, POSSIBLE, UNCERTAIN, LITERARY)
- SVG timeline infographic showing lifespans and overlaps (Masoretic Text chronology for OT; historical dates for NT)
- Character arcs and key speeches

Currently authored for **Genesis** and **Matthew** in all four locales. The John PEOPLE.md is not yet authored — see `docs/audit/PENDING.md`.

## Languages

Switch between languages on any page:

| Locale | URL | Example |
|--------|-----|---------|
| English | `/en/genesis/chapter/1` | *In beginning, God created the skies and the land.* |
| Português | `/pt-br/genesis/chapter/1` | *Em princípio, Deus criou os céus e a terra.* |
| Deutsch | `/de/genesis/chapter/1` | *Im Anfang schuf Gott den Himmel und das Land.* |
| Español | `/es/genesis/chapter/1` | *En principio, Dios creó los cielos y la tierra.* |

## Name rendering

The TT uses familiar target-language names as default, with the transliterated source-language form shown once at first occurrence per section for transparency:

- First mention: "Yochanan (John) was immersing in the Jordan (Yarden)."
- After that: "John answered them..."

Exceptions: YHWH/JHWH (always transliterated — Rule 25), Yehudim (always transliterated — anti-reception-history safeguard), and technical terms like *raqia* (transliterated per Rule 4).

## Translation methodology

Governed by a [29-rule system](docs/rules/RULES-CORE.md) (v3.3) with a Prime Directive:

1. Do not simplify what the source text keeps complex.
2. Do not clarify what the source text leaves ambiguous.
3. Do not add what the source text does not say.
4. When addition is unavoidable, signal it clearly.

Key decisions:
- **YHWH** rendered consonantally (not "LORD") — Rule 25
- **Ambiguity preserved** via slash notation (*wind/spirit*, *side/rib*, *desire/turning*) — Rule 2
- **No imported theology** (*nachash* = serpent, not Satan; no "Fall" vocabulary) — Rule 3
- **Source structure visible** (*"dying you shall die"*, not "you shall surely die") — Rule 5
- **Contextual enrichment governed** by Rule 29 — companion files only, labeled by type and certainty
- **Restraint matters both ways** — anti-traditional reflex is as dishonest as traditional smoothing (Rule 3 corollary)
- **Greek Article System** — article presence/absence evaluated per Greek syntax, not mechanically mapped (GS supplement)
- **Ioudaioi Policy** — three-sense decision tree with anti-misuse safeguard for John's Gospel
- **Multi-scenario composition framing** — Section I ("The World at the Time") presents historical context for all major dating scenarios without taking sides

All decisions logged in the editorial logs ([genesis.md](docs/editorial-log/genesis.md), [john.md](docs/editorial-log/john.md), [matthew.md](docs/editorial-log/matthew.md)).

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, RSC, Turbopack) |
| Styling | Tailwind CSS v4, OKLCH tokens |
| Typography | Newsreader serif + Geist sans + Geist Mono |
| Icons | Lucide (1.5px stroke) |
| i18n | next-intl (URL-based routing) |
| Content | Markdown parsed at build time (4 parsers) |
| Testing | Vitest (796 tests across 6 files) |
| Linting | Biome |

> **Project state (2026-05-09):** Genesis 1–12, John 1–3, Matthew 1–3 in EN/PT-BR/DE/ES. Content carries `provisional` status pending reviewer sign-off (Rule 28). The 2026-05-08–09 audit cycle (Phases 0–6 in `docs/audit/FIX_IMPLEMENTATION.md`) closed governance gaps — version-stamp drift, ES NT diacritics + Reina-Valera, PT-BR Almeida Option B, PT-BR + ES `monogenēs`, em-dash sweep, Biome migration, Book Introduction split, Ruleset v3.3 amendments, *charis* cross-locale slash compliance, cross-locale verse-text title capitalization (Rule 20 strict reading), and a Genesis 9 Rule 29 §734 Tier 2 Relocation Protocol pilot. Of 38 prior-audit issues, 23 are RESOLVED, 3 PARTIAL, 12 NOT VERIFIED, 0 STILL OPEN. Remaining work — John PEOPLE.md authoring, readability sweep on John/Matthew companions, Section I 10-category audit, Book Context page content cycle, Tier 2 propagation to remaining 17 chapters, prophecy decision, Genesis 13–50 — is tracked in `docs/audit/PENDING.md` and `docs/feedback/`.

## Project structure

```
bible-tt/
├── content/                 # All content files (4 locales × 3 books)
│   ├── en/{genesis,john,matthew}/   # English chapters, companions, introductions, people
│   ├── pt-br/{genesis,john,matthew}/
│   ├── de/{genesis,john,matthew}/
│   └── es/{genesis,john,matthew}/
├── docs/
│   ├── rules/               # RULES-CORE.md (v3.3) + RULES-HB.md + RULES-GS.md (29 rules)
│   ├── architecture/        # STANDARDS.md (DDD, code standards)
│   ├── design/              # TT-DESIGN-SYSTEM.md (UI/UX)
│   ├── editorial-log/       # Decision logs (genesis, john, matthew, transliteration-decisions)
│   ├── feedback/            # Consolidated audit record + future work
│   └── templates/           # Companion and introduction templates
├── src/
│   ├── domain/              # Pure types (Chapter, Verse, Note, Enrichment, Person, Prophecy)
│   ├── infrastructure/      # 4 parsers + i18n config
│   ├── ui/                  # Components (reading, study, enrichment, people, navigation, shared)
│   └── app/                 # Next.js pages ([locale]/[book]/chapter/[chapter], people, context)
└── public/                  # Static assets
```

## Standards

- **UI/UX:** [docs/design/TT-DESIGN-SYSTEM.md](docs/design/TT-DESIGN-SYSTEM.md) — typography, color, accessibility, anti-slop
- **Architecture:** [docs/architecture/STANDARDS.md](docs/architecture/STANDARDS.md) — DDD, TypeScript, testing, dependencies
- **Translation:** [docs/rules/RULES-CORE.md](docs/rules/RULES-CORE.md) + [RULES-HB.md](docs/rules/RULES-HB.md) + [RULES-GS.md](docs/rules/RULES-GS.md) — 29-rule governance system (v3.3)

## Contributing

The translation is governed by the rules in `docs/rules/`. All chapter files carry `provisional` status pending reviewer sign-off (Rule 28). The project needs:

- **Hebraist** — reading proficiency in Biblical Hebrew; access to BHS/BHQ apparatus
- **Hellenist** — reading proficiency in Koine Greek; access to NA28 apparatus
- **Target-language editors** — native speakers for EN, PT-BR, DE, ES
- **Cross-alignment reviewer** — reads multiple target languages

See Rule 28 for the full review workflow.

## License

Content and code are open. Formal license TBD.

---

**Developers:** Bar (Project Lead) & Claude (AI Assistant)
