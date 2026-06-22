# Plan — Luke 1–3 (new book, full treatment, 4 locales)

**Status:** PLANNED — **self-audited 2026-06-22** (wiring findings folded in) · approved: AI-draft→provisional→Rule-28 (Q1), EN checkpoint before propagation (Q2), mirror-Matthew companion depth (Q3) · **Date:** 2026-06-22 · **Class:** content authoring (new book, from source) + new-book activation · **Risk:** Medium-High (*authoring from Greek*, not Mark-style propagation; Rule-28 provisional)

> **Self-audit disposition (verified against source — focus: wiring to final users):**
> 1. **The `<!-- CARD -->` block in `INTRODUCTION.md` is load-bearing UI/SEO, not just prose.** `getIntroductionData().card` feeds: the **`/books` index glance** (`books/page.tsx`: card[0,1,2,4] = What·When·Who·Why), the **book-hub at-a-glance panel** (`[book]/page.tsx:142` `<dl class="tt-glance">`), and the **book-hub SEO `<title>` description** (`card[0].value`). → Phase-1 INTRODUCTION sub-stage now explicitly requires the CARD with all 5 fields (What/When/Who/To-whom/Why), authored EN-first then localized. Without it, Luke shows on /books with an empty glance and a weak SEO description.
> 2. **i18n is a count bump, not just an enumeration.** `books.heroTagline` (add "Luke 1–3") **and** `books.sectionKick` "**Four** books" → "**Five** books" — in **all 4 locales** (en/pt-br/de/es). The count string is the easy miss. (Confirmed there is one book-enumerating tagline, under `books.*`; no separate landing tagline duplicates it.)
> 3. **`/start` needs NO change** — step 4 "The Gospels" → `/books` (covers Luke); the reading-plan steps name Psalms/Proverbs/Ecclesiastes/Gospels generically, not individual gospel slugs. Avoids a wasted edit. (Bonus: the whole 4-book expansion maps to the existing `/start` roadmap.)
> 4. **app-bar, breadcrumbs, language-switcher, sitemap, OG** are all auto (driven by `AVAILABLE_BOOKS` / route segments / `getAvailableBooks` filesystem scan / template OG) → no per-book wiring beyond the registry entry. Verified.

> **Scope decision (2026-06-22):** Luke only for now. Psalms / Proverbs / Ecclesiastes deferred (they raise an unresolved Hebrew-poetry-genre + wisdom-file-set question — separate future plan). Luke is GS narrative + genealogy = the Matthew/Mark template, so it sidesteps all of that.

---

## 1. What this is (and how it differs from Mark)

Add **Luke 1–3** as a new book in **all 4 locales**, full treatment (chapters + INTRODUCTION + PEOPLE/genealogy + CONTEXT + per-chapter companions + PROPHECY where warranted) — like Mark.

**The crucial difference from the Mark work:** Mark was *propagation* (EN already existed → mirror-translate). **Luke must be authored from the Greek source first.** EN doesn't exist. So the hard part is Phase 1 (EN authoring from NA28 + the source-analysis method, every decision logged), shipping **Rule-28 provisional** pending a Hellenist. Propagation to PT/DE/ES (Phases 2–4) is the proven Mark-style mirror.

**Source language / rules:** Koine Greek → **RULES-GS** (kyrios Option C divine name; Greek article system; canonical `κύριος (kyrios)` metadata line; Option B traditions Reina-Valera/Almeida/Luther; markers `@@`/`{t:}`/`{a:}`/`*added*`). Greek proper-name policy (transliteration + familiar) per RULES-GS/HB tables.

## 2. Luke-specific realities (sized before planning)

- **Volume:** Luke 1 = 80 verses, Luke 2 = 52, Luke 3 = 38 → **~170 verses** (vs Mark's 108). Materially larger than Mark.
- **The genealogy (Luke 3:23-38):** ~76 generations, Jesus → Adam. Becomes a large PEOPLE genealogy table (Genesis-scale) and is **heavy on cross-book see-stubs** → `genesis` (Adam, Shet, Noach, Shem, the patriarchs) and `matthew` (David line). This exercises the just-shipped cross-book see-link fix at scale.
- **Embedded canticles (poetry-in-narrative):** Magnificat (1:46-55), Benedictus (1:68-79), Gloria (2:14), Nunc Dimittis (2:29-32). These are Hebrew-style poetry inside a Greek narrative. Render as **prose with line breaks** within the existing verse model (minor — NOT the full HB-poetry-genre question deferred above; verify the renderer preserves intra-verse line breaks during EN authoring).
- **Rule 30 divine speech:** Gabriel is an *angelos*/malakh-class speaker → **excluded by default** (like Matthew's *malakh*), logged. God's/Spirit's direct speech (e.g. the baptism Bat-Qol 3:22) **is** marked. Mary/Zechariah/Simeon canticles = human speech → not divine-marked.
- **Cross-book PEOPLE:** many Luke figures have canonical homes elsewhere → see-only stubs: Yeshua/Yochanan the Immerser/Miryam → matthew; Avraham/David/Adam etc. → genesis/matthew. Luke-canonical figures (Zecharyah, Elisheva, Gavriel, Shimon, Channah, Yosef) get full entries.
- **Prophecy warranted:** the canticles quote/allude to the HB densely; Yochanan as the Isaiah-40 voice; the baptism. PROPHECY files for the chapters with prophetic density (likely all three, like Matthew).

## 3. New-book activation — the 8 touchpoints (Phase 0)

Adding a book is more than content; routes/SEO/nav must register it. From the Mark activation surface:
1. `src/domain/books/registry.ts` — add `"luke"` to `AVAILABLE_BOOKS`.
2. `src/app/[locale]/books/page.tsx` — add `"luke"` to `BOOK_ORDER` in canonical order: `["genesis","matthew","mark","luke","john"]`.
3. `src/app/[locale]/[book]/people/page.tsx` — `bookLabels`: add `luke: t("book.luke")`.
4. `src/infrastructure/content/people-fields.ts` — `inBook` aliases: `"in luke","em lucas","in lukas","en lucas"`.
5. `src/infrastructure/i18n/messages/{en,pt-br,de,es}.json` — add `book.luke` label (Luke/Lucas/Lukas/Lucas) + `people.inBook.luke`; update `books.heroTagline` (add "Luke 1–3") **and** `books.sectionKick` **"Four books" → "Five books"** (the count) — all 4 locales (audit Finding 2).
6. `scripts/content-lint.sh` — register luke in `CONTENT_DIRS`/`STUDY_DIRS`/`PEOPLE_FILES`/`NON_EN_PEOPLE_FILES`/`CONTEXT_FILES` (+ `ES_NT_DIRS`/`ES_NT_CHAPTER_FILES` since Luke is GS, like Mark/Matthew); add `docs/editorial-log/luke.md` to `EDITORIAL_LOGS`.
7. `docs/rules/RULES-CORE.md` — add `luke` to the cross-book see-target allow-list.
8. New files: `docs/editorial-log/luke.md` (decision log, opened before drafting) + a `docs/source-analysis/greek/luke-1-3.md` working-notes stub (NA28; Rule-28).

`getAvailableBooks()` is filesystem-based → auto-discovers once content exists; `AVAILABLE_BOOKS` (static) is the gate. Conservation/parsers auto-discover.

## 4. Phases

**Phase 0 — Activation + scaffold.** The 8 touchpoints above (content-lint paths added only as each locale's files land, to avoid grep-on-missing-file failures — same lesson as Mark). Open `editorial-log/luke.md`. Gate (build/lint/test still green with registry change + empty book = no content yet; or land registry with EN content together).

**Phase 1 — EN authoring (the crux).** From NA28 Greek + `METHOD.md`. Sub-stages, each gated:
1. **Chapters 1→2→3**: main text (transparent translation), verse notes (Tier-2, dual-labelled), glossary, reading guide (+ marker legend), chapter overview, markers (`@@`/`{t:}`/`{a:}`/`*added*`), canticles as prose-with-linebreaks. Divine-name = κύριος Option C; canonical metadata line. Log every non-trivial rendering decision in `luke.md` first.
2. **Companions** (study/CHAPTER-1/2/3-CONTEXT): §I "World at the Time" (GS 1st-century structure, like Matthew/John) + enrichment (dual-labelled, Rule 29).
3. **INTRODUCTION** — **the `<!-- CARD -->` block first** (5 fields: What/When/Who/To-whom/Why — load-bearing for the /books glance, book-hub at-a-glance, and book-hub SEO description per audit Finding 1) + sections A–F as warranted + mandatory §G Sources + disclaimer. New GS glossary terms go through the RULES-CORE glossary-expansion procedure; debated terms carry Rule-13 uncertainty levels.
4. **PEOPLE** (+ the Luke-3 genealogy table): full entries for Luke-canonical figures; see-only stubs (→ matthew, → genesis) for cross-book figures; the genealogy as a table (Genesis-style).
5. **CONTEXT** (book-level cross-chapter motifs).
6. **PROPHECY** (chapters warranting it).
**→ CHECKPOINT: project-lead review of the EN book before propagation** (translation quality + structure; the riskiest gate, since everything downstream mirrors it).

**Phase 2 / 3 / 4 — Propagate PT-BR / DE / ES** (Mark-style mirror: familiar names per tradition — Almeida/Luther/Reina-Valera; transliterations mirror EN; DE→JHWH & ES/PT→YHWH in body cross-refs; marker parity; structural headers + dual-labels copied from the EN + same-locale Matthew exemplar; Appendix-A localized strings). Each locale gated + visually checked, one at a time.

**Phase 5 — Docs.** EXECUTION_HISTORY entry; PENDING (Luke done; note Psalms/Prov/Eccl still deferred); CLAUDE.md + README scope (5 books); editorial-log/luke.md finalized; book count refresh.

## 5. Validation gate (per phase)

Same battery as Mark + activation checks:
- `pnpm test` incl. conservation (additive; new units; completeness + label guards pass — every CHAPTER parses ≥1 verse/paragraph/overview; no unrecognized labels).
- Marker parity (propagation phases: `@@`/`{t:}`/`{a:}` = EN per file; **scripted** grep-diff).
- Divine name: κύριος Option C; canonical `κύριος (kyrios)` metadata; DE→JHWH / ES·PT→YHWH in body (propagation).
- Cross-book stubs resolve to live `/people` routes (genesis/matthew exist; the see-link fix renders them as links); genealogy table renders.
- `pnpm lint` · `content:lint` (incl. ES §0.3/§0.4) · `pnpm build` (all Luke routes prerender).
- Activation: `/{locale}/luke`, `/luke/chapter/{1,2,3}` (+ notes/deeper), `/luke/people`, `/luke/introduction`, `/luke/background` all 200; Luke appears in books index + app-bar + sitemap.
- **Wiring-to-users (audit):** `/books` shows Luke with a **populated glance** (CARD present); the **book-hub at-a-glance** `<dl class="tt-glance">` renders; the **book-hub `<title>`** includes the CARD "What"; `sectionKick` reads "Five books"; the heroTagline lists Luke — all 4 locales.
- Visual (Docker MCP): a chapter (markers + canticle line breaks), the people/genealogy page (cross-book links), book hub — per locale.
- i18n parity: any new UI string in all 4 locales.

## 6. Risks & rollback

- **Translation accuracy (highest):** AI-drafted EN from Greek → `provisional` → Hellenist (Rule 28) is the safety net; the EN checkpoint (end of Phase 1) is the human go/no-go before 3× propagation multiplies any systemic issue.
- **Genealogy + cross-book stubs:** ~76 names, many cross-book; mitigated by the shipped see-link fix + dangling-fallback for any not-yet-authored target.
- **Activation completeness:** 8 touchpoints; an omission = broken route/SEO. Mitigated by the explicit Phase-0 list + the route gate.
- **Canticle poetry:** render-as-prose-with-linebreaks; verify the renderer preserves intra-verse breaks early (if not, the canticles degrade to run-on — flag, don't block).
- **Rollback:** new book is purely additive (new files + registry entries); revert = remove luke content + the 8 registrations. No existing content/data touched.

## 7. Branch / authorization

Feature branch `luke-expansion` off `main`; PR per the standing authorization gate; one-book-at-a-time; EN checkpoint before propagation. Authorship: AI-draft → provisional → Rule-28 (Hellenist), the established GS pattern.

## 8. Open decisions for project-lead

1. **EN authorship path:** AI-drafts the Greek→EN translation (provisional, Hellenist-reviewed later) — confirm, vs. wait for a human translator to author EN first. *(Recommend AI-draft → provisional, matching how the existing GS books were produced.)*
2. **EN checkpoint:** stop for your review at end of Phase 1 (EN complete) before any propagation. *(Recommended.)*
3. **Companion/§I depth** for a new GS book — mirror Matthew's companion scope, or lighter for a pilot. *(Recommend mirror Matthew.)*
