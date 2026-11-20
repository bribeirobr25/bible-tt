# Authoring Playbook — New Book / New Chapter

The single start-to-finish runbook for adding content to the TT. Two tracks: **[Track A — New Chapter](#track-a--new-chapter-in-an-existing-book)** (in a book that already exists) and **[Track B — New Book](#track-b--new-book-from-scratch)** (from scratch). It ends with a living **[Known Traps register](#known-traps--lessons-learned-living)** — read it *before* you start.

> **This guide sequences and links; it does not duplicate.** The rules live in `docs/rules/`, the per-file structure in `CLAUDE.md` → "Content authoring", the loops in `CONTRIBUTING.md`, the file shapes in `docs/templates/`. When this guide and a rule file disagree, the rule file wins — fix this guide.

---

## 0. Mental model (true for both tracks)

1. **EN-first, from source.** EN is translated **directly from the Hebrew/Greek** under the full ruleset. PT-BR / DE / ES are then **mirror-translated from the EN** (pivot). This is the proven, cost-efficient method — but see the pivot caveat in Trap T-12 and the **source-anchored review** rule below.
2. **Markdown is the source of truth.** Files under `content/{locale}/{book}/` are parsed at build; there is no DB and (for chapters/companions/context) **no registration step** — parsers auto-discover. The exception is a **new book**, which needs the activation touchpoints in Track B Phase 0.
3. **Everything new ships `provisional`** pending **Rule 28** (Hellenist for GS, source-scholar for HB; locale editors for PT/DE/ES). The AI draft is a draft, never a sign-off.
4. **Plan first for anything book-sized.** Write the plan in `docs/audit/`, get the project lead's audit, then execute gated phase-by-phase (`CONTRIBUTING.md` → "Planned-work loop"). A new chapter inside an existing book usually doesn't need a formal plan; a new book always does.
5. **The gate is non-negotiable** and runs *per phase*, not just at the end → [§4 The Gate](#4-the-gate-run-every-phase).

---

## Track A — New Chapter (in an existing book)

Use when the book is already activated (e.g. adding Genesis 13). No code/registration changes — only content + docs.

### A.1 Prerequisites
- The book is in `AVAILABLE_BOOKS` (`src/domain/books/registry.ts`).
- Read the book's editorial log (`docs/editorial-log/{book}.md`) and the [Known Traps](#known-traps--lessons-learned-living).
- Have the base-text reference open (HB: BHS/Leningrad; GS: NA28) + the source-analysis notes (`docs/source-analysis/`).

### A.2 Artifact manifest (per locale, ×4)
A chapter `N` needs, in **each** of `en`, `pt-br`, `de`, `es`:

| File | Required? | From template |
|---|---|---|
| `content/{loc}/{book}/CHAPTER-N.md` | **yes** | mirror an existing chapter's structure |
| `content/{loc}/{book}/study/CHAPTER-N-CONTEXT.md` | **yes** | `docs/templates/contextual-companion-template.md` |
| `content/{loc}/{book}/study/CHAPTER-N-PROPHECY.md` | only where warranted | mirror an existing PROPHECY file |

`CHAPTER-N.md` must contain: front matter (base text, edition, divine-name policy, status `provisional`, ruleset version, reviewers); `## VISIÓN/ÜBERSICHT/OVERVIEW` chapter-overview; reading guide; **continuous reading** (the verse text, markers applied); **verse-by-verse** study; **glossary**; cross-chapter tracking. Mirror a sibling chapter in the same book+locale for exact heading strings (they are localized — see [§5](#5-per-locale-quick-reference)).

### A.3 Steps
1. **Log decisions first** in `docs/editorial-log/{book}.md` (schema in `RULES-CORE.md`). New glossary terms → glossary-expansion procedure.
2. **Author EN** `CHAPTER-N.md` from source, applying the markers ([§6 markers](#6-marker--rule-quick-reference)); then its CONTEXT (+ PROPHECY if warranted).
3. **Gate** (§4). Fix until green.
4. **Propagate** to PT-BR, DE, ES — mirror-EN, applying [§5 per-locale conventions](#5-per-locale-quick-reference). One locale at a time; **gate after each**.
5. **Docs:** editorial-log entries per locale; `EXECUTION_HISTORY.md` entry; refresh scope/test-count lines in `CLAUDE.md` + `README.md` if they change.
6. **Commit per the conventions** (`CONTRIBUTING.md`), branch + PR, merge on authorization.

### A.4 Done when
Gate green (incl. conservation additive — new verses, zero loss); all 4 locales present; markers parity EN↔targets; divine name correct per locale; editorial logs + EXECUTION_HISTORY updated; PR opened.

---

## Track B — New Book (from scratch)

Use when adding a book not yet in `AVAILABLE_BOOKS` (e.g. Acts, Psalms). **Always plan-first.**

### B.0 Prerequisites & decisions (write these into the plan)
- **Scope** — which chapters (e.g. "1–3 pilot" vs full book).
- **Corpus / genre** — Hebrew Bible vs Greek Scriptures (drives RULES-HB vs RULES-GS) and narrative/poetry/prophecy/law/letter (drives intro section emphasis — `RULES-CORE.md` genre-adapted-sections table).
- **Base text** — BHS (HB) / NA28 (GS) + apparatus for variants.
- **Companion depth** — mirror Matthew/Luke (recommended) or lighter for a pilot.
- **Authorship path** — AI-draft → provisional → Rule-28 (the established pattern) vs human-first.
- Write `docs/audit/PLAN_{BOOK}_EXPANSION.md`; get the lead's audit; iterate to APPROVE. (See `PLAN_LUKE_EXPANSION.md` / `PLAN_MARK_PROPAGATION.md` as worked templates.)

### B.1 Phase 0 — Activation (do this **before** authoring; one commit)
A new book is the *only* content that needs code wiring. Miss one and you get a broken route or silent parse-to-`undefined`. This table is the **single full list** of activation touchpoints; RULES-CORE's new-book checklist keeps only the PEOPLE-specific steps and points here:

| # | Touchpoint | File | Note |
|---|---|---|---|
| 1 | `AVAILABLE_BOOKS` | `src/domain/books/registry.ts` | the publish SSOT |
| 2 | `BOOK_ORDER` (+ `HEBREW_BIBLE` if HB) | `src/app/[locale]/books/page.tsx` | display order + corpus label |
| 3 | `bookLabels` | `src/app/[locale]/[book]/people/page.tsx` | localized label for cross-book pointers |
| 4 | `EXACT_LABEL_ALIASES.inBook` | `src/infrastructure/content/people-parser.ts` | 4 locale forms (`"in acts"`/`"em atos"`/`"in apostelgeschichte"`/`"en hechos"`) — else `**In {Book}:**` parses to `undefined` |
| 5 | `book.{slug}` + `heroTagline` + `sectionKick` count | `src/infrastructure/i18n/messages/{en,pt-br,de,es}.json` | all 4 locales; bump the "{N} books"→"{N+1} books" count (e.g. "Six"→"Seven" for 1 Peter) |
| 6 | content-lint dir lists | `scripts/content-lint.sh` | book/file lists and the §0.12 see-target allow-list are generated from `content/en/*/` since Step 2; add a Hebrew Bible book to `HB_BOOKS` (must equal `HEBREW_BIBLE`) and a not-yet-authored cross-book pointer target to `FORWARD_SLUGS` |
| 7 | see-target allow-list | `docs/rules/RULES-CORE.md` | add slug |
| 8 | editorial log + source stub | `docs/editorial-log/{book}.md`, `docs/source-analysis/{greek\|hebrew}/{book}-N.md` | seed before authoring |

**Backstop:** `src/infrastructure/content/__tests__/activation-consistency.test.ts` mechanically checks registry ↔ `BOOK_ORDER` ↔ `HEBREW_BIBLE` ↔ i18n `book.*` ↔ `bookLabels` ↔ RULES-CORE allow-list ↔ editorial log ↔ content in all 4 locales ↔ lint `HB_BOOKS`; `locale-parity.test.ts` checks file sets / verse sequences / marker counts / companion entries across locales; `people-field-resolution.test.ts` checks every see-stub has an `inBook` role and every locale label resolves like EN. The same test also checks row 5 (`heroTagline` lists every active book with its chapter range; the `sectionKick` count word equals the number of active books) and row 8 (a source-analysis file `{slug}*.md` exists in `docs/source-analysis/{greek|hebrew}/`; Matthew and John are the known, allow-listed source-stub gaps). Run `pnpm test` after Phase 0 — it fails loudly on an omission of any checked touchpoint. RULES-CORE's new-book checklist now points to this table instead of keeping its own count. **EN-first pilot branch:** add the slug to `PILOT_BOOKS` (`src/domain/books/registry.ts`) so the parity checks skip it until propagation; remove it in the propagation PR.

### B.2 Phase 1 — EN authoring (from source)
Author all EN files (per-locale manifest, ×1 for EN):
- `CHAPTER-1…N.md` (verse text + overview + reading guide + verse-by-verse + glossary + tracking).
- `study/CHAPTER-N-CONTEXT.md` (§A–§I; §I "World at the Time" with multi-scenario framing — see existing books).
- `study/CHAPTER-N-PROPHECY.md` where warranted (citation-vs-allusion restraint).
- `INTRODUCTION.md` — sections A–G (G mandatory; genre-adapted per RULES-CORE table) **+ the load-bearing `<!-- CARD -->…<!-- /CARD -->` block** (5 fields: What·When·Who·To-whom·Why — drives `/books` glance, book-hub at-a-glance, and the hub SEO title).
- `PEOPLE.md` — canonical entries + concise historical figures + cross-book see-only stubs (`**See:** {book}/PEOPLE.md` + `**In {Book}:**`) + genealogy tables where the text has them.
- `CONTEXT.md` — book-level cross-chapter motifs.

Log every decision in `docs/editorial-log/{book}.md` as you go.

### B.3 EN Checkpoint (go/no-go)
**Stop. Gate (§4). Get the project lead's review of the EN before propagating.** This is the human go/no-go — propagation multiplies any systemic issue ×3.

### B.4 Phases 2–4 — Propagate PT-BR, DE, ES
One locale per phase, mirror-EN. Apply [§5 per-locale conventions](#5-per-locale-quick-reference). **Gate after each locale.** Verify against EN: marker parity per file, divine name correct, names in the locale tradition, headings localized, CARD + dual-labels in the locale's registered forms, genealogy + see-stubs localized.

### B.5 Phase 5 — Docs
`EXECUTION_HISTORY.md` entry; `PENDING.md` (mark done; note remaining Rule-28 review); `CLAUDE.md` + `README.md` scope/test-count lines; editorial-log entries per locale; **append any new lesson to [§7 Known Traps](#known-traps--lessons-learned-living)**.

### B.6 Done when
All 8 activation touchpoints + `activation-consistency` green; all routes 200 (`/{loc}/{book}`, `/chapter/{n}` + `/notes` + `/deeper`, `/people`, `/introduction`, `/background`); book in `/books` index + app-bar + sitemap with a populated glance; gate green every phase; provisional; PR opened.

---

## 4. The Gate (run every phase)

```
pnpm test          # all suites (count: CLAUDE.md "Verified state") incl. conservation (additive, zero-loss), completeness + label guards, activation-consistency
pnpm lint          # Biome
pnpm content:lint  # Phase-0 content rules (markers, divine name, diacritics, redundant parens, cross-book pointers, anti-calque…)
pnpm build         # all routes prerender
```
Then, for content with UI surface, **visual-check via Docker MCP** (`PORT=3001 pnpm dev`; browser at `host.docker.internal:3001`): a chapter (markers + canticle-as-prose), people/genealogy (cross-book links render), book hub (CARD glance), per locale. Confirm divine name / register in **served HTML**, not just the markdown.

Conservation auto-discovers files and derives the expected unit total — a passing run after additive work *proves* zero loss. Never hardcode counts.

---

## 5. Per-locale quick reference

| | EN | PT-BR | DE | ES |
|---|---|---|---|---|
| Name tradition | source-familiar | Almeida | Luther | Reina-Valera |
| Divine name (HB) | YHWH | YHWH | **JHWH** | YHWH |
| Divine name (GS κύριος) | the Lord | o Senhor | der Herr | el Señor (Option C + Tier-2 note) |
| 2nd-person plural | — | **vós** in verse text (Rule 10 register clause, decision L6; the remaining `vocês` in John/Matthew are converted in Launch-Program Step 4 batch 4); contemporary forms elsewhere | ihr | **ustedes** (not peninsular `vosotros`) |
| Quote marks | "…" | "…" | „…" | "…" |
| Diacritics | — | full | full | **full** (the recurring failure — see T-09) |
| Speech verb | said | disse | sprach/sagte | dijo |

Headings are localized — copy the exact strings from a sibling chapter in the **same** book+locale (e.g. ES `LECTURA CONTINUA` / `ESTUDIO VERSÍCULO POR VERSÍCULO` / `GLOSARIO`). Name rendering: familiar form default; transliterated form **once per section** as `Translit (Familiar)`; never redundant `Name (Name)` (T-08). Exceptions kept transliterated: YHWH/JHWH, Yehudim (DE Jehudim), technical terms (`raqia`, `bara`…).

---

## 6. Marker & rule quick reference

| Meaning | Rule | Markup | Colour |
|---|---|---|---|
| Word added for target grammar | 11 | `*word*` | grammatical-blue italic |
| Strategic transliterated term | 4 | `{t:raqia}` | teal, bold |
| Preserved ambiguity (governed slash) | 2 | `{a:wind/spirit}` | bold, body colour |
| Direct divine speech | 30 | `@@"Shall be light"@@` | red, not bold |

These are the **only** inline styling in the verse text. `{t:}`/`{a:}` are reserved for locked-glossary terms. Markers may nest inside `@@…@@` but author the inner marker normally — **never** nest `*…*` inside `{a:…}` (T-07). Uncertainty on debated terms uses Rule 13 levels (Probable / Possible / Uncertain) in Tier-2 notes.

---

## Known Traps / Lessons Learned (living)

> **Append to this after every book/chapter.** Each entry: what bit us, where, and the guardrail. Many are now machine-checked — note which.

- **T-01 — `*added*` copula handled inconsistently across locales.** Hebrew verbless clauses (e.g. Gen 1:2 "darkness *was* over…") get an italic copula in EN/DE but are left verbless in PT/ES. Both are defensible, but cross-locale divergence needs an editorial-log note (Rule 16). Decide per clause; record it.
- **T-02 — Canticles/poetry render as prose.** `renderMarkdownSafe` "prose" mode collapses `\n`→space; only "note" mode emits `<br/>`. So author poetry (Magnificat, oracles) as flowing prose — a global change would regress every existing multi-line verse. Full poetic lineation is deferred with the Hebrew-poetry genre. (luke.md L-002.)
- **T-03 — Divine name is per-locale.** DE uses **JHWH**, not YHWH, in *all* body cross-refs; PT/ES keep YHWH. Verify in served HTML (Notes view), not just source. (Mark/Luke propagations.)
- **T-04 — GS κύριος is Option C.** "the Lord"/"o Senhor"/„der Herr"/"el Señor" in main text + Tier-2 note when quoting an OT YHWH passage; track the referent (YHWH vs Yeshua) per verse. Keep the canonical `κύριος (kyrios)` metadata line.
- **T-05 — The `<!-- CARD -->` block is load-bearing.** It drives the `/books` glance, the book-hub at-a-glance, *and* the hub SEO `<title>` (intro.card[0]). A book without it renders a broken hub. Always include all 5 fields.
- **T-06 — Cross-book see-stubs need 4 locale aliases + allow-list.** Without the `people-parser` `inBook` alias the `**In {Book}:**` field silently parses to `undefined`; without the §0.12 allow-list entry the pointer warns. The render-time `CrossBookSeeField` fallback is the second line of defense, not the first.
- **T-07 — No nested `*…*` inside `{a:…}`.** The renderer can't resolve `*{a:vento/espírito}*`; author markers flat. (Mark PT-BR fix.)
- **T-08 — Redundant `Name (Name)`.** When a locale's familiar form equals the transliteration (Herod→`Herodes`, Andrew→`Andreas`), the `Translit (Familiar)` convention collapses to a single name. Recurs every propagation; `content:lint §0.11` catches the DE paren case. Sweep all locales.
- **T-09 — ES diacritic loss is the single most recurrent ES defect.** `está`→`esta`, `él`→`el` (pronoun, not the article), `cernía`→`cernia`, `¿Dónde`→`¿Donde`. Systemic in older ES content (genesis/john). `content:lint §0.3` (word-list, all `content/es` since Step 2; headings/front matter) + `§0.3b` (audit-cleared high-precision tokens, all es books) guard subsets; the full pronoun-accent sweep is a tracked PENDING task and needs per-instance judgment (`a el`→`al` before a noun vs `a él` pronoun). **Measured in Step 3** by `pnpm content:sweep --check S11` (corpus-dominance + context rules) — its figure is a **lower bound** (the method cannot see a word whose accented form never occurs, nor the `el`/`él`-type pronoun pairs); see `CONTENT_SWEEP_FINDINGS.md` §2 S11.
- **T-10 — ES register is Latin-American `ustedes`, never peninsular `vosotros`.** Watch imperatives/quotes: `No tengáis miedo`→`No teman`, `os digo`→`les digo`, `preparad`→`preparen`. `content:lint [legacy] Vosotros forms` blocks `vosotros|vuestr`. (luke.md L-005.)
- **T-11 — Rule 30 scope is narrow.** Mark only *direct first-person divine speech*. Angels/`malakh`/Gabriel and the canticles are **not** divine-marked; the Bat-Qol (e.g. Lk 3:22) and first-person Yeshua sayings **are**.
- **T-12 — The pivot copies English's grammatical crutches.** EN needs a noun-prop for substantivized adjectives ("the Mighty *One*", `ὁ δυνατός`) and marks it `*One*`; a careless target calques it (DE `der Mächtige *Eine*` — wrong German). `content:lint §0.3c` blocks the italic `One/Eine/Um/Uno` filler after any word (sentence-initial additions pass); the adjective + lowercase-filler form (`gerechten *einen*`, `santo *uno*`) is `§0.3d`, **warn-only** until the Step-4b sweep clears it. Run an **anti-calque reverse-check** during propagation: any Rule-11 `*italic*` that exists only because *English* needed it must not appear if the target doesn't.
- **T-13 — Rule-28 sign-off must be SOURCE-anchored.** Locale review compares target ↔ **original Hebrew/Greek**, never target ↔ English — an English-anchored review waves pivot artifacts straight through. (`docs/audit/PIVOT_FIDELITY_AUDIT.md`.)
- **T-14 — Only register a lint pattern after the class is fully cleared.** `content:lint` fails on match, so adding a guard for an un-fixed pre-existing class blocks the build. Fix first, then guard.
- **T-15 — Unregistered claim/confidence labels fail the label guard.** Use only labels in `labels.ts` (e.g. `STRONG INFERENCE`, not `INTERPRETIVE`). The render falls back to TEXTUAL + a console.warn, and the label-warning test fails.
- **T-16 — Epistles are a different genre from the narrative books.** When the first Letter is authored (1 Peter, etc.): the **INTRODUCTION** gains §B "Recipient Community" + §D "Epistolary Conventions" (RULES-CORE genre table); **PEOPLE** thins to senders/recipients with **no genealogy/timeline**; **PROPHECY** companions shift to *OT-in-argument* (Paul's catenae) rather than "fulfilled prediction"; verse structure still works (argument, not narrative). Do one epistle deliberately as a genre pilot before scaling. (Recorded post-Acts; **exercised by 1 Peter**, 2026-06/07 — see `docs/editorial-log/1-peter.md` + EXECUTION_HISTORY.)
- **T-17 — Large parallel propagation can hit the account session limit mid-run.** Acts propagation launched 9 heavy agents at once; the 3 companion (6-file) agents hit the limit and reported "0 tokens" — but had each written 5/6 files before stopping. **Lesson:** after a big parallel batch, *inventory what actually landed* (`find content/{loc}/book -type f`) and **check the existing files for truncation** (do they end with the provenance/sources block?) before assuming failure; hand-finish only the genuinely-missing tails. Prefer fewer, smaller batches (e.g. chapters first, then companions) over one 9-agent burst.
- **T-18 — Subagent marker-stripping is a silent propagation risk; gate it with a scripted parity diff.** A propagation agent rendered `{a:wind/spirit}` as plain prose in 6 spots of one ES file (and over-marked 2 others), so the locale silently diverged from EN. The `@@`/`{a:}`/`{t:}` counts per file **must equal the EN source's** — run the scripted count-diff (every propagated file vs its EN twin) as a hard gate, not just the agent's self-report.
- **T-19 — Leading-digit book slugs (`1-peter`, `2-peter`, `1-john`…).** The cross-book slug regexes must admit a leading digit (`[a-z0-9][a-z0-9-]*`) in both `content-lint.sh` §0.12 and `people-parser.ts` `crossBookSee`, else a `**See:** 1-peter/PEOPLE.md` pointer silently parses to `undefined` and renders as plain text. Fixed in 1 Peter Phase 0a with a round-trip regression test — keep the test when touching either regex.
- **T-20 — The pivot moves Rule-11 italics onto the target noun inside PT contractions.** EN `in *the* flesh` (added article) became PT `na *carne*` — italicizing a noun that *is* in the Greek. Same class elsewhere — upper bound, regex `\b(na|no|nas|nos|da|do|das|dos|pela|pelo|pelas|pelos|à|às|ao|aos) \*[^*]+\*` over `content/pt-br/<book>/CHAPTER-*.md`: 1 Peter 57 · Luke 86 · Genesis 16 · Acts 8 · John 11 · Matthew 11 · Mark 1 — includes some legitimate italics. **Sized in Step 3** (`CONTENT_SWEEP_FINDINGS.md`, check S7a): of the 190, 56 are verse text (39 pivot-likely: Luke 24 · 1 Peter 14 · Acts 1; 17 review), 56 their continuous-reading copies, 68 notes quoting them, 10 other prose. **Counting caveat:** the 190 uses Unicode word boundaries; an ASCII `\b` grep (`grep -E`, ugrep) counts **186**, because `\b` never matches before `à`/`às` — re-measure with `pnpm content:sweep --check S7a`, not with grep. **Decided (L1, 2026-11-20; Rule 11 contraction clause, v3.4.1):** an added article fused into a contraction is marked by italicizing the **whole contraction** in every locale — PT `*na* carne`, DE `*im* Buch`, ES `*del* Señor`; an inserted article never doubles an existing one. The content fix is a later Step 4 batch.

---

## Pointers (single sources of truth — do not duplicate here)

- Rules: `docs/rules/RULES-CORE.md` + `RULES-HB.md` + `RULES-GS.md` (30 rules; Prime Directive, markers, divine name, name rendering, activation checklist, QC checklist).
- Per-file structure & name rendering: `CLAUDE.md` → "Content authoring".
- Loops, definition-of-done, branch/commit conventions: `CONTRIBUTING.md`.
- File shapes: `docs/templates/` (book-introduction, contextual-companion).
- Source-analysis method + worked corpus: `docs/source-analysis/`.
- Decision history: `docs/editorial-log/{book}.md`. Completed-work ledger: `docs/audit/EXECUTION_HISTORY.md`. Open items: `docs/audit/PENDING.md`.
- Worked end-to-end plans to copy: `docs/audit/PLAN_LUKE_EXPANSION.md`, `PLAN_MARK_PROPAGATION.md`.
