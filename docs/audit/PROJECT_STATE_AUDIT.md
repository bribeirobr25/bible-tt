# Project State Audit — Documentation, Code & Branch Review

**Date:** 2026-11-19
**Baseline:** `main` @ `1e4132d` (Merge PR #14, Acts expansion, 2026-06-24)
**Author:** AI-assisted (Claude Opus 5.5) — findings only; **no fixes applied**. Not a Rule-28 sign-off.
**Status:** open — feeds the next `PLAN_*.md` cycle (planned-work loop, `CONTRIBUTING.md`).

**Method.** Full-breadth read of all project documentation (~12.7k lines / 80+ files), then a code review of `src/`, tests and tooling. Core governance docs and the core pipeline (domain, parsers, loader, renderer) were read directly; editorial logs, the audit/plan archive, secondary docs, the UI layer and the test/lint tooling were digested by review subagents and spot-checked. Claims marked **✔** were reproduced directly (running the real parser/renderer, a production build, or a content scan). Unmarked items are reviewer-reported and unverified unless stated.

---

## 0. Summary — top priorities

1. **Two bodies of work sit outside `main`** (§1): a complete **1 Peter** (book #7, 4 locales, unmerged, no PR) and an **orphaned pivot-fidelity audit commit** whose content fixes never landed.
2. **Live reader-facing bugs** (§3.1): unactivated books' chapters are publicly served; the mandatory **Sources Consulted** section is never rendered; a misaligned table (Gen 8); inverted italics around the `א*` siglum; `/rules` omits Rule 30; unstyled 404s; invisible reading-progress bar.
3. **The gate is green but weaker than documented** (§3.3): the conservation gate is near-tautological, there is no cross-locale parity check, label matching is substring-based, activation-consistency covers ~4/8 touchpoints, content-lint has scope holes, and there is **no CI**.
4. **Rule contradictions and cross-book drift** (§5): marker colours, ψυχή/nephesh, "Son of Man" casing, Yehudim/Jehudim, name forms.
5. **Documentation drift** (§7): `STANDARDS.md`, `HOW-TO-READ-TT.md`, templates, README/CLAUDE.md trees, RULES-CORE internals, and ~40 dangling doc references.

---

## 1. Baseline & branch state

> **Status update (2026-11-19):** both stranded items below are **resolved by Step 1** of `docs/audit/LAUNCH_PROGRAM.md` (`PLAN_BASELINE_RECOVERY.md`) — `333a373` recovered (with two missed ES fixes completed) and `1-peter-expansion` merged. Kept here as the historical finding.

| Item | Finding | ✔ |
|---|---|---|
| **1 Peter unmerged** | `origin/1-peter-expansion`: 10 commits (to 2026-07-02), 91 files / +18.5k lines — all 5 chapters × 4 locales, `PLAN_1PETER_EXPANSION.md` + `AUDIT_1PETER_EXPANSION_PLAN.md`, `editorial-log/1-peter.md`, EXECUTION_HISTORY/PENDING/CLAUDE.md updates, and **code changes** (cross-book slug regexes widened for leading-digit slugs, people-parser/people-fields, content-lint, i18n, registry). **No PR exists.** Every `main` doc saying "next up: 1 Peter" is stale. | ✔ |
| **Orphaned pivot-fidelity commit** | `333a373` ("audit: pivot-fidelity report + mechanical fixes + lint guards", 2026-06-23 17:14) was pushed to `luke-propagation` **after** PR #12 merged (07:19). It is on no merged branch. It contains `docs/audit/PIVOT_FIDELITY_AUDIT.md`, ES/DE content fixes, `content-lint §0.3b/§0.3c`, and a PENDING update. `AUTHORING-PLAYBOOK.md` T-09/T-12/T-13 on `main` cite this report and these lint rules, which do not exist on `main`. | ✔ |
| **Its content defects are still live** | DE Luke 1:49 `der Mächtige *Eine*` (2×); ES Luke 1:47 `se exultó` (4×); ES John 1:4 `en el era vida` (4×, meaning-distorting: "in **the**" vs "in **him**"); ES Gen 1:2 `se cernia` (2×). | ✔ |
| **1 Peter log vs glossary** | `1-peter.md` renders ψυχή = "soul" and keeps "Kefa" after first occurrence — both conflict with locked rules (see §5). Review before merge. | ✔ |

---

## 2. Gate results on `main` (2026-11-19)

| Gate | Result | ✔ |
|---|---|---|
| `pnpm test` | **886 passed / 13 files**; conservation **336 files → 17,930 units** | ✔ |
| `pnpm lint` (Biome) | clean (98 files) | ✔ |
| `pnpm typecheck` | clean | ✔ |
| `pnpm content:lint` | pass, 1 warning (§0.10 Ham/Shem ethnic mapping, `en/genesis/PEOPLE.md`) | ✔ |
| `pnpm build` | clean; note **OG images build as dynamic (`ƒ`) routes**, not static | ✔ |
| Parser reconciliation vs raw files | verses 3,492 = 3,492; companion entries 2,898 = 2,898; prophecy entries 188 = 188 (48 files); only intended "prose view" captions (108) are stripped from continuous reading | ✔ |

Environment note: `node_modules` was absent; installed with `pnpm install --frozen-lockfile`. `next-env.d.ts` auto-modifies on build (known footgun) — reverted.

---

## 3. Code findings

### 3.1 Live bugs (user-visible)

| # | Bug | Location | ✔ |
|---|---|---|---|
| B1 | **Activation gate bypassed for chapters.** A drafted, unactivated book's `/{locale}/{book}/chapter/{n}` (+ `/notes`) returns **200** on demand; only the book hub 404s. `dynamicParams` is left at default `true` and chapter routes never check `AVAILABLE_BOOKS`. | `src/app/[locale]/[book]/chapter/[chapter]/{page,notes/page,deeper/page}.tsx` | ✔ (tested with a temporary draft dir) |
| B2 | **"Sources Consulted" never rendered** — Rule 29 §H (mandatory) and the Rule-28 AI-provenance block, on **all 132** companion (§H) and introduction (§G) pages. The parser only keeps `###` entries (pre-entry prose is dropped for 0-entry sections) and `ContextView` filters empty sections. Not counted by conservation either. | `enrichment-parser.ts:145-156, 277`; `context-view.tsx:27`; `introduction-view.tsx:22` | ✔ |
| B3 | **Empty table cells are dropped**, shifting columns left. Genesis 8 chiasm table (6 rows × 4 locales): "After 8:1" text renders under "Pivot". Same filter in glossary parsing. | `render-markdown-safe.ts:35`; `markdown-parser.ts:254` | ✔ |
| B4 | **Stray `*` inverts italics across blocks.** The textual-criticism siglum `א*` opens an `<em>` that runs to the next asterisk (across bullets/paragraphs), un-italicizing Greek terms and mis-nesting tags. ~20 blocks (Mark/John, 4 locales). `[^*]` and `[\s\S]` patterns span newlines; markers/emphasis also re-run over already-rendered table HTML. | `render-markdown-safe.ts:23-24, 76-78, 119-121` | ✔ (Mark INTRODUCTION E2) |
| B5 | **`/rules` omits Rule 30** — hardcodes 29 rules under a "Ruleset v3.4" kicker; 4 message files say "The 29 Rules"; no `rule30` keys. | `src/app/[locale]/rules/page.tsx:16,131` | ✔ |
| B6 | **404 pages render unstyled** — no `<html lang>`, no stylesheet; no `not-found.tsx` exists, root layout returns bare children. | `src/app/layout.tsx`; missing `not-found.tsx` | ✔ (curl vs production build) |
| B7 | **Reading-progress bar invisible** — `fixed top-12 z-30` sits beneath the 64px `z-40` opaque app bar since the redesign. | `src/ui/reading/reading-progress.tsx:26` | ✔ |
| B8 | WebGL hero: under reduced-motion, resize clears the canvas without redraw (blank hero); `renderer.dispose()` without `forceContextLoss()` leaks contexts across navigations. | `src/ui/marketing/separation-hero.tsx:72` | reported |
| B9 | Deeper door with a single sub-tab renders `role="tablist"`/`tab` whose `aria-controls` points to a non-existent id; People `<a>` sits inside the tablist. | `src/ui/enrichment/deeper-view.tsx:80-104` | reported |
| B10 | Copy-verse-link uses `history.replaceState` (doesn't trigger `:target` highlight); its `setTimeout` is never cleared. | `src/ui/study/copy-verse-link.tsx:19` | reported |
| B11 | DE Acts PEOPLE label `**In der Apostelgeschichte:**` (6×) is not a parser alias (`"in apostelgeschichte"` only) → `inBook` undefined. | `people-fields.ts:215` | ✔ |
| B12 | Introduction §F i18n label is dead: id `reading-in-tt` → `readingInTt` misses key `readingInTT`; falls back to authored title. | `introduction/page.tsx:67`; `introduction-view.tsx:33` | ✔ |

### 3.2 Latent risks (harmless on today's content)

- **Substring label matching** — `parseClaimType`/`parseConfidence` use `includes()` with VERIFIED first: `UNVERIFIED`/`NO VERIFICADO` → VERIFIED, `UNWAHRSCHEINLICH`/`IMPROBABLE` → PROBABLE, `IMPOSSIBLE` → POSSIBLE, all **without a warning**. No such labels exist today. (`domain/content/labels.ts:112-133`) ✔
- **Parser crashes become silent 404s** — every `read*` in `fs-content-repository.ts` wraps parse in a bare `catch {}`.
- **Chapter parser drops** any continuous-reading paragraph starting with `*` (e.g. a Rule-11 italic word) and any verse-block text after notes or `---`. Currently 0 occurrences. ✔
- `IntroductionView` never renders `section.intro` (currently 0 affected). ✔
- `hasDeeperContent` counts any section, incl. empty Sources → possible empty Deeper door.
- Table re-insertion uses `String.replace` with a string (`$&`/`$'` interpreted); no `$` in tables today. ✔
- **Hardcoded book lists**: `BOOK_ORDER`, two `HEBREW_BIBLE` sets, `bookLabels`, "Genesis 1–12" string (`people/page.tsx:137`), start-page step 5 still "coming soon" though Acts is live.
- **Sitemap/hreflang assume every locale mirrors EN** (`sitemap.ts`, `seo.ts:30`); book-level `generateStaticParams` uses `"en"`. Breaks during EN-only pilots.
- `ChapterNav` assumes contiguous chapters 1…max.
- `LegacyHashRedirect` sends `#context`/`#prophecy` to `/deeper` even where none exists.
- `JsonLd` does not escape `</script>` (author-controlled content; low).
- `DeeperView` is a client component → `ContextView` + renderer ship to the client and enrichment data is serialized twice; full message catalogue sent on every page.

### 3.3 Safety-net (gate) weaknesses

- **Conservation gate is near-tautological** — expected values are rebuilt from the same parsed objects the emitter reads (`conservation.test.ts:124-216`); compares only `.text` (not labels, markers, note types, sources); people covers only `name`. It cannot detect raw-markdown loss, and it protects `getStructuredBook`, which no page consumes.
- **Chapter completeness** only requires ≥1 verse/paragraph; exact verse counts exist only for Genesis.
- **No cross-locale parity test** — file sets, verse counts and `{a:}`/`{t:}`/`@@` counts currently hold (0 diffs), but **companion entry parity does not** (§4).
- **Label guard** covers enrichment + intro files only (not prophecy/people curiosities) and is blind to the substring upgrade above.
- **Vacuous tests** — `if (!raw) continue/return`, `if (herod)`, `if (ane)`; confidence-validity assertions that the fallback always satisfies while `console.warn` is mocked (`enrichment-parser.test.ts:289-305`, `prophecy-parser.test.ts:~65-77`, `people-parser.test.ts:35,44,261,269,350,366`).
- **Real-content tests are Genesis/John/Matthew-only**; Mark/Luke/Acts covered only generically.
- **activation-consistency** checks registry↔BOOK_ORDER↔HEBREW_BIBLE↔i18n `book.*` + one substring of content-lint; **not** `bookLabels`, `inBook` aliases, §0.12 allow-list, non-EN content, editorial log (B11 slipped through).
- **content-lint.sh:**
  - all `grep`/`perl` stderr → `/dev/null` (missing dir / bad regex = silent pass);
  - §0.3 ES diacritics scoped to NT only and a 5-word list — misses `es/genesis` (companions 4/5/7/8 largely unaccented); legacy ES diacritic rule skips mark/luke/acts;
  - §0.4 hardcodes chapters 1–3; §0.6 checks John only;
  - §0.11 backreference misses umlaut-initial names under macOS BSD grep (`Äbel (Äbel)`);
  - §0.10–§0.13 are warn-only (never fail);
  - §0.1 still treats v3.3 as current → ~110 stale `v3.3` stamps pass;
  - legacy vosotros rule is case-sensitive (`Vosotros sois dioses`, `es/genesis/study/CHAPTER-6-CONTEXT.md:93`);
  - hardcoded per-book lists (~9 places per new book); shared allow-list rule IDs (`legacy`, `0.7`).
- **No CI** (`.github/workflows` absent) and no git hooks — every gate is manual.
- Config: vitest includes only `src/**/*.test.ts`; Biome lints `src/` only (no shellcheck for `scripts/`); no `noUncheckedIndexedAccess`; **two lockfiles** (`package-lock.json` 2026-05-02, `pnpm-lock.yaml` 2026-06-14); no `engines` field despite "Node 22 LTS".

### 3.4 Design-system / accessibility / i18n debt (reported)

- Tap targets < 44×44: door-nav pills (~38px), verse "Link" (~27px), language switch (`min-h-8`), menu button (40px), nav/footer links.
- Text below floors: 10–11px mono (`globals.css:413,434,455,459,488,502,531,535,580,604,610,613`; `app-bar.tsx:112`; `notes-view.tsx:49,63`; `prophecy-view.tsx:51`); 11–12px prose in prophecy/glossary/person cards; `text-muted` (3.4:1, "large/UI only") used for small prose.
- Heading hierarchy skips (Deeper h1→h3/h4; landing h2→h4; footer h4); `people-timeline` `role="img"` hides per-person labels.
- Pure `#fff` in `[locale]/page.tsx:82`, `marketing-hero.tsx:34`, `globals.css:473,623` (blend exception, but against the no-pure-white rule).
- i18n: **key parity clean (264 keys × 4)**; unused keys `notes.notesCount`, `study.seeAlso`, `introduction.readingNote`, `landing.rulesFullLink`; hardcoded English aria-labels ("Main navigation", "Language", "Menu", "Chapter navigation", "Breadcrumb"), OG `alt` texts (11 files), root metadata description, footer "EN · PT · DE · ES"; no pluralization for `{n} chapters available`.
- Architecture: app pages import `infrastructure/i18n` directly (`sitemap.ts`, 4 `[book]` pages) instead of via `lib/`; unused exports (`localeLabels`, `redirect`, `usePathname`); inconsistent breadcrumb JSON-LD names ("Select a book" vs "Books"); app bar/footer use plain `<a>` (full reloads); language switch drops `#v{n}` anchors.
- Marker CSS comment (`globals.css:507-510`) and renderer comment still say ambiguity = "ochre"; actual CSS is body-colour bold.

---

## 4. Content findings

| Finding | Detail | ✔ |
|---|---|---|
| **Companion entries missing in PT/DE/ES** (untracked) | 9 companions have fewer `###` entries than EN: john 1 (EN 34 / others 25), matthew 1 (27/21), matthew 2 (17/15), genesis 1 (55/53), genesis 7 (33/32), genesis 11 (27/26), john 2, john 3, matthew 3 (−1 each). Not in PENDING. | ✔ |
| **"Son of Man" casing drift** | Rule 20 + genesis/john/matthew logs lock lowercase. `en/mark` 8 capitalized / 0 lowercase; `pt-br/mark/CHAPTER-2` 16× "Filho do Homem"; `en/john` mixed (11/8); `en/acts` lowercase. | ✔ |
| **DE body uses YHWH** | `de/john/PEOPLE.md:216` "vor dem Tag YHWHs" (Rule 25: DE = JHWH). | ✔ |
| **Yehudim/Jehudim** | DE content uses both (6 files "Jehudim", 12 "Yehudim"). | ✔ |
| **Authoring meta leaks into reader text** | e.g. `en/acts/CHAPTER-2.md`, `en/acts/study/CHAPTER-1-PROPHECY.md` ("JHWH in DE on propagation"); ES equivalent. | ✔ (ES) / reported |
| **ES Genesis companions unaccented** | "Capitulo", "Espanol", "Edicion", "tradicion", "raiz"… in `es/genesis/study/CHAPTER-{4,5,7,8}-CONTEXT.md`. | ✔ (ch7) |
| Unregistered label | `en/genesis/CHAPTER-3.md` uses `INTERPRETIVE` (known; PENDING). | ✔ |
| Mojibake | 9 garbled em-dashes in `en/genesis/PEOPLE.md` (incl. "Shem-to-Avram Genealogy … â Summary Table"). | ✔ |
| Stale stamps | ~110–123 non-chapter files still say `v3.3`; not caught by lint. | reported |
| Mark has no PROPHECY files | All other books have them where warranted; confirm intentional. | ✔ |

---

## 5. Governance & rule contradictions

| Topic | Contradiction |
|---|---|
| **Marker colours** | RULES-CORE §Text-Highlight Markers: `{a:}` ochre, `@@` bold. `TT-DESIGN-SYSTEM.md` + `globals.css:511-513`: `{a:}` body-colour bold (no ochre), `@@` red not bold. Code matches the design system; RULES-CORE is wrong. |
| **ψυχή / nephesh** | RULES-CORE §I3: nephesh = "soul/being". RULES-GS: ψυχή = "life/being" (MUST match HB). 1 Peter log: ψυχή = "soul". HB glossary locks only *nephesh chayah*. |
| **Ioudaioi** | RULES-GS: "Yehudim in all four target languages" vs its own glossary row DE "die Jehudim". |
| **"Son of Man"** | Rule 20 lowercase vs mark.md L52/L102 capitalized (see §4). |
| ***raqia*** | "firmament" rejected (genesis.md L18, transliteration-decisions) yet non-EN overviews gloss it "firmamento/Firmament". |
| **Name forms across logs** | Mark vs others: Moshe/Mosheh, Yesha'yahu/Yeshayahu, Natzeret/Natseret, Mattai/Mattityahu, Toma/Thomas, Bar-Talmai/Bartholomaios; DE Kafarnaum/Kapernaum, Nazaret/Nazareth; James = Iakobos (Matthew) vs Ya'aqov (Acts); Χριστός "the anointed one" vs "Messiah". GS proper-name table lacks most Mark/Luke/Acts names. |
| **New-book checklist** | RULES-CORE Rule 29: "5 synchronized changes", incl. a `people.inBook.{slug}` i18n key that does not exist. Reality: 8 touchpoints (`AUTHORING-PLAYBOOK.md` B.1), which itself still lists the non-existent key. |
| **RULES-CORE internal staleness** | "THE 29 RULES" (L90); "END OF CORE RULESET v3.3" (L1547); GS glossary/aspect/divine-name/textual tradition called "pending" (L84, Rule 9/25/26) though they exist; Rule 29 front-matter "Ruleset: v3.3" (L885); readability standard references retired "Explore and Context views" (L730); "Apply rules 1-29" (L1449); project metadata lists Gen/John/Matt only (L1539-1541); editorial-log ID formats list only Genesis/John/Matthew (L1101). |
| **Version stamps** | RULES-HB and RULES-GS carry no header version; GS history ends at v3.1; CLAUDE.md claims HB v3.3.1 / GS v3.2. No `CHANGELOG-v3.4.md`. EXECUTION_HISTORY version trail omits v3.4 (and v3.1/v3.2). |
| **Editorial-log schema** | Headers say v3.3 (genesis/john/matthew); mark.md/acts.md lack spec headers; duplicate Genesis ID suffixes (081–088); non-enum statuses ("applied", "decided", "PENDING"); missing Reviewers/Alternatives/AI-provenance fields; nothing ever `superseded` (e.g. J-004 PT "único-gerado" rejected by J-015); rule misnumbering (Rule 1 as "Source-Text Fidelity", Rule 14 as "Cross-References", Rule 17 as "Name rendering", Rule 24 as "Tier 2 cap"). |
| **Rule 28 status** | No content or log entry is `signed-off`; reviewers "unassigned" throughout; AI-provenance fields missing in early entries. |
| Tier-2 icons | RULES-CORE/HB/GS prescribe emoji note icons (🔴🟢🔵🟡, parsed in `markdown-parser.ts:14`) while the design system bans emoji as UI icons (UI renders Lucide — OK, but the rules text should say so). |

---

## 6. Open items not tracked in `PENDING.md`

- Merge decision for **1 Peter**; recovery of the **orphaned pivot commit** and its PENDING items (source-anchored Rule-28 review: PT `pairando`, PT/ES ταπείνωσις, EN-level κατέλαβεν; systemic ES pronoun-accent sweep).
- **Companion-entry parity** gap (§4) and broader PT/DE/ES thinness (`REDESIGN_MIGRATION_PLAN.md:223-227`).
- **Hebrew poetry**: RULES-HB poetry/wisdom section + version bump (`MULTI_BOOK_EXPANSION_PLAN.md:82-84,150`), lead-approved parser/UI poetic lineation (`:151`), renderer `\n`→space blocking lineation (luke.md L-002).
- **Iakobos stub dangling**: `matthew/PEOPLE.md` "Iakobos (James)" → `acts/PEOPLE.md`, which has no Iakobos/brothers entry (planned at `PLAN_ACTS_EXPANSION.md:43`).
- **DAAT plan**: unexecuted DRAFT; its proposed log ID `M-027` is already taken; overlaps Mark 3 CONTEXT (Epiphanian/Hieronymian views) and Acts 1:14.
- **Mary-as-Ark seed** still gated on "Luke authoring" though Luke 1 is authored without it (stale).
- **Unresolved since early cycle**: EN "waters" vs mass-noun "water" (genesis.md L139-144); Matthew INTRODUCTION §F4 Option-B update (matthew.md L57); DE *mavdil* confirmation (tracked).
- **Renderer/arch leftovers**: ARCHITECTURE_DRY_AUDIT F4 (Tailwind classes in `convertTable` HTML) and F5 (newline policy split) dropped between tiers; table-cell marker scan never added to the playbook (`PLAN_RENDERER_NESTED_EMPHASIS.md:103`); no i18n parity automation (`REDESIGN_MIGRATION_PLAN.md:217`); PEOPLE inline `(CLAIM — CONFIDENCE)` badges (`AUDIT_DUAL_LABEL_SSOT_PLAN.md:66-68`); Mark per-verse name re-glossing consistency (`AUDIT_MARK_EN_APPARATUS.md:59`); G-5 Etemenanki entry deferred.
- **No `AUDIT_ACTS*` file** although PENDING:34 says Acts was "audited APPROVE".

---

## 7. Documentation drift

**Core docs**
- `docs/architecture/STANDARDS.md` (dated 2026-04-21): describes non-existent files (`chapter-view.tsx`, `global-header.tsx`, `language-switcher.tsx`, `lib/cn.ts`, `middleware.ts` → actually `src/proxy.ts`, `hooks/`), a `[chapter]` route and `VALID_BOOKS`, a `useState` view toggle, "117 parser tests", "9 chapter files"; SEO table says canonical/OG/JSON-LD/sitemap "not implemented" (shipped in UX Phase 1); dependency list includes removed `gray-matter`/`framer-motion`, omits `three`.
- `docs/guides/HOW-TO-READ-TT.md`: old Reading/Study/Context modes (now Read/Notes/Deeper); doesn't explain `{t:}`/`{a:}`/`@@` colours, Greek specifics (Yehudim, *kyrios* "the Lord"); "Hebrew" throughout; tells contributors to log in `genesis.md`.
- `docs/design/TT-DESIGN-SYSTEM.md`: "migration (in progress)" note; anti-slop vocabulary "Reading / Study / Context"; inclusive section omits ES; mode-toggle `tablist` pattern predates the URL-door IA.
- `docs/templates/*`: stamped Ruleset v3.0; companion template status `draft` (not in the `provisional|reviewed|signed-off` taxonomy); "derived directly from the Hebrew text" wording for GS books; duplicated Sources table inside §I.
- `transliteration-decisions.md`: never updated since v2.4.2; missing *nephilim*/*tebah*/*gopher*/*Pesach*/*Hakeldama* and all GS terms; *Chava* contradicts its own names-out-of-scope line.

**Entry points**
- `CLAUDE.md` / `README.md`: content tree says `{genesis,john,matthew,mark}` + "en/luke — EN-only pilot" and omits Acts; `src/hooks/` doesn't exist; `ui/` list omits `marketing/`, `prophecy/`; app tree still `context/`; editorial-log lists name only genesis/john/matthew (also `docs/source-analysis/README.md:21`); `docs/guides/` omits `AUTHORING-PLAYBOOK.md`; URL table omits `/`, `/books`, `/rules`; README tech table "882 tests" vs 886 elsewhere (also `CONTRIBUTING.md:54`).
- `CONTRIBUTING.md`: co-author trailer names an outdated model; Node 22 LTS not enforced.
- `PENDING.md`: "Last updated 2026-06-21" but contains 06-22…06-24 entries; §5 still lists the `Name (Name)` cleanup (done 2026-06-20); calls `achados-arqueologicos.md` "untracked" (it is tracked); Mary-as-Ark gating stale.
- `EXECUTION_HISTORY.md`: ruleset trail omits v3.4.

**Audit archive**
- Status headers stale: `PLAN_MARK_PROPAGATION.md`/`PLAN_LUKE_EXPANSION.md` "PLANNED", `PLAN_ACTS_EXPANSION.md` "executing", `PLAN_TIER3_REUSABILITY.md` "EXECUTED" + "awaiting go-ahead", `MULTI_BOOK_EXPANSION_PLAN.md` "awaiting go-ahead" vs "APPROVED", `ARCHITECTURE_DRY_AUDIT.md` "no refactors executed", `REDESIGN_MIGRATION_PLAN.md` P6 "awaiting authorization" (merged via PRs #1–4).
- Naming drift: older `X_PLAN.md` vs newer `PLAN_X.md`; 4 plans without audits (Acts, Tier4 name-dedup, methodology-restamp, DAAT).

**Dangling references (~40)**
- `docs/audit/archive/*` (~15 files cited by EXECUTION_HISTORY and logs), `docs/feedback/*`, `docs/rules/proposals/*` (cited by RULES-CORE §G2 / Amendment protocol and the v3.3 changelog), `FIX_IMPLEMENTATION.md` (31 refs) and other removed plans; `docs/audit/PIVOT_FIDELITY_AUDIT.md` (playbook T-13; on orphaned commit); `PLAN.md` (`docs/implementation/SCHEMA-FUTURE.sql:4,482`).
- `SCHEMA-FUTURE.sql` is Markdown despite the extension; its `books` table has no Spanish name column.
- `docs/source-analysis/README.md:13`, `greek/README.md:3`, `RULES-GS.md:12` describe the Greek corpus as Mark-only/stub though `luke-1-3.md`/`acts-1-3.md` exist; worked examples cover only Gen 1:1–13 (HB) and Mark 1–3 in full (GS).

---

## 8. Coverage — what this audit did not review

1. **`origin/1-peter-expansion` in full** (plan, audit, code changes, content) — only the head of `1-peter.md` was read. Prerequisite for the merge decision.
2. **Orphaned commit `333a373`'s `content-lint.sh` diff** (§0.3b/§0.3c) — only its report and commit message were read.
3. **Systematic content rule-compliance sweep** of the 336 content files (glossary renderings per locale, Rule 20 casing, name forms vs tables, Rule 11 balance, Rule 30 scope, Rule-28 front matter, meta leaks). Only targeted scans were run. Translation-quality judgment remains the Rule-28 human reviewers' responsibility.
4. **Direct reading** of `structured.ts`, `people-parser.ts`/`people-fields.ts` in full, `globals.css`, `seo.ts`, `og.tsx`, prophecy/book-context parsers (verified by output reconciliation instead), and of the editorial logs / audit archive / source-analysis corpus (subagent digests, spot-checked).
5. **Rendered output**: no mobile/tablet/desktop visual pass across locales, no axe/Lighthouse accessibility or performance run, OG images not rendered.
6. **Deployment state** (Vercel project, production URL/parity with `main`), GitHub PR review comments and issues, and the historical `docs/redesign/` prototype pages.

---

## 9. Recommended order

1. **Baseline:** review `1-peter-expansion` (§8.1) and the orphaned commit (§8.2); decide merge/recovery.
2. **Content sweep** (§8.3) — adds items to the same fix plan.
3. **Fix plan** (`PLAN_*.md` → lead audit → gated execution):
   - quick code fixes B1–B7, B11, B12;
   - safety net: cross-locale parity test, whole-token label matching, generated lint dir lists + no stderr suppression + §0.3 scope, extended activation-consistency, **CI**.
4. **Rule/doc reconciliation** (§5, §7) — RULES-CORE marker table, ψυχή/nephesh, Yehudim, Son of Man, v3.4 changelog/stamps, STANDARDS/HOW-TO-READ/templates/README/CLAUDE.md, PENDING refresh.
5. **Visual + accessibility pass** (§8.5) as verification after fixes.

---

## 10. Project-lead Q&A (2026-11-19)

Questions from the project lead, answered on the basis of this audit.

### Q1. In one paragraph, what state is this project really in?

It's a well-engineered, carefully governed **AI-drafted translation pilot**, not yet a published translation. Six books are live on `main` in four languages: Genesis 1–12 plus chapters 1–3 of Matthew, Mark, Luke, John and Acts, about 108 chapters, each with study companions, people pages and introductions. The code is clean and its checks pass. But **no verse has been reviewed by a human scholar**: everything is `provisional`, and every reviewer role is "unassigned". The governance (30 rules, editorial logs, a plan-then-audit loop) outweighs the content, and parts of it have started contradicting each other. Work stopped in late June / early July 2026. It left a finished 1 Peter on an unmerged branch and an orphaned accuracy-fix commit, so `main` is neither the latest work nor fully correct. In short, a strong beta with a few visible bugs, a thinner safety net than the docs claim, and the review that would make it authoritative not yet started.

### Q2. What's the smallest set of work needed to put it live in a way you'd be proud of, and roughly how many days is that?

The scope is the six books as they are, launched honestly as a *provisional draft*, which the site already labels.

| Work | Days |
|---|---|
| Recover the orphaned accuracy fixes (§1); fix the reader-visible bugs (§3.1): <br>• unfinished books' chapters served publicly (B1)<br>• Sources/provenance never shown (B2)<br>• Genesis 8 table (B3)<br>• `א*` italics (B4)<br>• Rule 30 on /rules (B5)<br>• 404 page (B6)<br>• progress bar (B7)<br>• German Acts label (B11) | 2 |
| Content consistency (§4): Son of Man casing, YHWH in German, authoring notes in reader text, Spanish Genesis accents. Then **either** translate the ~30 missing companion entries in PT/DE/ES **or** state that they're English-only | 2–3 |
| Safety net (§3.3): cross-locale parity test, whole-word label matching, lint fixes, and **CI**, so launch stays correct | 1.5–2 |
| Launch basics: deployment, security headers (STANDARDS asks for CSP), a **license** (currently "TBD"), an accurate reader guide and /rules page, and a visual + accessibility pass on phone and desktop | 1.5–2 |

**Total: about 7–9 focused working days.** Add 1–2 days to review and merge 1 Peter if seven books are wanted at launch. Not included, because it's external and has no fixed timeline: Rule-28 scholarly review.

### Q3. What's fragile, half-done or likely to break, including known tech debt?

- **The markdown renderer is home-made and regex-based.** Two live bugs came from it (B3, B4), and others are waiting to surface: a stray `*` or `@@` can wreck a whole section.
- **The checks are weaker than they look.** The "zero-loss" test mostly compares the parser with itself. Nothing compares English with the other three languages, and there's no CI, so it all depends on someone remembering to run it.
- **Translating from English, not the source, introduces errors.** The unmerged pivot-fidelity audit proved it, and the missing companion entries show translations drifting out of step.
- **Adding a book means touching 8 places.** The automated check covers about half of them, and book lists are hard-coded in several more spots.
- **content-lint is a bash script** whose behaviour differs between macOS and GNU grep, that hides its own errors, and whose book lists are hard-coded.
- **Half-done:** the Sources sections; Hebrew poetry (no rules, and the renderer can't break lines); Phase 6 search; the cross-book People merge; the DAAT draft; companion parity; and `getStructuredBook`, a structured layer nothing uses.
- **Smaller debt:**
  - the WebGL hero leaks graphics contexts;
  - OG images are generated on request;
  - a parser crash shows up as a silent 404;
  - there are two lockfiles;
  - `next-env.d.ts` changes itself on every build;
  - editorial-log entries have drifted from their schema;
  - about 40 dangling doc references.

### Q4. What is blocking progress right now — technical, a decision, or something external?

- **Decisions (project lead):**
  - Merge 1 Peter? It's complete but unreviewed.
  - Launch as provisional before any scholar sign-off?
  - Are the English-only companion entries intentional?
  - Settle the rule contradictions (§5): ψυχή = soul or life/being, Son of Man casing, Yehudim/Jehudim, the marker-colour table.
- **External:** **Rule-28 reviewers.** No Hebraist, Hellenist or native-language editors are attached. That's the one thing that stops this ever becoming more than a draft.
- **Licensing:** "Formal license TBD" blocks public launch and outside contributors.
- **Technical:** nothing hard. The checks pass, and everything above is fixable.

### Q5. Is there anything you'd advise against doing next, or anything likely being underestimated?

**Advise against:**
- **Starting Genesis 13–50 or more epistles before fixing the safety net and the translation-from-English review.** Genesis 13–50 alone is about 300 files. Every systemic error found so far would be multiplied ×4 languages at that scale.
- **Merging 1 Peter without reviewing it first.** It already disagrees with the locked glossary on ψυχή ("soul" vs "life/being") and keeps the transliterated name "Kefa" where the name rule wants "Peter".
- **Running nine or more translation agents at once.** That has already truncated files (playbook trap T-17).
- **Adding more governance documents.** The current ones already contradict each other and drift. Automated checks would hold the line better than more prose.

**Likely underestimated:**
- **Rule-28 review.** Finding and paying credentialed reviewers for four languages and two source languages is the real critical path, and it's open-ended in time.
- **Public reception.** An openly AI-drafted Bible translation touching *Ioudaioi*, divine names and the "virgin/young woman" crux will be scrutinised. The project's best defence is its transparency, but the Sources and AI-provenance sections that carry that transparency are currently not shown on the site (B2).
- **Source-text rights.** Translating from NA28/BHS is normal, but how much of their critical text and apparatus the notes reproduce is worth a quick check with the Deutsche Bibelgesellschaft, which publishes both.
- **Maintenance per book.** Each book is 12–20+ files × 4 languages, plus logs and 8 code changes. Without the tooling fixes, upkeep will grow faster than content.
