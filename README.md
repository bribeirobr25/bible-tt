# The Transparent Translation (TT)

A multilingual Bible translation and study web application built for radical linguistic transparency.

> *"A translation with nothing hidden."*

## What is the Transparent Translation?

The TT is a disciplined translation of the Hebrew Bible and Greek Scriptures into English, Brazilian Portuguese, German, and Spanish. It preserves source-text ambiguity rather than smoothing it, marks every word added for grammar, and refuses to import later theological vocabulary into the ancient text.

**Current scope:** Genesis 1–12, John 1–3, Matthew 1–3, and Mark 1–3 in all four languages, plus a Luke 1–3 pilot in English (other locales pending), with contextual study companions, book introductions, people profiles with timeline, and prophecy tracking.

## Read it

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser. (The dev server runs on port 3001 by project convention.)

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

Currently authored for **Genesis**, **John**, **Matthew**, and **Mark** in all four locales, plus **Luke** in English (pilot). Cross-book canonical-entry convention (RULES-CORE.md Rule 29 §People and Genealogy Files, v3.3.2): when a person appears in multiple books, a single canonical entry lives in one book's PEOPLE.md and other books use a see-only stub (`**See:** {book}/PEOPLE.md` + `**In <Book>:** [role]`). The UI renders see-only stubs with a clickable cross-book link and a graceful dangling-pointer fallback for forward references to unauthored books.

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

Governed by a [30-rule system](docs/rules/RULES-CORE.md) (v3.4) with a Prime Directive:

1. Do not simplify what the source text keeps complex.
2. Do not clarify what the source text leaves ambiguous.
3. Do not add what the source text does not say.
4. When addition is unavoidable, signal it clearly.

Key decisions:
- **YHWH** rendered consonantally (not "LORD") — Rule 25
- **Ambiguity preserved** via slash notation (*wind/spirit*, *side/rib*, *desire/turning*) — Rule 2
- **No imported theology** (*nachash* = serpent, not Satan; no "Fall" vocabulary) — Rule 3
- **Source structure visible** (*"dying you shall die"*, not "you shall surely die") — Rule 5
- **Reader-facing text markers** — words added for grammar (italics), transliterated terms, preserved-ambiguity slashes, and direct divine speech are each marked with their own colour so the reader sees the text's seams — Rules 11/4/2/30
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
| Testing | Vitest (882 tests across 13 files) |
| Linting | Biome |

> **Project state (2026-06-21):** Genesis 1–12, John 1–3, Matthew 1–3 in EN/PT-BR/DE/ES, plus a Mark 1–3 pilot in EN — chapters + INTRODUCTION + PEOPLE + Book Context per book, study companions per chapter. All content carries `provisional` status pending reviewer sign-off (Rule 28). The web app is complete through the UX/Structure program (SEO baseline; a derived structured layer guarded by a zero-loss conservation gate; the three-door IA; content QA; UX finish) and the §I "World at the Time" **Option C** restructure. The "Light & Darkness" redesign and the reader-facing text-highlight markers (Rules 11/4/2/30) are merged and live on `main`. Ruleset **v3.4** (30 rules); all chapters stamped v3.4. 882 tests across 13 files; `build`/`lint`/`content:lint` clean. **Largest remaining work:** Genesis 13–50. Full completed-work ledger → `docs/audit/EXECUTION_HISTORY.md`; open items → `docs/audit/PENDING.md`.

## Project structure

```
bible-tt/
├── content/                 # All content files (4 books × 4 locales, + Luke EN-only pilot)
│   ├── en/{genesis,john,matthew,mark,luke}/   # chapters, companions, introductions, people (luke = EN-only pilot)
│   ├── pt-br/{genesis,john,matthew,mark}/
│   ├── de/{genesis,john,matthew,mark}/
│   └── es/{genesis,john,matthew,mark}/
├── docs/
│   ├── rules/               # RULES-CORE.md (v3.4) + RULES-HB.md + RULES-GS.md (30 rules)
│   ├── architecture/        # STANDARDS.md (DDD, code standards)
│   ├── design/              # TT-DESIGN-SYSTEM.md (UI/UX)
│   ├── editorial-log/       # Decision logs (genesis, john, matthew, transliteration-decisions)
│   ├── audit/               # EXECUTION_HISTORY.md (completed) + PENDING.md (open items)
│   ├── source-analysis/     # Internal source-language method + worked-example corpus
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
- **Translation:** [docs/rules/RULES-CORE.md](docs/rules/RULES-CORE.md) + [RULES-HB.md](docs/rules/RULES-HB.md) + [RULES-GS.md](docs/rules/RULES-GS.md) — 30-rule governance system (v3.4)
- **Development workflow:** [CONTRIBUTING.md](CONTRIBUTING.md) — setup, the definition-of-done gate, branch/commit conventions, and the content-authoring + planning loops

## Contributing

For development setup, the definition-of-done gate, branch/commit conventions, and the content-authoring + planning workflows, see **[CONTRIBUTING.md](CONTRIBUTING.md)**.

The translation itself is governed by the rules in `docs/rules/`. All chapter files carry `provisional` status pending reviewer sign-off (Rule 28). The project needs:

- **Hebraist** — reading proficiency in Biblical Hebrew; access to BHS/BHQ apparatus
- **Hellenist** — reading proficiency in Koine Greek; access to NA28 apparatus
- **Target-language editors** — native speakers for EN, PT-BR, DE, ES
- **Cross-alignment reviewer** — reads multiple target languages

See Rule 28 for the full review workflow.

## License

Content and code are open. Formal license TBD.

---

**Developers:** Bar (Project Lead) & Claude (AI Assistant)
