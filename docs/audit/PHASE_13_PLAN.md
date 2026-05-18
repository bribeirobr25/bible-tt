# Phase 13 — Cross-Book Canonical PEOPLE: Formalization Plan

**Status:** REVISED 2026-05-18 (audit v1 absorbed; awaiting project-lead decision lock before execute)
**Scope:** Formalize the already-implemented cross-book see-only PEOPLE.md pattern; close documentation, lint, README, and policy gaps; prepare Phase 12 (Genesis 13–50) and any future-book authoring to extend canonical entries without architectural rework.
**Source:** Originally framed as a substantial architectural phase in the post-Tier-2 sequence; diagnostic gathering on 2026-05-18 found the architectural work is already largely complete.
**Governing rule:** `docs/rules/RULES-CORE.md` Rule 29 (the "People and Genealogy Files" sub-block within Rule 29's §Tier 3 enrichment-types coverage — note: this is a bold-paragraph block, **not** a markdown `##` section); CORE Rule 17 (Name rendering); RULES-HB.md §PROPER-NAME TABLE (v3.3.1); RULES-GS.md §PROPER-NAME TABLE — GREEK SCRIPTURES.
**Revisions:**
- 2026-05-18 — Initial draft.
- 2026-05-18 — Absorbed audit v1 (`docs/audit/AUDIT_PHASE_13_PLAN.md`). 1 critical (§1.2 stub count) + 2 significant (forward-tracked inBook aliases; 4/5-change new-book activation checklist) + 4 minor issues addressed (with 1 partial dissent on the §4.2 misspelling-detection claim). Audit-absorption ledger at §9.

---

## 0. TL;DR — scope reality check

The "Phase 13 — Cross-book canonical PEOPLE" item in the post-Tier-2 sequence was framed as **architectural** (refactor PEOPLE.md model, modify people-parser, define cross-book linking, dangling-pointer fallback). Diagnostic gathering 2026-05-18 shows **most of that work is already done**:

- ✅ `PersonEntry` domain has `crossBookSee` + `inBook` fields (`src/domain/content/types.ts:222-223`).
- ✅ `people-parser.ts` parses the `**See:** book/PEOPLE.md` convention with locale aliases (See/Ver/Siehe/Vea; In Matthew/Em Mateus/In Matthäus/En Mateo) at lines 70-72 + 214-228 + 678-686.
- ✅ `person-card.tsx` renders cross-book pointers via `CrossBookSeeField` component (`src/ui/people/person-card.tsx:19-50`) with `parseCrossBookSlug()` regex `^([a-z][a-z-]*)\/PEOPLE\.md$/i` and graceful dangling-pointer fallback (renders plain text when target book isn't yet authored).
- ✅ 11 production see-only stubs across 4 locales × 2 NT books currently in use:
  - Matthew 1 patriarchs (Avraham, Yitschaq, Ya'aqov, Yehudah, Tamar, Rachav, Rut) → `genesis/PEOPLE.md` (resolved).
  - Matthew Iakobos → `acts/PEOPLE.md` (forward — graceful fallback).
  - John (Yochanan, Yeshua) → `matthew/PEOPLE.md` (resolved).
  - John (Mosheh, Eliyahu, Yeshayahu) → `exodus/PEOPLE.md`, `kings/PEOPLE.md`, `isaiah/PEOPLE.md` (forward — graceful fallback).
- ✅ Parser tests cover crossBookSee + inBook (5 tests in `people-parser.test.ts:411-470`).
- ✅ Zero true duplicates between books (Gen ∩ Matt ∩ John full-entry intersection is empty).

**What's actually left for Phase 13** is **formalization, documentation, lint, and minor polish** — not architecture. This plan is correspondingly smaller (~3-5h, not the 20+h a true architectural phase would require). Phase 12 (Genesis 13-50) will then extend canonical entries (Yitschaq, Ya'aqov, Yosef, etc.) without any architectural rework needed.

---

## 1. Pinned verified facts (as of 2026-05-18)

### 1.1 Current cross-book pattern (already in production)

**Domain type** (`src/domain/content/types.ts:181-224`):
```typescript
export interface PersonEntry {
  // ... 40+ canonical fields (name, slug, originType, lifespan, etc.) ...
  crossBookSee?: string;   // e.g., "genesis/PEOPLE.md"
  inBook?: string;          // per-book narrative role (e.g., "First in the genealogy at Matt 1:2")
}
```

**Authoring convention** (markdown):
```markdown
## Avraham (Abraham)
**See:** genesis/PEOPLE.md
**In Matthew:** First in the genealogy (1:2); the genealogy begins with "son of Avraham" (1:1)...
```

**Parser behavior** (`src/infrastructure/content/people-parser.ts`):
- `**See:**` / `**Ver:**` / `**Siehe:**` (case-insensitive) → `crossBookSee` field (line 215).
- `**In Matthew:**` / `**Em Mateus:**` / `**In Matthäus:**` / `**En Mateo:**` etc. → `inBook` field (lines 218-228; new locales added per book).
- See-only stubs are still parsed as full `PersonEntry` records; canonical biographical fields (lifespan, father, etc.) simply remain `undefined`.

**UI rendering** (`src/ui/people/person-card.tsx`):
- `CrossBookSeeField` component (lines 19-50) renders the pointer.
- If target book is in `bookLabels` map (currently `{ genesis, matthew, john }` per `src/app/[locale]/[book]/people/page.tsx:137-141`) → renders as `<Link>` to `/{locale}/{slug}/people`.
- Else (e.g., `acts`, `exodus`, `kings`, `isaiah`) → graceful fallback: renders the raw pointer string as plain text without a link. No broken-link error.

### 1.2 Production see-only stubs (CORRECTED 2026-05-18 per audit-v1 §3.1)

| File | Stub count | Targets |
|---|---|---|
| `content/{4 locales}/matthew/PEOPLE.md` | 6 per locale × 4 = 24 | 5× genesis/PEOPLE.md (**Avraham, Yitschaq, Ya'aqov, Yehudah, Tamar**), 1× acts/PEOPLE.md (Iakobos) |
| `content/{4 locales}/john/PEOPLE.md` | 5 per locale × 4 = 20 | 2× matthew/PEOPLE.md (Yochanan, Yeshua), 1× exodus/PEOPLE.md (Mosheh), 1× kings/PEOPLE.md (Eliyahu), 1× isaiah/PEOPLE.md (Yeshayahu) |

**Inventory by canonical home (verified 2026-05-18 via Python read of all 4 locales):**
- **Genesis** (canonical home for OT figures from Gen 1-12): 26 full entries, 0 see-only. Matthew's 5 genesis-targeted stubs (Avraham, Yitschaq, Ya'aqov, Yehudah, Tamar) point here.
- **Matthew** (canonical home for NT figures not in John, PLUS Rachav and Rut whose canonical OT homes are Joshua + Ruth — not yet authored): 11 full entries (Herodes, Yosef, Miryam, Yochanan the Immerser, Yeshua, Rachav, Rut, Uriyah, David, Shelomoh, and others), 6 see-only.
- **John**: 7 full entries (Andreas, Shimon Kefa, Philippos, Nathanael, Nikodemos, Yehudim group, plus one more), 5 see-only (defers Yochanan + Yeshua to matthew; defers Mosheh/Eliyahu/Yeshayahu forward to future books).

**Note on Rachav and Rut (corrected per audit-v1):** the original plan-draft erroneously listed Rachav and Rut as genesis-targeted see-only stubs. Verified by direct read: both are **full entries** in `matthew/PEOPLE.md` (× 4 locales). Their canonical biographical material lives in matthew because (a) their narrative roles surface in Matthew 1's genealogy of the Messiah, AND (b) their canonical OT homes (Joshua for Rachav, the book of Ruth for Rut) are not yet authored. Once those OT books are added in Phase 14+, the matthew entries may either become see-only stubs or remain as full entries with the OT books holding parallel canonical material — that's a decision deferred to the relevant authoring phase.

### 1.3 Test coverage (already in place)

`src/infrastructure/content/__tests__/people-parser.test.ts:411-470` — 5 tests under `describe("cross-book see-only entries (Phase 6 follow-up)")`:
- `extracts crossBookSee + inBook for EN Avraham (Matthew)` ✓
- `extracts inBook across all 4 locales for see-only entries` ✓
- `PT-BR Matthew Yeshua resolves Menções extrabíblicas (no hyphen)` ✓
- additional locale + alias-resolution tests

`scripts/content-lint.sh` enforcement:
- `§0.6` — John PEOPLE.md presence per locale (added Phase 10, 2026-05-14) ✓
- `§0.7a/b` — leftover TT heading / dead H1 ✓
- `§0.8` — PEOPLE.md heading transliteration=familiar collision (uses perl, with `Iakobos`/`Ya'aqov` allow-list per Possible-Content Bundle Q5) ✓

### 1.4 Documentation gaps (the actual work for Phase 13)

| Gap | Severity | Where |
|---|---|---|
| README.md line 68: "The John PEOPLE.md is not yet authored" — STALE (authored 2026-05-14 Phase 10) | High | `README.md:68` |
| README.md line 121: "Markdown parsed at build time (4 parsers)" — STALE (5+ parsers exist: markdown, enrichment, people, prophecy, introduction, book-context) | High | `README.md:121` (added per audit-v1 §5.1) |
| README.md line 122: "Vitest (796 tests across 6 files)" — STALE (819 tests across 8 files at 2026-05-18) | High | `README.md:122` (added per audit-v1 §5.1) |
| README.md line 125: project-state snapshot from 2026-05-09 — way out of date (multiple sweeps + amendments since) | High | `README.md:125` |
| README.md line 145: project-structure comment `# 4 parsers + i18n config` — STALE | Medium | `README.md:145` (added per audit-v1 §5.1) |
| RULES-CORE.md Rule 29 "**People and Genealogy Files:**" bold-paragraph block (verified at ~line 779; **NOT** a markdown `##` section — important for amendment authoring): mentions "cross-book canonical entries added when multiple books exist" but does NOT formalize the `**See:** book/PEOPLE.md` convention | Medium | RULES-CORE.md Rule 29 §People and Genealogy Files block (note: structurally a `**Bold:**` paragraph within Rule 29 territory, not a discrete `##` section — amendment must respect this) |
| No content-lint rule for cross-book pointer validity (a typo like `**See:** geneis/PEOPLE.md` would silently pass and render as plain text via the graceful fallback) | Low-medium | `scripts/content-lint.sh` |
| No documented "forward-tracked books" allow-list (which target slugs are valid in a see-only stub? Currently the parser accepts any `[a-z][a-z-]*/PEOPLE.md` shape) | Medium | rules + repo |
| **Parser `inBook` alias coverage gap (audit-v1 §3.2):** `EXACT_LABEL_ALIASES.inBook` covers matthew/genesis/john × 4 locales (12 aliases) but does NOT cover the 4 forward-tracked target books (`acts`, `exodus`, `kings`, `isaiah`). When those books are authored and their PEOPLE.md files contain `**In Acts:**` / `**In Kings:**` etc., the parser will silently parse those fields as `undefined`. **Forward-tracking authoring trap.** | Significant | `src/infrastructure/content/people-parser.ts:218-228` |
| **New-book activation requires 4 synchronized changes (audit-v1 §3.3) — only 1 currently documented:** when a new book with PEOPLE.md is authored, the changes are (1) author content; (2) extend `bookLabels` in `people/page.tsx`; (3) extend `EXACT_LABEL_ALIASES.inBook` in `people-parser.ts`; (4) add `people.inBook.{book}` i18n key × 4 locales; (5 if Q1=A) add slug to §0.12 lint allow-list. The "Add new entries here" comment in `people/page.tsx` only flags #2. | Significant | rules + CLAUDE.md + checklist documentation |
| No editorial-log convention for cross-book canonical-entry transitions (when Phase 12 lands Genesis 13-50 and adds Yitschaq/Ya'aqov full bios, Matthew see-only stubs auto-resolve — but is that transition logged?) | Low | rules + log convention |
| No CLAUDE.md mention of the cross-book pattern (architecture summary in `## Architecture` section doesn't reference PEOPLE.md cross-book linking) | Low-medium | `CLAUDE.md` |

**Note: `people.crossBookSee` i18n key (audit-v1 §5.4)** — **VERIFIED EXISTS in all 4 locales** post-audit. Not a gap. Values: EN `"See full bio in"`; PT-BR `"Veja biografia completa em"`; DE `"Vollständige Biographie siehe"`; ES `"Vea biografía completa en"`. Step 6 verification will re-confirm at execution time.

**Note: within-file vs cross-book duplicate framing (audit-v1 §5.5)** — the `flushEntry()` `console.warn` for duplicate slugs is a **per-file** check (catches two entries with the same slug within one PEOPLE.md, e.g., the resolved `Iakobos`/`Ya'aqov` near-collision in matthew). It is **not** a cross-book duplicate check. Cross-book duplicate prevention is by editorial discipline (the see-only convention) + the Q1 lint rule, not by the parser. The "zero true duplicates between books" claim at §0 refers to cross-book content-level duplicates and remains correct.

### 1.5 Code architecture compliance (already correct)

Per `docs/architecture/STANDARDS.md`:
- ✅ §1 DDD layers: PersonEntry type lives in `domain/`; parser in `infrastructure/`; UI component in `ui/`; loader in `lib/`. Cross-book pointers flow `domain → infrastructure → ui` correctly.
- ✅ §3 Service-Agnostic: `fs-content-repository.ts:121-144` lists books dynamically (filesystem scan) — no hard-coded `VALID_BOOKS`. The `bookLabels` map in `[book]/people/page.tsx:137-141` is the only locale-aware label registry and is explicitly extensible per the comment "Add new entries here as new books are authored."
- ✅ §6 File decoupling: `parseCrossBookSlug()`, `CrossBookSeeField`, and bookLabels are properly separated.
- ✅ §7 Error handling: dangling pointer → graceful UI fallback (plain text); no exceptions; no broken-link 404.
- ✅ §13 TypeScript: `crossBookSee?: string` is `strict`-safe optional.
- ✅ §14 Testing: 5 parser tests + the `§0.6` content-lint guard.

### 1.6 Design system compliance (already correct)

Per `docs/design/TT-DESIGN-SYSTEM.md`:
- ✅ Cross-book pointer renders with the established `Field` component pattern (label + value typography).
- ✅ No emoji, no decorative animation, no card-soup proliferation. The dangling-pointer fallback is austere by design — no broken-link icon, no warning UI; just the slug text.
- ✅ Anti-slop: a future canonical entry will simply make the link active; no UI churn needed.

---

## 2. Out-of-scope

- **Architectural refactor of PersonEntry** — the domain type is correct as-is.
- **Migration of duplicate entries** — there are no duplicates to migrate (verified).
- **Phase 12 Genesis 13-50 authoring** — that's its own phase. Phase 13 is preparation only.
- **Cross-canonical PEOPLE structure (single master file per person)** — rejected as over-engineering. The per-book file + see-only pointer pattern is the right granularity for the static-content model. A master file per person would conflict with `static-first` + `URL as truth` + `one PEOPLE.md per book/locale` principles in STANDARDS.md §1-2.
- **Removing the dangling-pointer graceful fallback** — explicitly required for forward references (acts, exodus, kings, isaiah). Not a bug; a feature.
- **Adding active hyperlinks to unauthored books** — would create dead links; the fallback's plain-text rendering is the correct behavior.
- **Modifying the books-derived-dynamically architecture** (`listBooks()` in `fs-content-repository.ts:121`) — already correct per STANDARDS.md §3.

---

## 3. Decision questions

### Q1 — Forward-tracked-books allow-list scope

The parser accepts ANY `[a-z][a-z-]*/PEOPLE.md` shape in a `**See:**` stub. Should we:

**Option A — Document an explicit allow-list of valid target slugs (RECOMMENDED):**
- Codify in RULES-CORE.md §People and Genealogy Files: valid `**See:**` targets are (a) any currently-authored book (genesis, john, matthew today) OR (b) a forward-tracked future book on a published list (e.g., `acts`, `exodus`, `kings`, `isaiah` — the 4 currently in use).
- Add a content-lint rule (`§0.12` warn-only) that flags `**See:**` pointers to slugs outside the published list.
- Pros: prevents typos (`geneis/PEOPLE.md`); makes forward references intentional; gives future authors a vetted list.
- Cons: requires maintaining the allow-list; adds friction when authoring a new book that wants to forward-reference yet-another book.

**Option B — Keep current free-form behavior; add a content-lint warning only when the target slug doesn't match the regex** (e.g., uppercase, malformed):
- Less friction; less coverage of typos.
- Pros: lighter touch; matches the dynamic-discovery spirit of `listBooks()`.
- Cons: typos like `geneis/PEOPLE.md` still pass silently.

**Option C — No new lint rule; rely on UI fallback to surface issues at render time:**
- Pros: zero new infrastructure.
- Cons: silent failure — a typo'd pointer simply renders as plain text; the dangling-pointer fallback masks the bug.

**My recommendation: Option A.** It's a small one-time rules-amendment + one warn-only lint rule. Matches the project's existing rigor (every recent phase has added a content-lint rule for the pattern it touched).

### Q2 — Rules-amendment pathway

Per RULES-CORE.md §AMENDMENT & LOCK PROTOCOL (§1054), formalizing the cross-book PEOPLE convention is an amendment to a locked rule. Path:

**Option A — Emergency amendment with proposal file (RECOMMENDED, matches v3.3.1 DE-name-rendering precedent):**
- Author `docs/rules/proposals/v3.3.2-cross-book-PEOPLE-formalization.md`.
- Append clarification paragraph to RULES-CORE.md §People and Genealogy Files (or RULES-HB.md §PROPER-NAME TABLE notes — whichever fits structurally).
- Add v3.3.2 entry to `docs/rules/CHANGELOG-v3.3.md`.
- Pros: matches the precedent set 2026-05-18 (DE familiar-names was v3.3.1); compliant with Lock Protocol; gives future authors a single canonical reference.
- Cons: small overhead (proposal file + CHANGELOG entry).

**Option B — No formal amendment; document in editorial-log entry only:**
- Pros: zero rules-file touch.
- Cons: the convention stays distributed across the editorial logs; future authors must hunt to find it.

**My recommendation: Option A.** Same reasoning as the DE familiar-names v3.3.1 amendment — the convention exists, the implementation is correct; formalizing it in the rules file means future authors find it where they look first.

### Q3 — Editorial-log convention for cross-book canonical-entry transitions

When Phase 12 lands Genesis 13-50 and adds full canonical entries for Yitschaq, Ya'aqov, Yosef (patriarch), Yehudah (patriarch), etc., the existing Matthew see-only stubs (`**See:** genesis/PEOPLE.md`) auto-resolve from "dangling, plain-text fallback" to "active link." This is a meaningful transition: a person who was previously a stub in two locales is now a full entry. Should it be logged?

**Option A — Log when the canonical entry is first authored (RECOMMENDED):**
- The Phase 12 authoring entry that adds Yitschaq to `genesis/PEOPLE.md` mentions in cross-references: "Resolves see-only stubs at `matthew/PEOPLE.md` × 4 locales."
- Pros: tracks the transition without a separate log entry; uses the existing per-book editorial log.
- Cons: requires Phase 12 authors to remember to mention this.

**Option B — Add a separate editorial-log entry per cross-book canonical-entry transition:**
- Pros: explicit audit trail.
- Cons: log bloat for a routine event.

**Option C — Don't log; the parser + UI handle the transition automatically:**
- Pros: zero overhead.
- Cons: no audit trail for a meaningful change in reader experience.

**My recommendation: Option A.** The cross-reference mention in the Phase 12 authoring entry is sufficient and matches the project's existing editorial-log style.

### Q4 — README.md staleness fix scope

README.md line 68 and line 125 are stale (claim John PEOPLE.md unauthored; project-state snapshot from 2026-05-09). What's the scope of the README refresh in this phase?

**Option A — Targeted fix: update lines 68 + 125 only (RECOMMENDED):**
- Pros: minimal touch; preserves the rest of the README which may be largely correct.
- Cons: needs verification that other README sections are also up-to-date.

**Option B — Full README audit + refresh:**
- Pros: brings README fully in sync with current project state.
- Cons: scope creep; large effort if other sections also need work.

**Option C — README refresh is out of Phase 13 scope; just document the staleness for a future phase:**
- Pros: keeps Phase 13 focused on the cross-book pattern itself.
- Cons: leaves a known-stale public document.

**My recommendation: Option A** — targeted fix in this phase, with a quick scan to confirm no other obviously-stale sections need same-batch attention. If a larger refresh is needed, surface that finding before deciding.

### Q5 — CLAUDE.md update scope

CLAUDE.md's `## Architecture` section doesn't mention the cross-book PEOPLE pattern. Should this phase add it?

**Option A — Add a short paragraph to CLAUDE.md `## Architecture` (RECOMMENDED):**
- One paragraph: "PEOPLE.md uses a per-book canonical-entry + see-only-stub pattern. Cross-book pointers via `**See:** book/PEOPLE.md` ..."
- Pros: future-Claude (and future-developer) finds the convention in the project guide.
- Cons: small overhead.

**Option B — Leave CLAUDE.md unchanged; the convention is documented in RULES-CORE.md (per Q2):**
- Pros: less redundancy.
- Cons: CLAUDE.md is the project-guide doc; omitting an architectural convention there is a gap.

**My recommendation: Option A.** Same reasoning as Q2 — finders need to find it where they look first.

---

## 4. Alternatives considered (and rejected)

- **Refactor PersonEntry to a discriminated union** (`{ type: "canonical" } | { type: "see-only" }`) instead of the current single type with optional `crossBookSee`/`inBook` fields: rejected because the current single-type design works correctly with the parser (a see-only entry simply has all canonical fields undefined). Adding a discriminator would force a parser rewrite and a UI rewrite for negligible benefit.
- **Master-file-per-person model** (one canonical file per person, with book-specific extensions): rejected as conflicting with STANDARDS.md §1 (DDD per-book content layout), §3 (per-book repositories), and the `URL as truth` principle. The static-content architecture is best served by per-book files.
- **Drop the dangling-pointer graceful fallback** (require all targets to resolve at build time): rejected because forward references are intentional and necessary (Phase 12 will land acts/PEOPLE.md eventually; we want the matthew stubs to point there now).
- **Convert the existing dangling-pointer fallback to a build-time error** (fail fast if a `**See:**` target doesn't resolve): rejected because the project explicitly supports forward references to unauthored books (the 4 currently-dangling targets are pre-authored stubs for content yet to come).
- **Add a hard-coded `VALID_BOOKS` constant** matching `listBooks()` dynamic output: rejected per STANDARDS.md §3 (Service-Agnostic Abstraction Layer — books are derived dynamically; hard-coding would couple the domain to the current filesystem layout).
- **Defer Phase 13 entirely until after Phase 12** (let Genesis 13-50 land, then audit cross-book coverage): rejected because the current state has a stale README (item 68 claims John PEOPLE.md unauthored — false), a missing rules-level formalization, and no lint enforcement against typos. These are small but real gaps.

---

## 5. Execution plan (post-decision lock)

### Step 0 — Lock decisions + verify baseline (audit-v1 §5.3 made explicit)

- Project lead answers Q1–Q5 via AskUserQuestion.
- **Mandatory pre-execution baseline run** — DO NOT assert from this plan; run fresh:
  - `pnpm test` → record actual count. (Plan-time baseline: 819 — verified at draft time.)
  - `pnpm content:lint` → record actual warning count + rule IDs. (Plan-time baseline: 2 warnings — §0.10 + §0.11 — both warn-only.)
  - `pnpm build` → record clean.
  - `pnpm lint` → record clean.
  - Use these recorded numbers as the Step 6 verification baseline. If any differs from the plan-time figures, investigate before proceeding.

### Step 1 — Rules amendment (per Q2)

**Pre-Step-1 verification (audit-v1 §4.1):** before authoring the proposal, re-read the RULES-CORE.md Rule 29 "People and Genealogy Files" bold-paragraph block to confirm its exact structure. Per draft-time verification, it is a `**Bold:**` paragraph block (NOT a `##` markdown section) at approximately line 779. The amendment must extend the existing block (or add a new bold-paragraph sibling below it), not create a new `##` section.

**If Q2 = A (RECOMMENDED):**
1. Author `docs/rules/proposals/v3.3.2-cross-book-PEOPLE-formalization.md` with: proposal text, impact assessment (no signed-off verses affected, additive clarification), version bump notation.
2. Append clarification paragraph(s) to RULES-CORE.md Rule 29 §People and Genealogy Files block. Cover:
   - The per-book canonical-entry + see-only-stub pattern.
   - The `**See:** {book}/PEOPLE.md` markdown convention.
   - The `**In {Book}:**` field for per-book narrative role.
   - Allow-list of valid target slugs (per Q1): currently-authored books OR forward-tracked future books (acts, exodus, kings, isaiah — the 4 in use).
   - When to use see-only vs. full canonical entry.
   - The locale-translation table for `See` / `In <Book>` labels (already in `people-parser.ts`).
   - **New-book activation checklist (5 synchronized changes per audit-v1 §3.3) — REQUIRED for any new book with a PEOPLE.md:**
     1. Author `content/{en,pt-br,de,es}/{book}/PEOPLE.md` (all 4 locales).
     2. Extend `bookLabels` map in `src/app/[locale]/[book]/people/page.tsx` with `{book}: t("book.{book}")`.
     3. Extend `EXACT_LABEL_ALIASES.inBook` in `src/infrastructure/content/people-parser.ts` with the 4 locale forms (`"in {book}"`, `"em {locale-name}"`, `"in {locale-name}"`, `"en {locale-name}"`).
     4. Add `people.inBook.{book}` translation key to each of `src/infrastructure/i18n/messages/{en,pt-br,de,es}.json`.
     5. (If Q1 = A) Add `{book}` to the `§0.12` content-lint allow-list in `scripts/content-lint.sh`.
   - **Forward-tracking caveat (audit-v1 §3.2):** when a new book is authored, BEFORE its PEOPLE.md is parsed in CI, the `EXACT_LABEL_ALIASES.inBook` aliases MUST already be in place. Otherwise the parser will silently drop `**In {Book}:**` fields. Recommend adding parser aliases ahead of content authoring (the parser aliases are zero-cost when the book isn't yet authored — they just match nothing).
3. Update `docs/rules/CHANGELOG-v3.3.md` with the v3.3.2 emergency-amendment entry.

**If Q2 = B:** skip the rules amendment; rely on the editorial-log entry only. The 5-change checklist still goes into the editorial-log entry as a non-rule documentation artifact.

### Step 2 — Content-lint enforcement (per Q1)

**If Q1 = A (RECOMMENDED):**
1. Add `scripts/content-lint.sh` rule `§0.12 — cross-book PEOPLE pointer validity` (warn-only):
   - Pattern: extract every `^\*\*See:\*\* ([a-z][a-z-]*)/PEOPLE\.md` (and locale aliases `Ver`, `Siehe`, `Vea`) and validate the captured slug is in the allow-list `{genesis, matthew, john, acts, exodus, kings, isaiah}` (the currently-published list per Q1 allow-list decision).
   - Warn-only because legitimate new forward references should not break the build; project lead can promote to blocking if drift becomes a problem.
2. Verify the rule fires correctly on a synthetic typo (e.g., `**See:** geneis/PEOPLE.md`) in a test fixture.

**Ordering dependency (audit-v1 §4.2):** the §0.12 allow-list must be updated in the SAME commit as the first stub referencing a new slug. Adding the slug to the allow-list BEFORE the stub exists is harmless (warns on nothing); adding the stub WITHOUT the allow-list update will produce a lint warning. The new-book activation checklist (Step 1, item 5) makes this explicit.

**Partial dissent on audit-v1 §4.2 misspelling claim:** the audit asserted that "misspellings of slugs in the allow-list" pass silently. This plan retains the §0.12 design as the right defense — a misspelling like `geneis/PEOPLE.md` is **outside** the allow-list (the allow-list contains the literal string `genesis`, not `geneis`), so §0.12 WOULD flag it. The audit's claim only holds if a misspelling accidentally matches a different allow-listed slug (e.g., typing `acts` when intending `actsy`), which is a far rarer authoring error and not worth additional infrastructure to catch. The dangling-pointer UI fallback remains the second-layer defense for any pointer that passes §0.12 but fails to resolve in `bookLabels` at render time.

**If Q1 = B or C:** skip §0.12 lint rule. The dangling-pointer fallback remains the only defense against typos.

### Step 3 — README.md refresh (per Q4)

**If Q4 = A (RECOMMENDED, targeted fix — expanded scope per audit-v1 §5.1):**
- Update README.md line 68: "Currently authored for **Genesis**, **John**, and **Matthew** in all four locales."
- Update README.md line 121: "Markdown parsed at build time (5+ parsers)" — verify exact parser count by `ls src/infrastructure/content/*.ts | grep -c parser`. Current count: 6 (markdown, enrichment, people, prophecy, introduction, book-context).
- Update README.md line 122: "Vitest (819 tests across 8 files)" — use actual current count from Step 0 baseline.
- Update README.md line 125: replace the 2026-05-09 project-state snapshot with the current state (2026-05-18 after the Tier-2 + DE-familiar-names + encoding-recovery sweeps). Use the same condensed-paragraph form, citing the editorial-log anchor entries.
- Update README.md line 145: project-structure comment `# 4 parsers + i18n config` → updated parser count.
- Quick scan: check that other README sections (Tech stack, Architecture, Commands, etc.) aren't materially stale. Spot-fix obvious staleness if found; surface a follow-up if substantial.

**If Q4 = B:** full audit of every README section (~1-2h extra).

**If Q4 = C:** skip; add forward-tracking item to PENDING.md.

### Step 4 — CLAUDE.md update (per Q5)

**If Q5 = A (RECOMMENDED):**
- Add a short paragraph to CLAUDE.md `## Architecture` section explaining the cross-book PEOPLE pattern. Cite RULES-CORE.md §People and Genealogy Files (or the Q2 amendment).

**If Q5 = B:** skip CLAUDE.md update.

### Step 5 — Editorial-log entry

Add one anchor entry documenting this phase:
- `docs/editorial-log/genesis.md` Entry `2026-05-MM-NNN` (genesis as anchor because Genesis is the canonical OT home; even though this phase touches RULES-CORE.md primarily, the architectural-formalization is genesis-rooted).
- Body: phase summary, Q1-Q5 decisions, files touched, cross-references to the v3.3.2 proposal + CHANGELOG entry + content-lint rule + README + CLAUDE.md.
- AI provenance + Rule 28 metadata.

### Step 6 — Verification

- `pnpm test` → expect: unchanged baseline (no new parser tests added — the existing 5 cross-book tests already cover the pattern). Baseline recorded in Step 0.
- `pnpm content:lint` → expect: Step 0 baseline (currently 2 warnings — §0.10 + §0.11) + (if Q1=A) the new §0.12 rule (warn-only; current production content should pass since the 4 forward-tracked slugs are in the allow-list).
- `pnpm build` → clean.
- `pnpm lint` → clean.
- **i18n key verification (audit-v1 §5.4):** confirm `people.crossBookSee` exists in all 4 locale message files (`en.json`, `pt-br.json`, `de.json`, `es.json`). Plan-time verification confirmed all 4 locales have the key. Re-confirm at execution time.
- **`EXACT_LABEL_ALIASES.inBook` coverage check (audit-v1 §3.2):** if any new books are introduced in this phase (none planned), confirm parser aliases are extended. None planned, so this is a no-op check; document the requirement for future phases.
- **CrossBookSeeField rendering spot-check:** if MCP browser is available, navigate to `/en/matthew/people` and verify (a) a resolving cross-book pointer (e.g., Avraham → genesis) renders as an active link; (b) a dangling pointer (Iakobos → acts) renders as plain text without a broken link.

### Step 7 — Stage for project-lead commit (per Q6 from prior phases — manual commits)

All changes staged but not committed. Project lead reviews and commits.

---

## 6. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Allow-list (Q1) gets out of sync with reality when a new book is authored | Allow-list lives in one place (the content-lint rule §0.12). Updating it is part of the new-book-authoring 5-change checklist documented in the rules amendment (Q2). |
| Rules amendment breaks the Lock Protocol's "no signed-off verses affected" test | This is a clarificational amendment to a rule about authoring convention; it doesn't change translation choices or interpretive framing. Impact assessment in the proposal file documents this. |
| README refresh introduces NEW staleness (e.g., I update line 125 but miss other places) | Q4 = A targeted fix + quick scan; if substantial gaps surface, escalate scope decision before editing. |
| The §0.12 lint rule fires false positives on legitimate forward references | Allow-list explicitly includes the 4 currently-published forward-tracked slugs (`acts`, `exodus`, `kings`, `isaiah`). Adding a new forward reference requires updating the allow-list — that's the intentional friction. |
| CLAUDE.md paragraph (Q5) duplicates RULES-CORE.md text | The paragraph in CLAUDE.md is a pointer + 2-3-sentence summary, not a verbatim duplicate; treats RULES-CORE.md as the canonical source. |
| **Forward-tracked `inBook` aliases not added before book is authored (audit-v1 §3.2)** — silent parse failure | New-book activation checklist (Step 1, item 3) makes this explicit. Recommend adding parser aliases ahead of content authoring as a one-line zero-cost addition. |
| **New-book activation forgets a synchronization step (audit-v1 §3.3)** — UI shows wrong labels or empty fields | The 5-change checklist documents all sync points; checklist is added to the rules amendment (or editorial log if Q2 = B). |
| §1.2 stub count drift from reality after authoring | Spot-check via grep in any phase that authors new see-only stubs; the audit-v1 §3.1 correction process is documented in §9 ledger as a template. |

---

## 7. Rollback plan

- Single-commit atomic rollback per the established Q6 commit cadence (project lead commits manually; one commit per phase).
- All changes are additive (no existing content rewritten; no existing tests modified; no parser logic changed). Rollback restores the prior state cleanly.

---

## 8. Estimated effort

- Step 0 (decisions): ~10 min (AskUserQuestion).
- Step 1 (rules amendment per Q2): ~45 min (proposal file + RULES-CORE.md append + CHANGELOG).
- Step 2 (content-lint §0.12 per Q1): ~20 min (add rule + test fixture).
- Step 3 (README refresh per Q4): ~20-30 min (targeted fix + scan).
- Step 4 (CLAUDE.md update per Q5): ~10 min (paragraph).
- Step 5 (editorial-log entry): ~20 min.
- Step 6 (verification): ~10 min.
- **Total: ~2.5-3 hours.**

If the project lead chooses Option B/C on multiple questions, effort drops accordingly (minimum ~30 min if everything is "skip").

---

## 9. Audit-absorption ledger

**Audit source:** `docs/audit/AUDIT_PHASE_13_PLAN.md` (Claude Opus 4.7, 2026-05-18, independent review).
**Method:** Each finding re-verified against current files before absorbing. Verifications performed against: `content/{en,pt-br,de,es}/matthew/PEOPLE.md` (per-locale Python parse of see-only stubs); `docs/rules/RULES-CORE.md` lines 770-790 (verify section structure); `README.md` lines 68/121/122/125/145 (verify staleness); `src/infrastructure/i18n/messages/{en,pt-br,de,es}.json` (verify `people.crossBookSee` key exists); `src/infrastructure/content/people-parser.ts:215-228` (verify `EXACT_LABEL_ALIASES.inBook` coverage gap).

| Audit finding | Severity | Verification result | Absorption status | Plan updates |
|--------------|---------|---------|---------|---------|
| §3.1 §1.2 stub count inconsistency — "5× genesis" with 7 names | **Critical** | **VERIFIED CORRECT** — Python read of all 4 locales' `matthew/PEOPLE.md` confirms 6 see-only stubs: Avraham, Yitschaq, Ya'aqov, Yehudah, Tamar → genesis (5×) + Iakobos → acts (1×). Rachav and Rut are **full entries** in matthew (not see-only stubs); the plan-draft erroneously listed them. | **ABSORBED** | §1.2 table corrected: 5 names listed (Avraham, Yitschaq, Ya'aqov, Yehudah, Tamar). Inventory paragraph corrected to clarify Rachav + Rut are matthew full entries (canonical OT homes Joshua + Ruth are not yet authored). |
| §3.2 `inBook` parser aliases don't cover forward-tracked books — silent parse failure | **Significant** | **VERIFIED CORRECT** — `EXACT_LABEL_ALIASES.inBook` at `people-parser.ts:218-228` covers only matthew/genesis/john × 4 locales (12 aliases). `acts`/`exodus`/`kings`/`isaiah` aliases absent. When those books are authored, `**In Acts:**` / `**In Kings:**` etc. fields will silently parse as `undefined`. | **ABSORBED** | §1.4 added new "Significant" gap row. Step 1 rules-amendment text expanded to require parser-alias extension in the new-book activation checklist (Step 1, item 3). Step 6 verification adds a coverage check. §6 Risks updated with the forward-tracked-aliases item. |
| §3.3 New-book activation requires 4-5 synchronized changes; plan documents only 1 | **Significant** | **VERIFIED CORRECT** — full traversal of the activation path: (1) content; (2) `bookLabels`; (3) `EXACT_LABEL_ALIASES.inBook`; (4) `people.inBook.{book}` i18n key × 4 locales (verified existing keys: `people.inBook.genesis`, `people.inBook.matthew`, `people.inBook.john` all present in all 4 locale message files at draft time); (5 if Q1=A) §0.12 lint allow-list. The "Add new entries here" comment in `people/page.tsx` only flags #2. | **ABSORBED** | Step 1 rules-amendment text adds explicit "New-book activation checklist (5 synchronized changes)" block. §6 Risks expanded with new-book-activation-sync-gap entry. |
| §4.1 RULES-CORE.md §People and Genealogy Files location unverified | Significant | **VERIFIED — and structurally important.** `**People and Genealogy Files:**` is a `**Bold:**` paragraph block within Rule 29 (at approximately line 779), **NOT** a markdown `##` section. The audit's concern was right: amendment authoring must respect this structure (extend the existing block or add a sibling bold-paragraph block, not create a new section). | **ABSORBED** | Plan header `**Governing rule:**` line updated to note "bold-paragraph block, NOT a markdown `##` section." Step 1 prefaced with explicit re-verification of the block structure before drafting the proposal. |
| §4.2 Q1 allow-list ordering dependency + misspelling caveat | Minor (ordering); **DISSENT** (misspelling) | **VERIFIED PARTIAL** — Ordering dependency claim is correct: allow-list must be updated in the same commit as the first stub using a new slug. **Misspelling claim is incorrect:** a misspelling like `geneis/PEOPLE.md` is **outside** the allow-list (which contains only the literal string `genesis`), so §0.12 WOULD flag it. The audit's reasoning here is logically inconsistent. | **PARTIAL ABSORPTION + DOCUMENTED DISSENT** | Step 2 adds explicit "Ordering dependency" note + step 1 item 5 in the activation checklist. Step 2 adds a "Partial dissent on misspelling claim" paragraph explaining why §0.12 does catch typos like `geneis`. The dangling-pointer UI fallback remains the second-layer defense for any pointer that passes §0.12 but fails to resolve in `bookLabels`. |
| §5.1 Additional README staleness (test count, parser count) | Minor | **VERIFIED CORRECT** — Lines 121 ("4 parsers"), 122 ("Vitest (796 tests across 6 files)"), 145 (project-structure comment) all stale per current 819 tests / 8 test files / 6 parsers. | **ABSORBED** | §1.4 table expanded with 3 additional README staleness rows. Step 3 expanded with corresponding updates. |
| §5.2 Line-number citation fragility | Minor | **VERIFIED PATTERN** — same lesson as AUDIT_PHASE_8_PLAN §3.1, AUDIT_DE_FAMILIAR_NAMES_PLAN §5.2, AUDIT_TIER_2_NOTE_BLOAT_PLAN §5.1. | **ABSORBED** | Plan header and Step 1 use section-path citations primarily; line numbers as secondary aids. |
| §5.3 Content-lint baseline assertion should be verified | Minor | **VERIFIED CORRECT** — `pnpm content:lint` shows actual current baseline (2 warnings, §0.10 + §0.11 both warn-only); plan-time assertion was correct, but the process discipline of always re-verifying at execution time is right. | **ABSORBED** | Step 0 made explicit: "Mandatory pre-execution baseline run — DO NOT assert from this plan; run fresh." Plan-time figures preserved as reference. |
| §5.4 `people.crossBookSee` i18n key existence unverified | Minor | **VERIFIED EXISTS in all 4 locales** — Python read confirms EN `"See full bio in"`, PT-BR `"Veja biografia completa em"`, DE `"Vollständige Biographie siehe"`, ES `"Vea biografía completa en"`. Not a gap. | **NOTED IN §1.4 + ADDED TO STEP 6 VERIFICATION** | §1.4 ends with explicit "i18n key VERIFIED" note with all 4 values. Step 6 adds re-verification at execution time (defensive check). |
| §5.5 "Zero duplicates" framing — within-file vs cross-book | Minor | **VERIFIED CONCEPTUAL CLARIFICATION** — `flushEntry()` `console.warn` is per-file (catches within-PEOPLE.md duplicate slugs like the resolved Iakobos/Ya'aqov case). Cross-book content-level duplication prevention is by editorial discipline + the see-only convention + Q1 lint rule, not by the parser. | **ABSORBED** | §1.4 ends with explicit "within-file vs cross-book" clarification paragraph. The "zero true duplicates between books" claim at §0 remains correct (refers to cross-book content-level). |

---

## 10. Decision-lock summary

| Question | Decision | Date |
|----------|---------|------|
| Q1 (forward-tracked allow-list + lint) | **Option A — Allow-list + §0.12 warn-only** | 2026-05-18 |
| Q2 (rules-amendment pathway) | **Option A — Emergency amendment v3.3.2 with proposal file + RULES-CORE.md amendment + CHANGELOG entry** | 2026-05-18 |
| Q3 (editorial-log convention for transitions) | **Option A — Mention stub resolution in the parent authoring entry (e.g., Phase 12)** | 2026-05-18 |
| Q4 (README refresh scope) | **Option C — DEFER to a separate phase; add forward-tracking item to PENDING.md** | 2026-05-18 |
| Q5 (CLAUDE.md update) | **Option A — Add short paragraph to `## Architecture` section** | 2026-05-18 |

Plan ready for execution. Steps 1, 2, 4, 5 in scope. Step 3 (README) deferred per Q4=C — add PENDING.md tracker as part of Step 5 logging.
