# Redesign — Landing concepts (exploration round)

Standalone, awwwards-oriented redesign of the TT landing page, built as static prototypes
(plain HTML/CSS/JS, GSAP + Three.js from CDN) — **separate from the production Next.js app**.

This first round is a **decision aid**: five distinct landing-page directions, each a complete
page with its own colour world, typography, motion language, and a signature WebGL / GSAP hero
rooted in the text's own imagery. Pick one, and the rest of the site (start, rules, books, and the
Genesis set — with the reading pages kept calm and legible) gets built out in the winning style.

## View

Serve the folder so the CDN libraries and shaders load cleanly:

```bash
cd docs/redesign
python3 -m http.server 8848
# open http://localhost:8848/   (gallery → links to all five concepts)
```

## The five concepts

| # | Concept | Folder | Mood | Signature hero |
|---|---------|--------|------|----------------|
| 1 | **Genesis** | `concept-1-genesis/` | Cinematic dark → light | Three.js GPU particles: *tohu va-vohu* chaos resolving into an ordered dome behind the title |
| 2 | **Codex** | `concept-2-codex/` | Luminous editorial (warm paper) | GSAP kinetic Newsreader + pulsing ambiguity slashes (*wind/spirit*) + subtle WebGL light/grain shader |
| 3 | **Kinetic Scripture** | `concept-3-kinetic/` | Experimental typographic | Giant ghosted בראשית, kinetic char-split headline, slash-pair marquee, swiss grid |
| 4 | **Waters** | `concept-4-waters/` | Atmospheric / ambient | Three.js water shader with a pointer-reactive light "hovering over the waters" (Gen 1:2) |
| 5 | **Light & Darkness** | `concept-5-lightdark/` | Bold duotone / swiss grid | Shader day/night separation field (Gen 1:4); headline inverts across the seam via blend-mode |

## Notes

- **Copy:** live EN brand copy (from the production landing + i18n messages). EN only for now.
- **Responsive:** mobile-first; verified at phone (390), and desktop (1440); fluid `clamp()` scaling
  covers tablet. Reading-comfort and tap-target sizes follow the TT design system.
- **Accessibility:** every concept honours `prefers-reduced-motion` — animation pauses to a static
  composition (particles snap to the ordered state, shaders render a single still frame, scroll
  reveals show immediately). Colours stay within the TT OKLCH palette family (warm paper, teal/petrol
  `#006475` accent, deep-ink darks).
- **Libraries:** GSAP 3 + ScrollTrigger, Three.js r128 — all UMD globals from cdnjs (so the files also
  open over `file://` without an import map).

## Status

**Concept 5 — Light & Darkness — was selected and built out into the full 11-page site under `site/`.**

```
site/
├── assets/tt.css · tt.js     # shared design system + behaviour (separation shader, reveals, nav)
├── index.html                # landing (full spectacle: separation-field shader hero)
├── start.html                # reading-plan roadmap
├── rules.html                # Prime Directive + all 29 rules
├── books.html                # Genesis / John / Matthew
└── genesis/
    ├── index.html            # book hub (at-a-glance + chapters + entry points)
    ├── introduction.html     # sections A–G, dual-labelled
    ├── people.html           # SVG lifespan timeline + profile cards
    ├── background.html       # cross-chapter motifs
    ├── chapter-1.html        # READ door — calm continuous reading (full three-door showcase)
    ├── chapter-1-notes.html  # NOTES door — verse cards + colour-coded notes + glossary
    ├── chapter-1-deeper.html # DEEPER door — Background/Prophecies sub-tabs, dual-label entries
    └── chapter-2.html … chapter-12.html   # READ door for every chapter (whole book reads end-to-end)
```

**View the built site:** `python3 docs/redesign/tools/serve.py` (a tiny **no-cache** static server —
avoids stale CSS/JS after edits), then open `http://localhost:8848/site/`. (`python3 -m http.server
8848` from `docs/redesign/` also works but caches assets; hard-refresh after edits.) The gallery
`index.html` links to the site at the top.

**Design split (as agreed):** marketing pages (landing/start/rules/books) carry the heavy
spectacle — the Gen 1:4 separation-field shader hero, blend-mode headlines, swiss-grid sections.
Reading pages (chapter / notes / deeper) stay calm and legible: Newsreader at comfortable size,
a slim light↔dark "seam" motif instead of a full shader, petrol verse numbers, colour-coded notes.

**Robustness:** scroll-reveals are gated behind an `html.tt-js` class, so all content is visible
without JS; `prefers-reduced-motion` pauses every animation to a static composition. Content is the
real EN text pulled from `content/en/genesis/*` and `messages/en.json`. Verified at phone (390) and
desktop (1280–1440) in Chrome via the browser MCP.

**Build-out progress:**
1. ✅ Genesis fully readable — Read door for all 12 chapters; chapter grid + prev/next paging live.
   (Chapter 1 keeps the full three-door showcase; chapters 2–12 are Read-only in this preview,
   with Notes/Deeper shown as muted on the door-nav.) Continuous text generated from the real
   `content/en/genesis/CHAPTER-N.md` via `/tmp/build_chapters.py`; verse numbers + italics rendered
   by the `tt.js` reading formatter from raw markdown.
2. ✅ John & Matthew (second source language — Greek). Both books have a hub (at-a-glance card +
   chapters) and a Read door for all 3 chapters; **John 1 carries a full verse-by-verse Notes
   showcase** (Greek: *logos*, the anarthrous *theos* / Colwell, imperfect *ēn* vs aorist *egeneto*,
   the vv.3–4 punctuation variant, *katelaben*, plus a Greek glossary). The **Books page is now
   fully live** — all three books are "Read now". Read pages generated from real
   `content/en/{john,matthew}/CHAPTER-N.md`.
2b. ✅ **John & Matthew secondary surfaces** — introduction, people, background, and a per-chapter
   **Deeper** companion (Background + Prophecies sub-tabs, matching the original app) for all 6
   chapters. Generated by the parse-from-source pipeline (originally `tools/build_book_data.py`, now
   folded into the per-locale `tools/build_study_data.py`; thin shells from `tools/build_book_pages.py`,
   shared renderers `assets/render-*.js`). Hubs now
   carry Introduction / People / Background entry points; Deeper is enabled on every chapter door-nav.
   Conservation gate (asserts entries **and `####` sub-entries** + people + motifs + prophecy counts
   == source) passes: John intro 23 / people 11 / bg 6 motifs / deeper ch1-3 = 30+17+18 entries with
   2 scenarios×subs each / ch3 prophecy 1; Matthew intro 20 / people 16 / bg 5 / deeper 24+13+15 /
   prophecy ch1 1, ch2 4. (A scenario-detection bug that was silently dropping NT `#### IA-x`
   sub-entries was caught by adding the `####` assertion and fixed.)
3. ✅ **Language switcher (EN · PT · DE · ES) + search.**
   - A global header switcher (localStorage-persisted, sets `<html lang>`), injected by `tt.js` so
     every page has it. UI dictionary `assets/i18n.js` is built from the project's own
     `messages/*.json` (`tools/build_i18n.py`) — authentic translations.
   - **Flagship: the same scripture in four languages.** All 18 Read chapters' continuous reading +
     overview are generated per-locale (`tools/build_reading.py` → `reading-{book}-{n}.js`, rendered
     by `assets/render-reading.js`) and swap instantly with the switcher. A reading-conservation gate
     asserts the verse count is identical across all four locales per chapter. The landing page also
     localizes (via `data-i18n`); chrome (nav, doors, footer, breadcrumb) localizes site-wide.
   - **Search:** `search.html` over a ~940-entry client-side index (`tools/build_search.py` →
     `search-index.js`) spanning Reading, Deeper, Prophecy, Notes, Introduction, People, Background,
     Rules, and pages; ranked, highlighted snippets, kind chips, deep links. A "⌕ Search" link is
     injected into every nav. (build_search.py reads the per-locale data via its `en` view.)
4. ✅ **Study surfaces localized (EN · PT · DE · ES) + Notes doors for every chapter.**
   - **Localized study surfaces.** Deeper, People, Background and Introduction now render in all four
     languages. A single per-locale pipeline (`tools/build_study_data.py`) parses
     `content/{loc}/{book}/…` → per-locale data files (`{book}-intro/people/background.js`,
     `{book}-{n}-deeper.js`, `{book}-{n}-prophecy.js`, each `{en,pt-br,de,es}`); the shared renderers
     (`assets/render-{deeper,intro,people,background}.js`) are locale-aware and re-render on the
     `tt:locale` event. Genesis converged onto the same shared renderers (its People page keeps the
     bespoke SVG lifespan timeline). Structural labels are localized from source (scenario word,
     "Sources consulted" + its table headers) or from the project's own `messages/*` (claim/confidence
     dots, field labels). The English-preview toast now fires only on the marketing-page bodies
     (start/rules/books), whose long-form copy is still EN.
   - **Notes doors for all 18 chapters.** `tools/build_notes_data.py` parses each chapter's
     verse-by-verse study (emoji-typed notes 🔴🟢🔵🟡 → critical/lexical/grammatical/theological),
     glossary and supplementary sections → `notes-{book}-{n}.js` (`{en,pt-br,de,es}`); rendered by
     `assets/render-notes.js`, shells from `tools/build_notes_pages.py`. The Notes door is now enabled
     on every Read/Deeper door-nav (was a Genesis-1/John-1 showcase only).
   - **Conservation, per locale.** Both new pipelines gate on *each locale's own source*: study data
     asserts emitted == that locale's source counts (entries/subs/scenarios/people/motifs/prophecy);
     notes asserts verses == source and identical across all four locales. Where the EN companions are
     richer than the translations (they are, in a few chapters), each locale faithfully shows **its
     own** content and the divergence is **reported, never fabricated**.

Coverage note: Genesis, John and Matthew now all have the full set — hub, Introduction, People,
Background, and per-chapter Read + **Notes** + **Deeper** for EVERY chapter (Genesis 1–12, John 1–3,
Matthew 1–3), with the Prophecies sub-tab wherever a source PROPHECY companion exists (Genesis 3/9/12,
John 3, Matthew 1/2). Every reading + study + notes surface localizes across EN · PT · DE · ES.

## Content audit (done — `tools/content_audit.py` + `tools/compliance_audit.py`)

Two deterministic, source-independent audits + a 41-agent semantic pass (adversarially verified):
- **Parity:** 22,563/22,571 emitted text chunks found verbatim in their own source file across all 4
  locales; the 8 deltas are a verified false-positive (entries whose body wraps a mid-entry
  `**Source:**` line the builder correctly extracts). **Reference integrity 168/168** — every verse
  number, entry ID and motif maps to the correct source header, in order. No mojibake.
- **Compliance:** dual-label presence 100%; Rule-25 divine name clean in main text; italics preserved.
- The agent pass found **12 redesign defects → 5 root fixes**, all applied & re-verified: (1) surfaced
  the previously-missing Genesis Deeper 2–12 + Prophecy 3/9/12; (2) added DE confidence words
  `UNSICHER`/`MOEGLICH` so those entries regain their confidence dot; (3) italicise note-card titles
  (were literal `*asterisks*`); (4) stopped synthesising a scenario-level confidence badge from the
  first sub-item (John/Matthew §I); (5) render the Prophecy "Sources consulted" table; plus a parser
  fix for `**[label]**` lines with trailing text, and `ui.source` = Fonte/Quelle/Fuente.
- **Source-origin findings the redesign faithfully mirrors** (upstream content cleanups, not prototype
  bugs): emoji quoted in a few CONTEXT motifs; ~84 redundant `Name (Name)` in source prose; EN
  companions/notes richer than the translations in several chapters (a translation gap, shown, never
  fabricated).
Re-run both audit scripts after any content/build change.

To regenerate after a source edit, run (in order): `build_study_data.py`, `build_notes_data.py`,
`build_i18n.py`, `build_reading.py`, then the page shells `build_read_pages.py` / `build_book_pages.py`
/ `build_notes_pages.py`; then hard-refresh (or use `tools/serve.py`, now threaded + no-cache).
(The earlier EN-only `build_genesis_data.py` / `build_book_data.py` were **removed** this pass —
`build_study_data.py` is the single per-locale source for every study surface.)

## EN content-conservation audit (done)

A four-part audit compared every EN redesign page against its source of truth (`content/en/`, the
original `src/app` pages, `messages/en.json`). Headline result: **no scripture/translation text was
lost** — every Read page (Genesis 1–12, John 1–3, Matthew 1–3) reproduces the source *Continuous
Reading* verbatim (verses, italics, slash-terms). **No fabrication** — every enrichment entry maps to
a real source entry.

Fixes applied after the audit:
- **Errors:** Abram birth corrected to **AM 1948** (was 2008); "Yefet" → **Yafet**; Background
  disclosed "~twenty" motifs → corrected (source has **9**, now all 9 shown).
- **Silently-altered governance labels restored to source** on the Deeper page — C2
  (HISTORICAL/ARCHAEOLOGICAL), D1 *bara* (TEXTUAL — VERIFIED), *raqia* (PROBABLE) — and the entry IDs
  re-aligned to source (D1/D3/D4, no drift).
- **Restored dropped content:** Genesis 1 Notes now carries the three supplementary sections
  (Formula Tracking · Root Doubling · Verb Shifts); the Read overview regained "Key themes"; the
  Introduction regained entries **E4 & E5**; the landing regained `heroHeadline`, the full
  `heroSupport`, the `languageTagline`, and `differenceDesc`; the Rules page regained the Rule 1 example.
- **Disclosures added** so nothing is silently partial: the Deeper companion (curated subset of
  §A–§I + §H), the Introduction (source tables condensed to prose), and the People page (condensed
  field set; full figure list + Gen 5/11 genealogy tables pending).

## Full Genesis backfill — parse-from-source pipeline (done)

The Deeper companion and the People page are **complete**, generated by a conservation-gated parser
rather than hand-transcription:

- **`tools/build_study_data.py`** (per-locale; it absorbed the original EN-only `build_genesis_data.py`)
  parses `content/{loc}/genesis/study/CHAPTER-1-CONTEXT.md` and `PEOPLE.md` →
  `site/assets/data/genesis-1-deeper.js` + `genesis-people.js` (each `{en,pt-br,de,es}`). The pages
  render that data. Every entry, dual-label, verse reference and field comes **verbatim from source** —
  loss, fabrication, and mis-referencing are structurally impossible.
- **Conservation gate** (built into the script) asserts emitted counts == that locale's own source
  counts (entries · sub-entries · scenarios · **sources**) and fails loudly on any mismatch. EN pass:
  - Deeper — **50 entries** (§A 17 · §B 4 · §C 2 · §D 8 · §E 5 · §F 5 · §G 9) + **§I 4 scenarios ×
    10 = 40 sub-entries** + **§H 14 sources**. Every entry shows its source dual-label and `Source:`.
  - People — **24 figures**, full profiles incl. verse-anchored Birth-year computations and Notes, the
    **2 genealogy tables** (Gen 5 + Gen 11, 20 rows), and Sources.
- To regenerate after a source edit: `python3 docs/redesign/tools/build_study_data.py` (then the
  page-shell scripts). Same source → identical output.

> Local-dev note: when re-viewing after a regenerate, hard-refresh — `python -m http.server` sends no
> cache headers, so the browser may hold an old copy. Fresh loads always serve the current files.

**Source defect flagged (not fixed in the repo):** `content/en/genesis/PEOPLE.md` contains 9 mojibake
em-dashes — a real em-dash (—) stored as the corrupted byte sequence `â\x80\x94` (UTF-8 read as
Latin-1) — at the Gen 11 genealogy title and several "Key events"/"Location(s)" fields (lines ~137,
622, 655, 658, 705, 766, 775, 849, 857). The live Next.js app would render these too. The redesign
build script repairs them on parse (`fix_mojibake`) so the prototype shows clean em-dashes, and a
gate guards against any residual mojibake in the emitted data. Recommend fixing the source file
itself in a future content pass.
