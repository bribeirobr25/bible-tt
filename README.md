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

## Three ways to read

Every chapter opens on three doors, each a real, crawlable URL.

### Read

Continuous prose with superscript verse numbers. Clean typography. The text speaks; the UI recedes. (`/{locale}/{book}/chapter/{n}`)

### Notes

Verse-by-verse with expandable color-coded notes:
- **Critical** — major textual or translation decisions
- **Lexical** — word meanings, root patterns, glossary terms
- **Grammatical** — Hebrew/Greek structure, verb forms, syntax
- **Theological** — interpretive options, ambiguity preservation

Plus expandable glossary, cross-chapter tracking, supplementary analysis, and `#v{n}` verse deep-links. (`/chapter/{n}/notes`)

### Deeper

Historical and linguistic background, prophecy readings, and the people behind the text — surfaced only where such material exists. (`/chapter/{n}/deeper`) Sub-tabs:

- **Background** — the full contextual study companion: Source-Text Features · ANE Parallels · Historical & Archaeological · Linguistic Deep Dives · Scientific Correspondence · Later Reception (Jewish/Christian/Islamic, labeled post-biblical) · Curiosities · The World at the Time (multi-scenario historical context, scenario → sub-dimension cards). Every entry labeled by claim-type and confidence; sources cited; the enrichment draws no conclusions — the reader does.
- **Prophecies** — prophetic statements with fulfillment status across traditions (Jewish, Christian, Islamic). Each tradition's reading labeled LATER RECEPTION — DOCUMENTED. No tradition privileged over others.
- **People** — link to the book's People & Genealogy page.

New readers can also start at `/{locale}/start` — a "Why this order?" reading-plan roadmap.

## People & Genealogy

Dedicated sub-page per book (`/{locale}/{book}/people`) with:
- Expanded biographical profiles (profession, social class, hometown, places lived, archaeological evidence, extra-biblical mentions)
- Historicity status per person (VERIFIED, PROBABLE, POSSIBLE, UNCERTAIN, LITERARY)
- SVG timeline infographic showing lifespans and overlaps (Masoretic Text chronology for OT; historical dates for NT)
- Character arcs and key speeches

Currently authored for **Genesis**, **John**, and **Matthew** in all four locales. Cross-book canonical-entry convention (RULES-CORE.md Rule 29 §People and Genealogy Files, v3.3.2): when a person appears in multiple books, a single canonical entry lives in one book's PEOPLE.md and other books use a see-only stub (`**See:** {book}/PEOPLE.md` + `**In <Book>:** [role]`). The UI renders see-only stubs with a clickable cross-book link and a graceful dangling-pointer fallback for forward references to unauthored books.

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
| Content | Markdown parsed at build time (5 parser files; 6 parse functions) |
| Testing | Vitest (841 tests across 9 files) |
| Linting | Biome |

> **Project state (2026-06-06):** Genesis 1–12, John 1–3, Matthew 1–3 in EN/PT-BR/DE/ES, with INTRODUCTION + PEOPLE + Book Context per book and study companions per chapter. Content carries `provisional` status pending reviewer sign-off (Rule 28). **UX/Structure program (2026-06):** Phase 1 SEO baseline (per-page metadata, sitemap, JSON-LD, OG images); Phase 2 derived structured layer + stable IDs guarded by a conservation gate (zero content loss across all 204 files); Phase 3 three-door IA (**Read · Notes · Deeper**, real URLs) with `/context`→`/background`; Phase 4 content-QA pass; Phase 5 UX finish (teal/petrol accent, civilizational landing, `/start` reading plan, book "tight cards", chapter-overview de-jargon across all locales); §I "World at the Time" two-level scenario→sub-dimension parser+UI support + inline-`**Source:**` lift; latent parser-bug fixes (chapter metadata, DE claim labels). Tests 841 across 9 files. **Earlier — multi-phase governance + content audit closed across 2026-05-08 through 2026-05-18:** Ruleset v3.3 amendments (§Punctuation Governance, §Idiom Policy, §Glossary Expansion, formalized Editorial Log Specification, John 1:1c worked example); Phase 7 readability sweep on John/Matthew companions; Phase 8 Section I 10-category coverage parity (44 cross-reference quote-blocks + 8 narrative-specific entries × 4 locales); Phase 9 Book Context cycle (20 motifs × 4 locales + new `BookContextData` domain type + parser + page); Phase 10 John PEOPLE.md authoring (11 entries × 4 locales); Phase 11 Option C prophecy authoring (3 chapters × 4 locales); v3.3.1 emergency amendment + DE familiar-names sweep (259 redundant-parens occurrences corrected); Tier 2 note bloat propagation pilot (35 edits across Genesis 6 + John 2 + Matthew 1); Phase 13 cross-book PEOPLE formalization via v3.3.2 emergency amendment (markdown convention + locale-translation table + 7-slug allow-list + 5-change new-book activation checklist + warn-only §0.12 content-lint rule). Of 38 prior-audit issues, 24 are RESOLVED, 2 PARTIAL, 12 NOT VERIFIED, 0 STILL OPEN actionable. Largest remaining piece: Genesis 13–50 authoring (Phase 12). Full ledger in `docs/audit/PENDING.md` and `docs/feedback/`.

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
│   ├── domain/              # Pure types (Chapter, Verse, Note, Enrichment, Introduction, Person, Prophecy, BookContext)
│   ├── infrastructure/      # 5 parser files (markdown, enrichment, people, prophecy, book-context) + i18n config
│   ├── ui/                  # Components (reading, study, enrichment, people, navigation, shared)
│   └── app/                 # Next.js pages ([locale]/[book]/{chapter, introduction, people, context})
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
