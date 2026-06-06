# Phase 2 Plan — Structured Layer Pilot + Stable IDs (conservation-gated)

**Date:** 2026-06-04
**Status:** ✅ EXECUTED & VERIFIED 2026-06-04 (uncommitted). Four decisions confirmed by lead as recommended (P2-Q1=John · P2-Q2=derived-in-memory · P2-Q3=parser-emits · P2-Q4=position+slug). Conservation gate green on all 204 files (10,057 units); tests 819→826 (4 gates incl. totality guard + 3 `getStructuredBook` seam tests); build · lint · content-lint baseline all clean. New: `domain/content/ids.ts`, `domain/content/structured.ts`, `infrastructure/content/__tests__/conservation.test.ts`, `content-loader.getStructuredBook()`. Surfaced a pre-existing DE claim-type-label parser gap → `PENDING.md` §3.

> **Audit trail (pre-execution):** claims verified against codebase; one factual error in P2-Q1 corrected (John prophecy is ch.3, not ch.1). Decisions were annotated RECOMMENDED, then lead-confirmed.
**Author:** Claude Opus 4.8 (1M context)
**Parent:** `docs/audit/UX_STRUCTURE_IMPLEMENTATION_PLAN.md` (Phase 2 row) · upstream lock `docs/architecture/CONTENT-STRUCTURE-REVIEW-AND-PROPOSAL.md` (Q1=β structured layer · Q2=stable IDs · Q7=defer DB).

---

## 0. The question this plan answers

> "Do we have something in place to make sure the content will not be lost or forgotten, but it will actually be able to put everything under the new structure?"

**Today: no guard exists** — Phase 2 isn't built. This plan makes content-loss **structurally impossible** rather than a careful-human promise, by two choices that reinforce each other:

1. **Markdown stays the source of truth.** The structured layer is *derived* by the existing, already-tested parsers — nothing is hand-retyped, so nothing can be hand-dropped (P2-Q3 = parser-emits).
2. **A conservation gate** — an automated test that **fails the build** if a single unit (verse, note, glossary term, enrichment entry, prophecy entry, person, motif, intro section) is missing, miscounted, or mangled.

Phase 2 does **not ship** until the conservation gate is green on **all 204 content files**.

---

## 1. What "everything" is (the full inventory the gate must conserve)

Grounded in `src/domain/content/types.ts` + the 204 files in `content/`:

| File type | Files | Unit(s) the gate counts & content-checks |
|---|---:|---|
| `CHAPTER-N.md` | 72 | `overview`, `readingGuide`, each `continuousReading` paragraph, each `Verse` (number + `mainText`), each `Note` (type+title+content), each `GlossaryEntry`, each `SupplementarySection` |
| `study/CHAPTER-N-CONTEXT.md` | 72 | `disclaimer`, each `EnrichmentSection`, each `EnrichmentEntry` (title/claimType/confidence/content/source) |
| `study/CHAPTER-N-PROPHECY.md` | 24 | each `ProphecyEntry` (verseRef/title/textSays/context/subject/fulfillmentStatus/notes), each nested `ProphecyReading` |
| `PEOPLE.md` | 12 | each `PersonEntry` (all scalar fields + `curiosities`/`generationsFrom`/`regionsByText` sub-entries + `crossBookSee`/`inBook` stubs) |
| `INTRODUCTION.md` | 12 | `disclaimer`, each `EnrichmentSection` + `EnrichmentEntry` |
| `CONTEXT.md` (book) | 12 | `disclaimer`, each `BookContextMotif` (slug/title/claimType/confidence/chapters/body/source) |
| **Total** | **204** | — |

If a future file type or field is added, the gate's "every file → ≥1 record" and "every typed field accounted for" assertions force it to be wired in (it fails loud, not silent).

---

## 2. Decisions to lock (audit these)

### P2-Q1 — Pilot book
- **A (recommended): John** — 3 chapters; has chapters + intro + people + context + prophecy (`CHAPTER-3-PROPHECY.md`) → exercises **all six parsers** on the smallest surface. Smallest blast radius.
- B: Matthew — 3 chapters, also full-featured (prophecy on ch.1 + ch.2).
- C: Genesis — largest (12 ch), most people/genealogy; highest risk for a first pilot.

> **BAR decision = A (John)** — RECOMMENDED, annotated by Claude pending lead confirm. Verified 2026-06-04: `content/en/john/` contains CHAPTER-1..3, INTRODUCTION, PEOPLE, CONTEXT, 3× study CONTEXT, and CHAPTER-3-PROPHECY → covers every parser.

### P2-Q2 — Structured-layer format / where the structure lives
- **A (recommended): derived JSON sidecar, build-time only, in-memory.** Parsers emit a typed structured record (the existing domain types + IDs); it lives in memory at build time and optionally serialized to a git-ignored `.next`/cache artifact for search (Phase 6). **No new authoring format, no new dep, markdown untouched.**
- B: Velite/Contentlayer-style typed pipeline (new dep; replaces hand parsers over time).
- C: MDX/front-matter rewrite of the markdown (new authoring format).

> Recommendation A keeps Q7 (defer DB) honest and adds zero authoring burden. B/C are author-facing rewrites — higher loss risk, defer. **BAR decision = A (derived in-memory record)** — RECOMMENDED, annotated by Claude pending lead confirm. Rationale: zero new deps, markdown untouched, consistent with Q1=β + Q7=defer-DB.

### P2-Q3 — Migration mechanism (THE safety fork)
- **A (recommended): parser-emits-structured.** Existing parsers gain a structured emitter + deterministic IDs. Markdown is never rewritten. Loss ≈ impossible (no hand-copy step). The 819 tests stay green throughout.
- B: author-rewrite (humans move content into the new format). **This is exactly where content gets forgotten — rejected for bulk content.**

> **BAR decision = A (parser-emits-structured)** — RECOMMENDED, annotated by Claude pending lead confirm. This is the choice that directly answers the original "will content be lost?" concern: no hand-copy step exists, so bulk loss is structurally impossible; the conservation gate (§3) backstops it.

### P2-Q4 — Stable ID scheme
Locale-independent, human-readable, deterministic (derived from canonical position, not random):

```
book                      genesis
chapter                   genesis.1
verse                     genesis.1.3
note                      genesis.1.3#n2            (2nd note on the verse)
glossary entry            genesis.1#g.bara          (slug of sourceWord)
enrichment section        genesis.1.ctx#world       (section id)
enrichment entry          genesis.1.ctx#world.e1
prophecy entry            genesis.1.prophecy#e1     (or by verseRef: genesis.1.prophecy#v3)
person                    genesis.people#adam       (existing slug — already stable)
book-context motif        genesis.context#<slug>    (existing motif slug — already stable)
intro section             genesis.intro#overview    (existing section id)
```

- **A (recommended):** scheme above — reuses existing slugs/section-ids where they already exist (people, motifs, intro, enrichment sections); derives the rest from position.
- B: opaque incrementing IDs (worse: not stable across edits, not human-debuggable).

> **BAR decision = A (position+slug derived)** — RECOMMENDED, annotated by Claude pending lead confirm. Verified the reused slugs/ids all exist in `domain/content/types.ts` (`PersonEntry.slug`, `BookContextMotif.slug`, `EnrichmentSection.id`, `GlossaryEntry.sourceWord`); enrichment/prophecy *entries* have no native id, so positional `#e1`/`#n2` IDs are required (as scheme shows). · Stability rule = "IDs derive from canonical position/slug; reordering content changes positional IDs by design — slugged IDs (people, motifs, glossary) stay stable across reorder."

---

## 3. The conservation gate (Phase 2 Definition of Done)

A new test file `src/infrastructure/content/__tests__/conservation.test.ts` (joins the existing 8 suites). It runs over **all 204 files** and asserts:

**Gate 1 — Inventory (no forgotten file).**
Enumerate every `content/**/*.md`. Assert each file is claimed by exactly one parser and produces **≥1 structured record**. A new/renamed/orphan file → **fail** (this is the "forgotten" guard).

**Gate 2 — Count conservation (no silent drop).**
For each file, `count(structured units) === count(legacy parser units)` for every unit type in §1. One missing verse/note/entry → **fail**.

**Gate 3 — Content conservation (no mangling / round-trip).**
For each unit, `structured.text === legacy.text` (and typed fields equal: type, claimType, confidence, source, etc.). Whitespace-normalized equality so formatting-only changes don't false-fail, but any *content* change → **fail**.

**Gate 4 — ID integrity.**
All IDs unique within a locale; all IDs deterministic (re-parse → identical IDs); cross-references (cross-book `**See:**` people stubs, prophecy `verseRef`) resolve to a real ID or a declared dangling-pointer fallback.

**Pre-existing gates stay green:** 819 tests, `pnpm build`, `pnpm lint`, `pnpm content:lint` baseline. **Plus** the conservation gate green on 204 files. Phase 2 is not "done" until all of the above pass.

> Roll-out note: Gates 1–4 ship enabled for the **pilot book** first (P2-Q1), then flipped to all-books in the same phase once the emitter covers every parser. No silent caps — if the gate is scoped to a subset at any commit, that's stated in the commit + PENDING.

---

## 4. Work breakdown

1. **ID module** — `src/domain/content/ids.ts`: pure functions `chapterId`, `verseId`, `noteId`, … (scheme P2-Q4). Unit-tested in isolation.
2. **Structured emitter** — extend each parser (or a thin wrapper over its output) to attach IDs and produce the structured record. **No change to parser input or the 6 domain return types' existing fields** — IDs are additive.
3. **Conservation test** — Gates 1–4 above.
4. **Pilot wiring** — run emitter + gate on the pilot book (P2-Q1); confirm pages still render identically via the seam (`content-loader.ts` unchanged for consumers).
5. **Flip to all books** — enable gate on all 204 files; fix any wiring the inventory gate surfaces.
6. **Docs** — update `docs/implementation/SCHEMA-FUTURE.sql` (IDs become PKs/FKs — keeps DB-portable per Q7), editorial-log note, `EXECUTION_HISTORY.md`, refresh `PENDING.md` + CLAUDE.md scope/test lines.

**Seam discipline:** consumers keep calling `content-loader.ts`; structured records are additive. Nothing in `ui/` or `app/` changes in Phase 2 (addressable-views consumption is Phase 3).

---

## 5. Risks

| Risk | Mitigation |
|---|---|
| Emitter drifts from legacy parse | Gate 3 (content conservation) compares the two on every run — drift = red build |
| A new file type added later, unwired | Gate 1 (inventory) fails on any unclaimed/zero-record file |
| Positional IDs churn on content reorder | By design + documented; slugged IDs (people/motifs/glossary) stay stable; §A note states the rule |
| Scope creep into DB | Q7 lock = defer; IDs + `SCHEMA-FUTURE.sql` keep it portable without building it |
| Pilot → all-books reveals edge cases | Pilot first (smallest book), flip second, same phase; gate catches each |

---

## 6. Next

On approval of this plan + **P2-Q1…P2-Q4**, I execute Phase 2 as a self-contained, committable increment: ID module → emitter → conservation gate (pilot) → flip to all books → docs. Definition of Done = all four conservation gates green on 204 files **plus** the standing gates (819 tests · build · lint · content-lint). Then return for Phase 3 (addressable views) just-in-time decisions.
